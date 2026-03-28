# 01_ARCHITECTURE_SPEC.md

## Overview
- **Product type:** Conversion-first B2B SaaS website with interactive demo, Stripe activation, and authenticated operator dashboard
- **Primary audience:** Residential property managers with 50–500 units
- **Core business goals:** booked demos, paid activations, expanded active flows

## Site map
### Public marketing site
- /
- /pricing
- /demo
- /book-demo
- /faq

### SEO / use-case pages
- /property-management-ai
- /lead-response-automation
- /leasing-follow-up-automation
- /admin-routing-automation

### Comparison / conversion support
- /compare/virtual-assistant-vs-ai-workflows
- /compare/crm-automation-vs-complicore-plus
- /case-studies
- /contact

### Auth
- /login
- /signup
- /reset-password

### Product dashboard
- /dashboard
- /dashboard/overview
- /dashboard/flows
- /dashboard/leads
- /dashboard/billing
- /dashboard/demo
- /dashboard/settings

## User journeys
### Journey 1 — cold visitor to booked demo
Homepage → problem framing → interactive demo → pricing snapshot → book demo

### Journey 2 — high-intent buyer to paid activation
SEO landing page → pricing → demo → Stripe checkout → dashboard active state

### Journey 3 — active customer to expansion
Dashboard overview → flow performance → add flow → Stripe upgrade → new flow active

## Page templates
### Homepage
- Hero
- Before vs after
- Three core flows
- How activation works
- KPI proof
- Pricing snapshot
- Demo CTA
- FAQ
- Final CTA

### Pricing
- Commercial intro
- Package cards
- Activation fee explanation
- Monthly flow pricing
- Upgrade logic
- FAQ
- Activate CTA

### Demo
- Inactive state
- Simulation input
- Live timeline
- Locked flow explanation
- Stripe activation checkpoint
- Active state replay
- KPI proof
- Add-flow upgrade CTA

### Book Demo
- Qualification copy
- Demo booking form
- Objection-handling trust strip
- Confirmation state

### Service pages
- Problem framing
- Workflow explanation
- Outcome proof
- CTA stack
- Internal links

### Dashboard overview
- KPI strip
- Flow status
- Recent timeline
- Billing state
- Expansion CTA

### Flows
- Active flow list
- Flow detail drawer
- Toggle states
- Add-flow card

### Leads
- Search
- Filters
- Lead list
- Lead detail panel
- Routing status

### Billing
- Subscription summary
- Payment method
- Invoices
- Upgrade card

## Data models
### workspace
- id
- name
- created_at
- subscription_status
- primary_kpi_response_time

### user
- id
- email
- full_name
- created_at

### workspace_member
- id
- workspace_id
- user_id
- role

### flow
- id
- workspace_id
- type
- name
- status
- activated_at
- monthly_price

### flow_run
- id
- flow_id
- lead_id nullable
- status
- started_at
- completed_at
- outcome
- error_code nullable

### lead
- id
- workspace_id
- source
- contact_name
- contact_email
- inquiry_text
- created_at
- first_response_at nullable

### lead_event
- id
- lead_id
- event_type
- event_payload
- created_at

### subscription
- id
- workspace_id
- stripe_customer_id
- stripe_subscription_id
- plan_name
- status
- activation_fee_paid
- current_period_end

### invoice
- id
- workspace_id
- stripe_invoice_id
- amount
- currency
- status
- invoice_url
- issued_at

### demo_booking
- id
- full_name
- email
- company
- unit_count
- booked_at
- source_page

### demo_event
- id
- session_id
- event_type
- event_payload
- created_at

## API requirements
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

## Component inventory
1. AppShell
2. TopNav
3. SideNav
4. HeroSection
5. HeroDemoConsole
6. CTAButton
7. KPIStatCard
8. StatusPill
9. BeforeAfterComparison
10. FlowCard
11. FlowList
12. Timeline
13. TimelineItem
14. DemoInputForm
15. DemoScenarioTabs
16. BookingForm
17. PricingCard
18. PricingToggle
19. AddFlowCard
20. FAQAccordion
21. TestimonialCard
22. LogoStrip
23. FeatureGrid
24. SectionHeader
25. BillingSummaryCard
26. InvoiceTable
27. PaymentMethodCard
28. LeadInboxList
29. LeadDetailPanel
30. RoutingResultCard
31. EmptyState
32. ErrorState
33. SkeletonLoader
34. CheckoutBanner
35. DashboardHeader
36. FlowDrawer
37. SearchBar
38. FilterChips
39. Footer
40. CommandPalette

## Tech stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Stripe
- Vercel
- API Routes or Server Actions
- PostHog or GA4

## Performance budget
- LCP under 2.5s
- CLS under 0.1
- JS per route under 180KB initial where possible
- Hero media under 250KB
- Dashboard above-the-fold render under 1.5s on broadband

## SEO structure
### Primary keyword clusters
- property management AI
- leasing lead response automation
- leasing follow-up automation
- property management workflow automation
- admin routing automation

### Internal link map
- Homepage → Pricing, Demo, Book Demo, all 3 service pages
- Pricing → Demo, Book Demo
- Demo → Pricing, Book Demo
- Service pages → Pricing, Demo, FAQ, sibling service pages
- FAQ → Pricing, Demo, Book Demo

## Build order
### Sprint 1
- Homepage
- Pricing
- Demo
- Book Demo

### Sprint 2
- Dashboard Overview
- Flows
- Billing

### Sprint 3
- Leads
- Demo Console
- Settings

### Sprint 4
- SEO landing pages
- FAQ
- Comparison pages
