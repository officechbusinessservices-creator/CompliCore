import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { workspace_id, scenario = 'leasing_inquiry', lead } = body

    const events = [
      { type: 'lead_received', detail: `"${lead?.message || 'Inquiry received'}"`, delay_ms: 0 },
      { type: 'response_sent', detail: 'Contextual reply dispatched in 4 seconds', delay_ms: 4000 },
      { type: 'follow_up_scheduled', detail: 'Reminder queued for 24h if no reply', delay_ms: 4200 },
      { type: 'routed', detail: 'Classified as leasing inquiry → leasing team', delay_ms: 4400 },
    ]

    // If workspace provided, log demo events
    if (workspace_id) {
      const eventRecords = events.map((e) => ({
        workspace_id,
        scenario,
        event_type: e.type,
        payload: { detail: e.detail },
      }))
      await supabase.from('demo_events').insert(eventRecords)
    }

    return NextResponse.json({
      ok: true,
      scenario,
      events: events.map((e) => ({
        type: e.type,
        detail: e.detail,
      })),
    })
  } catch (err) {
    console.error('[simulate-lead] error:', err)
    return NextResponse.json({ ok: false, error: 'simulation_failed' }, { status: 500 })
  }
}
