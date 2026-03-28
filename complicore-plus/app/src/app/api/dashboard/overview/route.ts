import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const workspaceId = req.nextUrl.searchParams.get('workspace_id')
  if (!workspaceId) {
    return NextResponse.json({ error: 'workspace_id_required' }, { status: 400 })
  }

  // Verify membership
  const { data: member } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  if (!member) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  // Parallel data fetch
  const [workspaceRes, flowsRes, subscriptionRes, metricsRes, activityRes] = await Promise.all([
    supabase.from('workspaces').select('id, name, status').eq('id', workspaceId).single(),
    supabase
      .from('flows')
      .select('id, name, status, billing_state')
      .eq('workspace_id', workspaceId),
    supabase
      .from('subscriptions')
      .select('status, base_flow_count, additional_flow_count, total_entitled_flows, current_period_end')
      .eq('workspace_id', workspaceId)
      .single(),
    supabase
      .from('workspace_response_time_metrics')
      .select('median_first_response_time_seconds, leads_responded, total_leads')
      .eq('workspace_id', workspaceId)
      .single(),
    supabase
      .from('lead_events')
      .select('id, event_type, created_at')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const activeFlowCount = (flowsRes.data || []).filter((f) => f.status === 'active').length

  return NextResponse.json({
    workspace: workspaceRes.data,
    metrics: {
      median_first_response_time_seconds:
        metricsRes.data?.median_first_response_time_seconds ?? null,
      active_flow_count: activeFlowCount,
      leads_responded_30d: metricsRes.data?.leads_responded ?? 0,
      total_leads_30d: metricsRes.data?.total_leads ?? 0,
    },
    billing: {
      status: subscriptionRes.data?.status ?? 'none',
      total_entitled_flows: subscriptionRes.data?.total_entitled_flows ?? 0,
      current_period_end: subscriptionRes.data?.current_period_end ?? null,
    },
    flows: flowsRes.data ?? [],
    recent_activity: activityRes.data ?? [],
  })
}
