# CompliCore+ — Production File Tree & Route-Level Build Order

## File Tree

```
complicore-plus/
├── app/
│   ├── layout.tsx                          # Root layout — AppShell, fonts, metadata
│   ├── page.tsx                            # / — Homepage
│   │
│   ├── pricing/
│   │   └── page.tsx                        # /pricing
│   │
│   ├── demo/
│   │   └── page.tsx                        # /demo — public interactive demo
│   │
│   ├── book-demo/
│   │   └── page.tsx                        # /book-demo
│   │
│   ├── faq/
│   │   └── page.tsx                        # /faq
│   │
│   ├── property-management-ai/
│   │   └── page.tsx                        # /property-management-ai — SEO service page
│   │
│   ├── lead-response-automation/
│   │   └── page.tsx                        # /lead-response-automation — SEO service page
│   │
│   ├── leasing-follow-up-automation/
│   │   └── page.tsx                        # /leasing-follow-up-automation — SEO service page
│   │
│   ├── admin-routing-automation/
│   │   └── page.tsx                        # /admin-routing-automation — SEO service page
│   │
│   ├── case-studies/
│   │   └── page.tsx                        # /case-studies
│   │
│   ├── compare/
│   │   ├── virtual-assistant-vs-ai-workflows/
│   │   │   └── page.tsx                    # /compare/virtual-assistant-vs-ai-workflows
│   │   └── crm-automation-vs-complicore-plus/
│   │       └── page.tsx                    # /compare/crm-automation-vs-complicore-plus
│   │
│   ├── contact/
│   │   └── page.tsx                        # /contact
│   │
│   ├── login/
│   │   └── page.tsx                        # /login
│   │
│   ├── signup/
│   │   └── page.tsx                        # /signup
│   │
│   ├── reset-password/
│   │   └── page.tsx                        # /reset-password
│   │
│   └── dashboard/
│       ├── layout.tsx                      # Dashboard shell — SideNav, DashboardHeader, auth guard
│       ├── page.tsx                        # /dashboard → redirect to /dashboard/overview
│       ├── overview/
│       │   └── page.tsx                    # /dashboard/overview
│       ├── flows/
│       │   └── page.tsx                    # /dashboard/flows
│       ├── leads/
│       │   └── page.tsx                    # /dashboard/leads
│       ├── billing/
│       │   └── page.tsx                    # /dashboard/billing
│       ├── demo/
│       │   └── page.tsx                    # /dashboard/demo — operator demo console
│       └── settings/
│           └── page.tsx                    # /dashboard/settings
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── TopNav.tsx
│   │   ├── SideNav.tsx
│   │   ├── Footer.tsx
│   │   └── DashboardHeader.tsx
│   │
│   ├── marketing/
│   │   ├── HeroSection.tsx
│   │   ├── HeroDemoConsole.tsx
│   │   ├── BeforeAfterComparison.tsx
│   │   ├── FlowCard.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── PricingCard.tsx
│   │   ├── PricingToggle.tsx
│   │   ├── FAQAccordion.tsx
│   │   ├── TestimonialCard.tsx
│   │   ├── LogoStrip.tsx
│   │   ├── SectionHeader.tsx
│   │   └── CTAButton.tsx
│   │
│   ├── demo/
│   │   ├── DemoInputForm.tsx
│   │   ├── DemoScenarioTabs.tsx
│   │   ├── Timeline.tsx
│   │   └── TimelineItem.tsx
│   │
│   ├── dashboard/
│   │   ├── KPIStatCard.tsx
│   │   ├── StatusPill.tsx
│   │   ├── FlowList.tsx
│   │   ├── FlowDrawer.tsx
│   │   ├── AddFlowCard.tsx
│   │   ├── LeadInboxList.tsx
│   │   ├── LeadDetailPanel.tsx
│   │   ├── RoutingResultCard.tsx
│   │   ├── BillingSummaryCard.tsx
│   │   ├── InvoiceTable.tsx
│   │   ├── PaymentMethodCard.tsx
│   │   ├── CheckoutBanner.tsx
│   │   ├── SearchBar.tsx
│   │   └── FilterChips.tsx
│   │
│   ├── forms/
│   │   └── BookingForm.tsx
│   │
│   └── shared/
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       ├── SkeletonLoader.tsx
│       └── CommandPalette.tsx
│
├── api/                                    # Next.js Route Handlers
│   └── (routes under app/api/)
│       ├── demo/
│       │   ├── simulate-lead/route.ts
│       │   └── simulate-routing/route.ts
│       ├── flows/
│       │   └── route.ts                    # GET /api/flows
│       ├── flows/[id]/
│       │   └── toggle/route.ts             # PATCH /api/flows/:id/toggle
│       ├── leads/
│       │   └── route.ts                    # GET /api/leads
│       ├── metrics/
│       │   └── response-time/route.ts
│       ├── book-demo/
│       │   └── route.ts
│       └── stripe/
│           ├── create-checkout/route.ts
│           └── webhook/route.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── stripe/
│   │   └── client.ts
│   └── auth/
│       └── session.ts
│
├── types/
│   └── index.ts                            # Workspace, User, Flow, Lead, Subscription, etc.
│
├── styles/
│   ├── globals.css
│   └── design-tokens.css
│
├── public/
│   └── og/
│       └── default.png                     # OG card — under 250KB
│
├── middleware.ts                           # Auth redirect guard for /dashboard/*
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Route-Level Build Order

### Sprint 1 — Core Conversion Surface

Priority: establish the demo, conversion, and purchase path end-to-end.

| # | Route | Template | Key Components |
|---|-------|----------|----------------|
| 1 | `/` | Homepage | HeroSection, HeroDemoConsole, BeforeAfterComparison, FlowCard × 3, PricingCard (snapshot), FAQAccordion, CTAButton |
| 2 | `/pricing` | Pricing | PricingCard × 3, PricingToggle, FAQAccordion, CTAButton |
| 3 | `/demo` | Demo | DemoInputForm, DemoScenarioTabs, Timeline, TimelineItem, CheckoutBanner, KPIStatCard |
| 4 | `/book-demo` | Book Demo | BookingForm, SectionHeader, CTAButton |

---

### Sprint 2 — Authenticated Dashboard Core

Dependency: auth guard in `middleware.ts` and Supabase session must be wired before this sprint.

| # | Route | Template | Key Components |
|---|-------|----------|----------------|
| 5 | `/dashboard/overview` | Dashboard Overview | KPIStatCard, StatusPill, Timeline, BillingSummaryCard, AddFlowCard, DashboardHeader |
| 6 | `/dashboard/flows` | Flows | FlowList, FlowDrawer, StatusPill, AddFlowCard |
| 7 | `/dashboard/billing` | Billing | BillingSummaryCard, InvoiceTable, PaymentMethodCard, CheckoutBanner |

---

### Sprint 3 — Dashboard Operations

| # | Route | Template | Key Components |
|---|-------|----------|----------------|
| 8 | `/dashboard/leads` | Leads | LeadInboxList, LeadDetailPanel, SearchBar, FilterChips, RoutingResultCard |
| 9 | `/dashboard/demo` | Demo Console | DemoInputForm, DemoScenarioTabs, Timeline, KPIStatCard |
| 10 | `/dashboard/settings` | Settings | form fields, StatusPill, EmptyState |
| 11 | `/login` | Auth | form, ErrorState |
| 12 | `/signup` | Auth | form, ErrorState |
| 13 | `/reset-password` | Auth | form, ErrorState |

---

### Sprint 4 — SEO, FAQ, Comparison

| # | Route | Template | Key Components |
|---|-------|----------|----------------|
| 14 | `/property-management-ai` | Service page | SectionHeader, FeatureGrid, CTAButton |
| 15 | `/lead-response-automation` | Service page | SectionHeader, FeatureGrid, CTAButton |
| 16 | `/leasing-follow-up-automation` | Service page | SectionHeader, FeatureGrid, CTAButton |
| 17 | `/admin-routing-automation` | Service page | SectionHeader, FeatureGrid, CTAButton |
| 18 | `/faq` | FAQ | FAQAccordion, SectionHeader |
| 19 | `/compare/virtual-assistant-vs-ai-workflows` | Comparison | FeatureGrid, CTAButton |
| 20 | `/compare/crm-automation-vs-complicore-plus` | Comparison | FeatureGrid, CTAButton |
| 21 | `/case-studies` | Trust | TestimonialCard, LogoStrip |
| 22 | `/contact` | Contact | BookingForm variant |

---

## Shared Infrastructure — Build Before Sprint 1

These must be in place before any page renders correctly:

- `app/layout.tsx` — root layout with Inter font, global metadata defaults
- `styles/design-tokens.css` — tokens from design system
- `components/layout/AppShell.tsx` — TopNav + Footer wrapper
- `components/layout/SideNav.tsx` — dashboard navigation
- `middleware.ts` — Supabase session check, redirect `/dashboard/*` to `/login` if unauthenticated
- `lib/supabase/client.ts` + `server.ts` — Supabase client initialisation
- `types/index.ts` — shared type definitions for all entities
```
