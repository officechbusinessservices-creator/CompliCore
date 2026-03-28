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
        setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const workspaceId = req.nextUrl.searchParams.get('workspace_id')
  if (!workspaceId) return NextResponse.json({ error: 'workspace_id_required' }, { status: 400 })

  const { data: member } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  if (!member) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { data: flows, error } = await supabase
    .from('flows')
    .select('id, name, slug, type, status, billing_state, last_run_at, created_at')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })

  return NextResponse.json({ flows: flows || [] })
}
