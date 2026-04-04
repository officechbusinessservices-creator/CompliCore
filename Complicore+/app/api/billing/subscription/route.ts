import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GET /api/billing/subscription
// Returns the authenticated workspace's subscription state.
// Reads from Supabase (written by webhook handler) — never from Stripe directly
// on this path, to avoid latency on dashboard loads.
// Billing-critical surfaces must revalidate via the webhook truth.

export async function GET() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: name => cookieStore.get(name)?.value,
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: member } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', session.user.id)
    .limit(1)
    .single()

  if (!member) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 })
  }

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select(
      'status, activation_fee_paid, plan_name, current_period_end, stripe_subscription_id'
    )
    .eq('workspace_id', member.workspace_id)
    .single()

  if (error) {
    // No subscription row yet — workspace not yet through checkout.
    return NextResponse.json({ status: 'inactive', activation_fee_paid: false })
  }

  return NextResponse.json({
    status: subscription.status,
    activation_fee_paid: subscription.activation_fee_paid,
    plan_name: subscription.plan_name,
    current_period_end: subscription.current_period_end,
    // stripe_subscription_id intentionally excluded from response
  })
}
