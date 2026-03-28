import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { stripe, STRIPE_PRICE_IDS } from '@/lib/stripe/client'

// POST /api/stripe/create-checkout
// Creates a Stripe Checkout Session for the $1,500 activation fee +
// the first recurring flow subscription.
// Requires an authenticated session; workspace_id is read from the
// authenticated user's membership — never from the request body.

export async function POST(req: NextRequest) {
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
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Resolve workspace_id from membership table — never trust client input.
  const { data: member, error: memberError } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(id, name)')
    .eq('user_id', session.user.id)
    .limit(1)
    .single()

  if (memberError || !member) {
    return NextResponse.json({ error: 'No workspace found for user' }, { status: 404 })
  }

  const workspaceId = member.workspace_id

  // Guard: do not create a second checkout if already activated.
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, activation_fee_paid')
    .eq('workspace_id', workspaceId)
    .single()

  if (subscription?.activation_fee_paid === true) {
    return NextResponse.json(
      { error: 'Workspace is already activated' },
      { status: 409 }
    )
  }

  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL!

  // Guard: validate Origin header to prevent CSRF attacks
  const allowedOrigins = [process.env.NEXT_PUBLIC_SITE_URL]
  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { error: 'Invalid origin' },
      { status: 403 }
    )
  }

  // Create Checkout Session with:
  //  1. One-time activation fee ($1,500)
  //  2. First flow subscription ($349/month)
  // Stripe Checkout subscription mode supports both one-time and recurring
  // line items. The activation fee is charged immediately with the subscription.
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: session.user.email,
    line_items: [
      {
        price: STRIPE_PRICE_IDS.activation,
        quantity: 1,
      },
      {
        price: STRIPE_PRICE_IDS.flowFirst,
        quantity: 1,
      },
    ],
    subscription_data: {
      metadata: {
        workspace_id: workspaceId,
      },
    },
    payment_method_types: ['card'],
    metadata: {
      workspace_id: workspaceId,
      type: 'activation',
    },
    success_url: `${origin}/dashboard/overview?activated=true`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    allow_promotion_codes: false,
  })

  if (!checkoutSession.url) {
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }

  return NextResponse.json({ url: checkoutSession.url })
}
