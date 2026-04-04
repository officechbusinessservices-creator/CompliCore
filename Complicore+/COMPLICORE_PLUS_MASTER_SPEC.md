# COMPLICORE_PLUS_MASTER_SPEC.md

## 1. Brand identity
- **Brand:** CompliCore+
- **Category:** AI workflow automation OS for residential property managers
- **Primary offer:** Active workflow automation for leasing lead response, follow-up, and admin routing
- **Secondary offers:** Review automation, content workflow automation, admin routing automation
- **Primary ICP:** Residential property managers with 50–500 units
- **Brand attributes:** Minimal, Bold, Luxury, Operational
- **Voice:** Professional, Bold
- **Visual direction:** Dark, premium, operational, enterprise, restrained motion, strong KPI hierarchy
- **Avoid:** startup gradients everywhere, playful illustrations, generic AI imagery, cluttered dashboards

## 2. Architecture
- **Website type:** Conversion-first B2B SaaS / product marketing website with interactive demo and authenticated operator dashboard
- **Core business goal:** Book demo → activate via Stripe → onboard into active flows
- **Primary KPI:** Median first-response time to new inquiry
- **Revenue model:** $1,500 activation + $349/month per active flow + $249/additional flow
- **Primary conversion event:** Booked demo
- **Primary SEO goal:** Rank and convert for property-management workflow automation terms

### Locked page set
#### Marketing
- /
- /pricing
- /demo
- /book-demo
- /faq
- /property-management-ai
- /lead-response-automation
- /leasing-follow-up-automation
- /admin-routing-automation

#### Comparison / trust
- /case-studies
- /compare/virtual-assistant-vs-ai-workflows
- /compare/crm-automation-vs-complicore-plus
- /contact

#### Auth
- /login
- /signup
- /reset-password

#### Product
- /dashboard
- /dashboard/overview
- /dashboard/flows
- /dashboard/leads
- /dashboard/billing
- /dashboard/demo
- /dashboard/settings

### Locked screen list for first build
#### Marketing
1. Homepage
2. Pricing
3. Demo
4. Property Management AI
5. Lead Response Automation
6. Leasing Follow-Up Automation
7. FAQ
8. Book Demo

#### Product
1. Login
2. Dashboard Overview
3. Flows
4. Leads
5. Billing
6. Demo Console
7. Settings

### Locked page intent map
- **Homepage:** broad conversion and category framing
- **Pricing:** commercial clarity and package selection
- **Demo:** product proof through visible workflow execution
- **Book Demo:** capture qualified prospects
- **Property Management AI:** category ownership and high-intent organic traffic
- **Lead Response Automation:** workflow-specific buyer capture
- **Leasing Follow-Up Automation:** workflow-specific buyer capture
- **Admin Routing Automation:** operational pain capture
- **FAQ:** objection handling and SEO support
- **Dashboard Overview:** status, KPI, recent activity, billing state
- **Flows:** manage, activate, pause, inspect workflows
- **Leads:** inspect inquiries and workflow outcomes
- **Billing:** subscription state, invoices, expansion, payment method

## 3. Design system
- **Primary:** #6EA8FE
- **Primary hover:** #8AB8FF
- **Surface:** #11182D
- **Canvas:** #0B1020
- **Elevated surface:** #16203A
- **Border:** #25314F
- **Text primary:** #F5F7FB
- **Text secondary:** #B8C1D9
- **Success:** #22C55E
- **Warning:** #F59E0B
- **Danger:** #EF4444

### Typography
- Font family: Inter
- Scale: 12, 14, 16, 18, 20, 24, 30, 36, 48

### Spacing
- 8px grid: 8, 16, 24, 32, 40, 48, 64, 80

### Layout
- 12-column desktop
- 8-column tablet
- 4-column mobile

### Motion
- Subtle fade-up
- Controlled hover lift
- Status transitions
- Timeline append animation
- Standard duration max 240ms

### Accessibility
- WCAG 2.2 AA
- Keyboard complete
- Visible focus states
- Semantic landmarks
- Touch targets minimum 44px

## 4. Content hierarchy
### Core positioning
Do not sell AI. Sell:
- instant response
- automated follow-up
- cleaner routing
- lower admin load
- more captured revenue

### Message hierarchy
1. Missed leads are expensive
2. Slow response kills leasing momentum
3. CompliCore+ installs active workflows
4. Payment activates system
5. Dashboard proves results

### Homepage structure
1. Hero
2. Before vs after
3. 3 core flows
4. How activation works
5. KPI proof: response time
6. Pricing snapshot
7. Demo CTA
8. FAQ
9. Final CTA

### First 3 sellable flows
1. Leasing Lead Response — trigger: new inquiry → outcome: instant reply
2. Leasing Follow-Up — trigger: no reply → outcome: reminder + re-engagement
3. Admin / Maintenance Routing — trigger: inbound message → outcome: classified and routed correctly

## 5. Data model
### Core entities
- workspace
- user
- workspace_member
- flow
- flow_run
- lead
- lead_event
- subscription
- invoice
- demo_booking
- demo_event

## 6. Pricing logic
### Commercial model
- Activation fee: $1,500 one-time
- Monthly recurring: $349 per active flow
- Additional flow expansion: $249 per additional flow

### Package framing
- Launch
- Growth
- Ops Stack

### Rules
- No synthetic finance data
- No hardcoded MRR
- No fake subscription state
- No plan logic inside presentation components

## 7. Demo logic
### Locked narrative
1. Account inactive
2. Simulate inquiry
3. Explain flow is locked
4. Activate via Stripe
5. Return active
6. Run lead response
7. Run follow-up
8. Run routing
9. Show KPI
10. Offer add-flow upgrade

### Demo must prove
- inactive before payment
- active after payment
- inquiry enters
- response sends
- follow-up schedules
- routing happens

### Reuse this narrative for
- hero interaction
- sales demo
- Loom recording
- product proof

## 8. QA standards
### Performance
- LCP < 2.5s
- CLS < 0.1
- INP target < 200ms
- JS per route under 180KB initial where possible
- Hero media under 250KB
- Dashboard above-the-fold render under 1.5s on broadband

### SEO
- Unique titles and meta descriptions
- Schema: SoftwareApplication, FAQ, Breadcrumb
- Sitemap
- Internal links
- OG and Twitter cards

### Security
- HTTPS
- CSP
- Server-side Stripe validation
- Input sanitization
- CSRF protection where relevant

### Analytics
Track only:
- homepage CTA click
- demo simulation start
- pricing CTA click
- booking form submit
- Stripe checkout start
- Stripe paid activation
- add-flow upgrade
- median response time
- active flow count

## Project instruction block
Use this verbatim in Claude Project instructions:

Treat COMPLICORE_PLUS_MASTER_SPEC.md as the sole source of truth.
Use only the minimum relevant files for each task.
Do not restate unchanged context.
Return deltas, final artifacts, or patches only.
Never invent metrics, revenue, subscription state, or billing data.
Do not merge architecture, design, copy, and backend unless explicitly requested.
For build tasks, work in the defined execution order:
architecture → design system → copy → Figma prompts → frontend → backend wiring → QA.
