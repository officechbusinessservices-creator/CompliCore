# CompliCore+ — Master Specification

## Brand Identity
- **Product:** CompliCore+
- **Tagline:** AI workflows that respond instantly
- **Attributes:** Minimal / Bold / Luxury / Operational
- **Voice:** Professional / Bold
- **Primary color:** #6EA8FE on #0B1020

## Business Context
- **Primary offer:** AI workflow automation OS for residential property managers
- **Secondary offers:** Leasing lead response, follow-up automation, admin routing, review automation, content workflow
- **ICP:** Residential property managers with 50–500 units
- **Primary KPI:** Median first-response time to new inquiry
- **Core conversion event:** Booked demo
- **Revenue model:** $1,500 activation + $349/month per active flow + $249/additional flow

## Architecture
- See `01_ARCHITECTURE_SPEC.md`

## Design System
- See `02_DESIGN_SYSTEM.md` and `design-tokens.json`

## Content Hierarchy
1. Missed leads are expensive
2. Slow response kills leasing momentum
3. CompliCore+ installs active workflows
4. Payment activates system
5. Dashboard proves results

## Pricing Logic
| Package | Activation | Monthly | Flows |
|---|---|---|---|
| Launch | $1,500 | $349/mo | 1 |
| Growth | $1,500 | $1,047/mo | 3 |
| Ops Stack | $1,500 | $1,745/mo | 5 |
| Add Flow | — | $249/mo | +1 |

## Demo Logic
1. Account inactive
2. Simulate inquiry
3. Explain flow is locked
4. Activate via Stripe
5. Return active
6. Run lead response → follow-up → routing
7. Show KPI
8. Offer add-flow upgrade

## QA Standards
- LCP < 2.5s, CLS < 0.1, INP < 200ms
- WCAG 2.2 AA
- Zero synthetic revenue in UI
- Stripe webhook is the only activation signal

## Non-Negotiable Rules
1. No payment → no activation
2. No activation → no active flows
3. No active flows → no usage billing
4. No Stripe paid event → no MRR
5. No synthetic finance data anywhere in UI

## Build Order
- Sprint 1: Homepage, Pricing, Demo, Book Demo, Stripe checkout
- Sprint 2: Dashboard Overview, Flows, Billing, Webhook activation
- Sprint 3: Leads, Demo Console, Settings
- Sprint 4: SEO landing pages, FAQ, Comparison pages

## Tech Stack
- Next.js App Router + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth + Realtime)
- Stripe Billing + Checkout
- Vercel hosting
- PostHog analytics
