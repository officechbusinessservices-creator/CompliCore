import { headers } from 'next/headers'
import Stripe from 'stripe'
import { getCurrentUser } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Plan configuration with activation fee
const PLAN_CONFIG: Record<string, { monthlyPrice: number; activationFee: number; name: string }> = {
  launch: {
    monthlyPrice: 34900,
    activationFee: 49900,
    name: 'Launch',
  },
  growth: {
    monthlyPrice: 89900,
    activationFee: 99900,
    name: 'Growth',
  },
  ops_stack: {
    monthlyPrice: 249900,
    activationFee: 199900,
    name: 'Ops Stack',
  },
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const { plan_name } = body

    if (!plan_name || !PLAN_CONFIG[plan_name]) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan name' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const plan = PLAN_CONFIG[plan_name]
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create Stripe checkout session with monthly subscription + activation fee
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `CompliCore+ ${plan.name} Plan`,
              description: `${plan.name} plan for property management automation`,
            },
            unit_amount: plan.monthlyPrice,
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.name} Plan - Activation Fee`,
              description: 'One-time setup and onboarding fee',
            },
            unit_amount: plan.activationFee,
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        workspace_id: user.workspace_id,
        plan_name,
        user_id: user.id,
        activation_fee: plan.activationFee.toString(),
      },
      success_url: `${baseUrl}/dashboard/flows?checkout=success`,
      cancel_url: `${baseUrl}/pricing?checkout=canceled`,
    })

    if (!session.url) {
      return new Response(
        JSON.stringify({ error: 'Failed to create checkout session' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    const err = error as Error
    console.error('Checkout error:', err)

    return new Response(
      JSON.stringify({
        error: 'Failed to create checkout session',
        message: err.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
