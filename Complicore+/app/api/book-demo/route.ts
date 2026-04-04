import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface BookDemoData {
  // Qualification
  propertyType: string
  unitCount: string
  currentTools: string[]
  infoSource: string
  // Contact
  name: string
  email: string
  phone: string
  propertyName: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BookDemoData

    // Validate required fields
    const requiredFields = [
      'propertyType',
      'unitCount',
      'currentTools',
      'infoSource',
      'name',
      'email',
      'phone',
      'propertyName',
    ]

    for (const field of requiredFields) {
      if (!body[field as keyof BookDemoData]) {
        return new Response(
          JSON.stringify({
            error: `Missing required field: ${field}`,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate phone format (basic)
    const phoneRegex = /^[0-9\-\(\)\s\+]+$/
    if (!phoneRegex.test(body.phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Create demo booking record in database
    const { data: booking, error: dbError } = await supabase
      .from('demo_booking')
      .insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          company_name: body.propertyName,
          property_type: body.propertyType,
          unit_count: body.unitCount,
          current_tools: body.currentTools,
          info_source: body.infoSource,
          source: 'book_demo_form',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to create demo booking' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // TODO: Send confirmation email to prospect
    // - Welcome email with scheduled demo time or next steps

    // TODO: Send notification email to sales team
    // - Lead details and qualification info

    // TODO: Initiate Stripe checkout for activation fee (optional flow)
    // - User can opt in to activate immediately or just book demo

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo booking confirmed. We will be in touch within 24 hours.',
        booking_id: booking?.id,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    const err = error as Error
    console.error('Book demo error:', err)

    return new Response(
      JSON.stringify({
        error: 'Failed to book demo',
        message: err.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
