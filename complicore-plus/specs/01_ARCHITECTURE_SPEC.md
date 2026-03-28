# CompliCore+ — Architecture Spec

## Product Type
Conversion-first B2B SaaS website with interactive demo, Stripe activation, and authenticated operator dashboard.

## Primary Audience
Residential property managers with 50–500 units.

## Primary Goal
Convert qualified traffic into: booked demos → paid activations → expanded active flows

---

## 1. Page Hierarchy

### Public Marketing
- `/`
- `/pricing`
- `/demo`
- `/book-demo`
- `/faq`
- `/property-management-ai`
- `/lead-response-automation`
- `/leasing-follow-up-automation`
- `/admin-routing-automation`
- `/compare/virtual-assistant-vs-ai-workflows`
- `/compare/crm-automation-vs-complicore-plus`
- `/case-studies`
- `/contact`

### Auth
- `/login`
- `/signup`
- `/reset-password`

### Dashboard
- `/dashboard`
- `/dashboard/overview`
- `/dashboard/flows`
- `/dashboard/leads`
- `/dashboard/billing`
- `/dashboard/demo`
- `/dashboard/settings`

---

## 2. Page Intent Map

| Page | Purpose | Primary CTA |
|---|---|---|
| Homepage | Broad conversion | Book Live Demo |
| Pricing | Commercial clarity | Activate System |
| Demo | Product proof | Run Simulation → Activate |
| Book Demo | Capture qualified prospects | Submit Form |
| /property-management-ai | Category ownership | Book Live Demo |
| /lead-response-automation | High-intent SEO | See It Work |
| /leasing-follow-up-automation | Workflow SEO | Book Live Demo |
| FAQ | Objection handling | — |
| Dashboard Overview | Status + KPI | — |

---

## 3. Core User Journeys

### Journey 1 — Cold visitor to booked demo
1. Lands on homepage
2. Understands offer in hero
3. Runs or watches demo
4. Checks pricing
5. Submits book-demo form

**Success event:** `book_demo_submitted`

### Journey 2 — High-intent buyer to paid activation
1. Lands on SEO or pricing page
2. Reviews workflow value
3. Clicks activate → Stripe checkout
4. Payment succeeds → redirected to dashboard
5. Account changes from inactive to active

**Success event:** `stripe_activation_paid`

### Journey 3 — Active customer to expansion
1. Dashboard overview → sees active flows + KPI
2. Clicks add flow → Stripe upgrade
3. New flow becomes active

**Success event:** `flow_upgrade_paid`

---

## 4. Core State Model

### Workspace States
`inactive` → `pending_payment` → `active` → `past_due` → `canceled` → `demo_mode`

### Flow States
`locked` → `inactive` → `active` → `paused` → `error`

### Billing States
`none` → `trial` → `active` → `past_due` → `canceled`

### Lead States
`new` → `responded` → `follow_up_scheduled` → `routed` → `closed` → `failed`

---

## 5. Component Inventory (40 Components)

### Navigation / Shell
AppShell, TopNav, SideNav, NavItem, WorkspaceStatusPill, UserMenu

### Marketing
HeroSection, HeroDemoConsole, BeforeAfterSection, FeatureGrid, FeatureCard, PricingCard, PricingCalculator, TestimonialCard, LogoStrip, FAQAccordion, BookDemoForm, Footer

### Shared UI
Button, Input, Textarea, Select, StatusPill, KPIStatCard, SectionHeader, EmptyState, ErrorState, SkeletonBlock, ToastRegion, ConfirmDialog, Drawer, Modal

### Dashboard
DashboardHeader, ActivationBanner, ActiveFlowsPanel, FlowCard, FlowDrawer, FlowRunTable, LeadInboxList, LeadDetailPanel, Timeline, TimelineItem, BillingSummaryCard, InvoiceTable, PaymentMethodCard, AddFlowCard, DemoScenarioTabs, SimulationControls, LiveEventConsole, IntegrationCard

---

## 6. API Map

### Public
- `POST /api/book-demo`
- `POST /api/demo/simulate-lead`
- `POST /api/demo/simulate-follow-up`
- `POST /api/demo/simulate-routing`

### Billing
- `POST /api/stripe/create-checkout`
- `POST /api/stripe/webhook`
- `GET /api/billing/subscription`
- `GET /api/billing/invoices`

### Dashboard
- `GET /api/dashboard/overview`
- `GET /api/flows`
- `PATCH /api/flows/:id/toggle`
- `GET /api/flows/:id/runs`
- `GET /api/leads`
- `GET /api/leads/:id`
- `GET /api/metrics/response-time`
- `GET /api/demo/events`

---

## 7. Tech Stack
- **Frontend:** Next.js App Router, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase Postgres, Supabase Auth, Next.js API routes / Server Actions
- **Payments:** Stripe Checkout + Billing
- **Hosting:** Vercel
- **Analytics:** PostHog or GA4

---

## 8. Performance Budgets
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- JS per route < 180KB initial
- Hero media < 250KB
- Dashboard above-fold render < 1.5s

---

## 9. SEO Structure

### Primary Clusters
- AI automation for property managers
- Leasing lead response automation
- Leasing follow-up automation
- Property management workflow automation
- Admin routing automation

### Schema Requirements
- FAQ schema on `/faq` and relevant pages
- SoftwareApplication schema on homepage
- BreadcrumbList on all inner pages
- OpenGraph + Twitter cards on all pages
