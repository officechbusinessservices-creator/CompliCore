import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PACKAGE_CONFIG: Record<string, { baseFlows: number; additionalFlows: number }> = {
  launch: { baseFlows: 1, additionalFlows: 0 },
  growth: { baseFlows: 3, additionalFlows: 0 },
  ops: { baseFlows: 5, additionalFlows: 0 },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { workspace_id, package: pkg, additional_flow_count = 0 } = body

    if (!workspace_id || typeof workspace_id !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'invalid_input', message: 'workspace_id required' },
        { status: 400 }
      )
    }

    const isAddFlow = pkg === 'add_flow'

    // Validate workspace exists and is eligible
    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .select('id, status, stripe_customer_id')
      .eq('id', workspace_id)
      .single()

    if (wsError || !workspace) {
      return NextResponse.json(
        { ok: false, error: 'workspace_not_found' },
        { status: 404 }
      )
    }

    if (isAddFlow && workspace.status !== 'active') {
      return NextResponse.json(
        { ok: false, error: 'workspace_not_eligible', message: 'workspace must be active to add flows' },
        { status: 403 }
      )
    }

    if (!isAddFlow && workspace.status !== 'inactive') {
      return NextResponse.json(
        { ok: false, error: 'workspace_not_eligible', message: 'workspace already activated' },
        { status: 403 }
      )
    }

    const config = isAddFlow ? null : PACKAGE_CONFIG[pkg]
    if (!isAddFlow && !config) {
      return NextResponse.json(
        { ok: false, error: 'invalid_package' },
        { status: 400 }
      )
    }

    const baseFlows = config?.baseFlows ?? 0
    const addFlows = isAddFlow ? (additional_flow_count || 1) : config?.additionalFlows ?? 0

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    if (!isAddFlow) {
      // One-time activation fee
      lineItems.push({
        price: process.env.STRIPE_PRICE_ACTIVATION!,
        quantity: 1,
      })
      // Base flow subscription
      lineItems.push({
        price: process.env.STRIPE_PRICE_FLOW_BASE!,
        quantity: baseFlows,
      })
    }

    if (addFlows > 0) {
      lineItems.push({
        price: process.env.STRIPE_PRICE_FLOW_ADDITIONAL!,
        quantity: addFlows,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: isAddFlow ? 'subscription' : 'payment',
      line_items: lineItems,
      customer: workspace.stripe_customer_id || undefined,
      metadata: {
        workspace_id,
        package: pkg,
        base_flow_count: String(baseFlows),
        additional_flow_count: String(addFlows),
        activation_included: String(!isAddFlow),
      },
      success_url: `${appUrl}/dashboard?activated=true`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    })

    return NextResponse.json({ ok: true, checkout_url: session.url })
  } catch (err) {
    console.error('[create-checkout] error:', err)
    return NextResponse.json({ ok: false, error: 'checkout_creation_failed' }, { status: 500 })
  }
}
