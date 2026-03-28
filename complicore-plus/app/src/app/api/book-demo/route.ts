import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function sanitize(val: unknown): string {
  if (typeof val !== 'string') return ''
  return val.trim().slice(0, 1000)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const name = sanitize(body.name)
    const email = sanitize(body.email)
    const company = sanitize(body.company)
    const portfolio_size = sanitize(body.portfolio_size)
    const message = sanitize(body.message)

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: 'invalid_input', message: 'name and email are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'invalid_input', message: 'invalid email address' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('demo_bookings')
      .insert({
        name,
        email,
        company: company || null,
        portfolio_size: portfolio_size || null,
        message: message || null,
        source_page: req.headers.get('referer') || null,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[book-demo] supabase error:', error)
      return NextResponse.json(
        { ok: false, error: 'booking_failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, id: data.id, message: 'Demo booked successfully' })
  } catch (err) {
    console.error('[book-demo] unexpected error:', err)
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 })
  }
}
