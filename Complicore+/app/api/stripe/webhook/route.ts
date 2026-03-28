import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

// Valid subscription statuses across both subscriptions and workspaces tables
type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'inactive' | 'pending_activation'

// POST /api/stripe/webhook
// Stripe webhook handler — the single source of truth for all billing state.
// All subscription_status and activation_fee_paid fields are written here.
// Never written from any other route or UI component.

// Service-role client — bypasses RLS to write billing tables.
function getServiceRoleClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )
}

// Resolve workspace_id from Stripe metadata or customer lookup.
async function resolveWorkspaceId(
  supabase: ReturnType<typeof getServiceRoleClient>,
  metadata: Stripe.Metadata | null,
  stripeCustomerId?: string
): Promise<string | null> {
  if (metadata?.workspace_id) return metadata.workspace_id

  if (stripeCustomerId) {
    const { data } = await supabase
      .from('subscriptions')
      .select('workspace_id')
      .eq('stripe_customer_id', stripeCustomerId)
      .single()
    return data?.workspace_id ?? null
  }

  return null
}

// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[webhook] Signature verification failed: ${message}`)
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 })
  }

  const supabase = getServiceRoleClient()

  try {
    switch (event.type) {
      // ── Checkout completed — write customer and initial subscription row ───
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const workspaceId = await resolveWorkspaceId(
          supabase,
          session.metadata,
          session.customer as string | undefined
        )

        if (!workspaceId) {
          console.error('[webhook] checkout.session.completed: workspace_id not found', session.id)
          break
        }

        await supabase.from('subscriptions').upsert(
          {
            workspace_id: workspaceId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string | undefined,
            status: 'pending_activation',
            activation_fee_paid: false,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'workspace_id' }
        )
        break
      }

      // ── First invoice paid — confirm activation ───────────────────────────
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const workspaceId = await resolveWorkspaceId(supabase, null, customerId)
        if (!workspaceId) {
          console.error('[webhook] invoice.paid: workspace_id not found for customer', customerId)
          break
        }

        // Upsert subscription state.
        await supabase.from('subscriptions').upsert(
          {
            workspace_id: workspaceId,
            stripe_customer_id: customerId,
            stripe_subscription_id: invoice.subscription as string | undefined,
            status: 'active',
            activation_fee_paid: true,
            current_period_end: invoice.period_end
              ? new Date(invoice.period_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'workspace_id' }
        )

        // Transition workspace subscription_status.
        await supabase
          .from('workspaces')
          .update({ subscription_status: 'active' })
          .eq('id', workspaceId)

        // Activate all inactive flows for this workspace.
        await supabase
          .from('flows')
          .update({ status: 'active', activated_at: new Date().toISOString() })
          .eq('workspace_id', workspaceId)
          .eq('status', 'inactive')

        // Record invoice.
        await supabase.from('invoices').upsert(
          {
            workspace_id: workspaceId,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: invoice.status ?? 'paid',
            invoice_url: invoice.hosted_invoice_url,
            issued_at: new Date(invoice.created * 1000).toISOString(),
          },
          { onConflict: 'stripe_invoice_id' }
        )
        break
      }

      // ── Payment failure — mark workspace past_due ─────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const workspaceId = await resolveWorkspaceId(supabase, null, customerId)
        if (!workspaceId) break

        await supabase
          .from('subscriptions')
          .update({ status: 'past_due', updated_at: new Date().toISOString() })
          .eq('workspace_id', workspaceId)

        await supabase
          .from('workspaces')
          .update({ subscription_status: 'past_due' })
          .eq('id', workspaceId)
        break
      }

      // ── Subscription updated — sync period end and status ─────────────────
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string

        const workspaceId = await resolveWorkspaceId(supabase, null, customerId)
        if (!workspaceId) break

        const status: SubscriptionStatus = sub.status === 'active' ? 'active'
          : sub.status === 'past_due' ? 'past_due'
          : sub.status === 'canceled' ? 'cancelled'
          : 'inactive'

        await supabase
          .from('subscriptions')
          .update({
            status,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('workspace_id', workspaceId)

        await supabase
          .from('workspaces')
          .update({ subscription_status: status })
          .eq('id', workspaceId)
        break
      }

      // ── Subscription cancelled ────────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string

        const workspaceId = await resolveWorkspaceId(supabase, null, customerId)
        if (!workspaceId) break

        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('workspace_id', workspaceId)

        await supabase
          .from('workspaces')
          .update({ subscription_status: 'cancelled' })
          .eq('id', workspaceId)

        // Deactivate all flows.
        await supabase
          .from('flows')
          .update({ status: 'inactive' })
          .eq('workspace_id', workspaceId)
          .eq('status', 'active')
        break
      }

      default:
        // Unhandled event — log and return 200 to prevent Stripe retries.
        console.log(`[webhook] Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    // Hard fail on billing state writes to surface errors immediately.
    console.error(`[webhook] Handler error for ${event.type}:`, err)
    return NextResponse.json({ error: 'Internal error processing webhook' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
