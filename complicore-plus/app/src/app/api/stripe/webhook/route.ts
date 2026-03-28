import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 })
  }

  // Idempotency check
  const { data: existing } = await supabase
    .from('stripe_events')
    .select('id, processed')
    .eq('stripe_event_id', event.id)
    .single()

  if (existing?.processed) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  // Upsert event record
  await supabase.from('stripe_events').upsert({
    stripe_event_id: event.id,
    event_type: event.type,
    processed: false,
    payload: event as unknown as Record<string, unknown>,
  })

  try {
    switch (event.type) {
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      default:
        // Log unhandled events but do not error
        break
    }

    // Mark processed
    await supabase
      .from('stripe_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('stripe_event_id', event.id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[stripe-webhook] processing error for ${event.type}:`, err)
    return NextResponse.json({ error: 'processing_failed' }, { status: 500 })
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = invoice.subscription as string | null
  const metadata = invoice.metadata as Record<string, string>
  const workspaceId = metadata?.workspace_id

  if (!workspaceId) {
    console.warn('[stripe-webhook] invoice.paid missing workspace_id in metadata')
    return
  }

  // Upsert invoice record
  await supabase.from('invoices').upsert({
    workspace_id: workspaceId,
    stripe_invoice_id: invoice.id,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'paid',
    hosted_invoice_url: invoice.hosted_invoice_url,
    invoice_pdf: invoice.invoice_pdf,
    period_start: invoice.period_start
      ? new Date(invoice.period_start * 1000).toISOString()
      : null,
    period_end: invoice.period_end
      ? new Date(invoice.period_end * 1000).toISOString()
      : null,
  })

  if (!subscriptionId) return

  // Fetch subscription for entitlement data
  const sub = await stripe.subscriptions.retrieve(subscriptionId)
  const subMeta = sub.metadata as Record<string, string>
  const baseFlows = parseInt(subMeta?.base_flow_count || '1', 10)
  const additionalFlows = parseInt(subMeta?.additional_flow_count || '0', 10)

  // Activate workspace
  await supabase
    .from('workspaces')
    .update({ status: 'active', stripe_customer_id: customerId })
    .eq('id', workspaceId)

  // Upsert subscription
  await supabase.from('subscriptions').upsert({
    workspace_id: workspaceId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    status: 'active',
    base_flow_count: baseFlows,
    additional_flow_count: additionalFlows,
    current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
  })

  // Unlock entitled flows (up to baseFlows count of default flows)
  const { data: flows } = await supabase
    .from('flows')
    .select('id, slug')
    .eq('workspace_id', workspaceId)
    .eq('is_system_default', true)
    .eq('status', 'locked')
    .order('created_at', { ascending: true })
    .limit(baseFlows + additionalFlows)

  if (flows && flows.length > 0) {
    await supabase
      .from('flows')
      .update({ status: 'inactive', billing_state: 'billing' })
      .in('id', flows.map((f) => f.id))
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const metadata = invoice.metadata as Record<string, string>
  const workspaceId = metadata?.workspace_id
  if (!workspaceId) return

  await supabase
    .from('workspaces')
    .update({ status: 'past_due' })
    .eq('id', workspaceId)

  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('workspace_id', workspaceId)

  // Pause all active flows
  await supabase
    .from('flows')
    .update({ status: 'paused', billing_state: 'past_due' })
    .eq('workspace_id', workspaceId)
    .eq('status', 'active')
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const metadata = sub.metadata as Record<string, string>
  const workspaceId = metadata?.workspace_id
  if (!workspaceId) return

  const baseFlows = parseInt(metadata?.base_flow_count || '1', 10)
  const additionalFlows = parseInt(metadata?.additional_flow_count || '0', 10)

  await supabase.from('subscriptions').upsert({
    workspace_id: workspaceId,
    stripe_customer_id: sub.customer as string,
    stripe_subscription_id: sub.id,
    status: sub.status as 'active' | 'past_due' | 'canceled',
    base_flow_count: baseFlows,
    additional_flow_count: additionalFlows,
    current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
  })
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const metadata = sub.metadata as Record<string, string>
  const workspaceId = metadata?.workspace_id
  if (!workspaceId) return

  await supabase
    .from('workspaces')
    .update({ status: 'canceled' })
    .eq('id', workspaceId)

  await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('workspace_id', workspaceId)

  await supabase
    .from('flows')
    .update({ status: 'paused', billing_state: 'not_billing' })
    .eq('workspace_id', workspaceId)
    .in('status', ['active', 'inactive'])
}
