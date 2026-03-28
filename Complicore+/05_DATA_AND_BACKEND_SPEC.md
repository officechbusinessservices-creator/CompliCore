# 05_DATA_AND_BACKEND_SPEC.md

## Stack
- Next.js
- TypeScript
- Supabase
- Stripe
- Vercel
- API Routes or Server Actions

## Core tables
### users
- id
- email
- full_name
- created_at

### workspaces
- id
- name
- created_at
- subscription_status
- primary_kpi_response_time

### workspace_members
- id
- workspace_id
- user_id
- role

### flows
- id
- workspace_id
- type
- name
- status
- activated_at
- monthly_price

### flow_runs
- id
- flow_id
- lead_id nullable
- status
- started_at
- completed_at
- outcome
- error_code nullable

### leads
- id
- workspace_id
- source
- contact_name
- contact_email
- inquiry_text
- created_at
- first_response_at nullable

### lead_events
- id
- lead_id
- event_type
- event_payload
- created_at

### subscriptions
- id
- workspace_id
- stripe_customer_id
- stripe_subscription_id
- plan_name
- status
- activation_fee_paid
- current_period_end

### invoices
- id
- workspace_id
- stripe_invoice_id
- amount
- currency
- status
- invoice_url
- issued_at

### demo_bookings
- id
- full_name
- email
- company
- unit_count
- booked_at
- source_page

### demo_events
- id
- session_id
- event_type
- event_payload
- created_at

## Auth strategy
- Supabase Auth
- JWT session
- Row-level security
- Protected dashboard routes
- Optional magic link later

## Stripe objects
- Customer
- Checkout Session
- Subscription
- Invoice
- Webhook events for paid activation and billing status reconciliation

## API contracts
- POST /api/demo/simulate-lead
- POST /api/demo/simulate-routing
- GET /api/flows
- PATCH /api/flows/:id/toggle
- GET /api/leads
- GET /api/metrics/response-time
- POST /api/book-demo
- POST /api/stripe/create-checkout
- POST /api/stripe/webhook
- GET /api/billing/subscription

## Real-time rules
- Live timeline via Supabase realtime for demo and flow runs
- Dashboard KPI refresh via polling or subscriptions
- Never show synthetic revenue or fake subscription state

## Caching
- Marketing pages statically generated
- Dashboard server-rendered with selective client hydration
- Stripe state cached short-term but always verified server-side for billing-critical surfaces

## Error handling
- Retry non-critical timeline fetches
- Hard fail on billing inconsistency
- Sanitize input on public forms
- Validate Stripe state server-side before unlocking activation-dependent UI

## Technical constraints
- No synthetic finance data
- No hardcoded MRR
- No fake subscription state
- No plan logic inside presentation components
