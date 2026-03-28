import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { target_status } = body

  if (!['active', 'paused'].includes(target_status)) {
    return NextResponse.json({ error: 'invalid_status' }, { status: 400 })
  }

  // Fetch flow + workspace
  const { data: flow } = await supabase
    .from('flows')
    .select('id, status, billing_state, workspace_id')
    .eq('id', params.id)
    .single()

  if (!flow) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  // Auth check
  const { data: member } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', flow.workspace_id)
    .eq('user_id', user.id)
    .single()

  if (!member || !['owner', 'admin'].includes(member.role)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  // Business rules
  if (flow.status === 'locked') {
    return NextResponse.json(
      { error: 'flow_locked', message: 'Activate your system to unlock this flow.' },
      { status: 422 }
    )
  }

  if (target_status === 'active') {
    const { data: ws } = await supabase
      .from('workspaces')
      .select('status')
      .eq('id', flow.workspace_id)
      .single()

    if (ws?.status !== 'active') {
      return NextResponse.json(
        { error: 'workspace_not_active', message: 'Workspace must be active to enable flows.' },
        { status: 422 }
      )
    }

    // Check entitlement
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('total_entitled_flows')
      .eq('workspace_id', flow.workspace_id)
      .single()

    const { count: activeCount } = await supabase
      .from('flows')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', flow.workspace_id)
      .eq('status', 'active')

    if (sub && (activeCount ?? 0) >= sub.total_entitled_flows) {
      return NextResponse.json(
        { error: 'entitlement_exceeded', message: 'Add a flow to your subscription to activate more.' },
        { status: 422 }
      )
    }
  }

  const { data: updated, error } = await supabase
    .from('flows')
    .update({ status: target_status, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select('id, name, status, billing_state')
    .single()

  if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 })

  return NextResponse.json({ ok: true, flow: updated })
}
