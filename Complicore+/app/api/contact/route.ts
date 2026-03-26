import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ContactFormData {
  name: string
  email: string
  phone?: string
  company: string
  unitCount: string
  currentPMS: string
  message?: string
  agreedToFollowUp: boolean
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactFormData

    // Validate required fields
    if (!body.name || !body.email || !body.company || !body.unitCount || !body.currentPMS) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          required: ['name', 'email', 'company', 'unitCount', 'currentPMS'],
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
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

    // Create lead record in database
    const { data: lead, error: dbError } = await supabase
      .from('demo_booking')
      .insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone || null,
          company_name: body.company,
          unit_count: body.unitCount,
          current_pms: body.currentPMS,
          message: body.message || null,
          agreed_to_followup: body.agreedToFollowUp,
          source: 'contact_form',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save inquiry' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // TODO: Send confirmation email via email service
    // - Email to prospect with acknowledgment
    // - Email to sales team with lead details

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Inquiry received. We will be in touch within 24 hours.',
        booking_id: lead?.id,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    const err = error as Error
    console.error('Contact submission error:', err)

    return new Response(
      JSON.stringify({
        error: 'Failed to process inquiry',
        message: err.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
