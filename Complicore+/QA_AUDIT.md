# CompliCore+ — QA Audit
**Scope:** Generated frontend and backend files
**References:** COMPLICORE_PLUS_MASTER_SPEC.md §8, 01_ARCHITECTURE_SPEC.md, 02_DESIGN_SYSTEM.md, 05_DATA_AND_BACKEND_SPEC.md

---

## CRITICAL (block deployment)

### C-1 — `app/api/stripe/webhook/route.ts`: Raw body parsing config is invalid in App Router
**File:** `app/api/stripe/webhook/route.ts` lines 161–167
**Issue:** The `export const config = { api: { bodyParser: false } }` pattern is Pages Router syntax. In App Router, route handlers receive the raw `Request` body directly via `req.text()`, which is already correct. The config export is a no-op and can mislead.
**Fix:** Remove the `export const config` block entirely. The `await req.text()` call on line 18 already reads the raw body correctly.

---

### C-2 — `app/api/stripe/create-checkout/route.ts`: Activation fee not included in Checkout Session
**File:** `app/api/stripe/create-checkout/route.ts`
**Issue:** The checkout session only includes the `flowFirst` recurring price. The $1,500 one-time activation fee (`STRIPE_PRICE_ACTIVATION`) is never added as a line item. The spec requires activation fee + subscription to be charged at activation.
**Fix:** Add the activation fee as a separate line item with a one-time `price` object, or use `invoice_items` on the subscription's first invoice. Simplest correct approach — add as a second line item in `mode: 'subscription'` using an invoice item created before the session:

```ts
// Before creating the checkout session, create a pending invoice item:
await stripe.invoiceItems.create({
  customer: existingCustomerId, // or let Checkout create the customer first
  price: STRIPE_PRICE_IDS.activation,
})
```

Or use `payment_intent_data.setup_future_usage` + a separate payment. The implementation must be validated against the Stripe docs for the chosen integration path. This is a billing-critical gap.

---

### C-3 — `supabase/migrations/003_rls_policies.sql`: `flow_runs` select policy may fail
**File:** `003_rls_policies.sql`
**Issue:** The `flow_runs` RLS policy uses a correlated subquery against `public.flows`. If the `flows` table has its own RLS policy, the subquery runs in the context of `auth.uid()` and will work correctly—but only if the user has SELECT on `flows`. This is safe given the `flows: member can read` policy exists, but the ordering of policy evaluation should be verified post-apply.
**Fix:** Confirm policy evaluation order in Supabase dashboard after migration runs. No code change required if policies are applied in migration order.

---

## HIGH (fix before first external demo)

### H-1 — `components/marketing/FAQAccordion.tsx`: CSS variable typo
**File:** `components/marketing/FAQAccordion.tsx` line ~120
**Issue:** `'var(--font-size-15 )'` — trailing space inside the CSS variable name. Will silently resolve to the default font size.
**Fix:**
```tsx
// Before
fontSize: 'var(--font-size-15 )',
// After
fontSize: 'var(--font-size-16)',
```

---

### H-2 — `app/layout.tsx`: Dashboard pages will render TopNav + Footer
**File:** `app/layout.tsx`
**Issue:** The root layout wraps every route with `<TopNav />` and `<Footer />`. Dashboard routes (`/dashboard/*`) have their own `dashboard/layout.tsx` with `SideNav` but will also receive `TopNav` + `Footer` from the root layout, creating a double-navigation layout.
**Fix:** Move `TopNav` and `Footer` into a dedicated marketing layout group:

```
app/
  (marketing)/
    layout.tsx   ← TopNav + Footer here
    page.tsx
    pricing/
    demo/
    ...
  dashboard/
    layout.tsx   ← SideNav + DashboardHeader only
```

---

### H-3 — `app/page.tsx`: `aria-hidden` on decorative icon strings
**File:** `app/demo/page.tsx` proof-point cards (lines ~170–200)
**Issue:** Emoji characters (🔒 ✓ → ⚡ ⏱ ⬆) used as visual icons are not wrapped in `aria-hidden="true"` spans. Screen readers will announce emoji names.
**Fix:** Wrap each icon in `<span aria-hidden="true">{icon}</span>`.

---

### H-4 — `app/api/stripe/create-checkout/route.ts`: Missing CSRF check
**File:** `app/api/stripe/create-checkout/route.ts`
**Issue:** The route verifies auth session (correct) but does not verify the `Origin` header against `NEXT_PUBLIC_SITE_URL`. A cross-origin POST from an attacker's domain would pass the session check if the user has an active cookie.
**Fix:** Add an origin check:
```ts
const origin = req.headers.get('origin')
if (origin !== process.env.NEXT_PUBLIC_SITE_URL) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

## MEDIUM (fix before public launch)

### M-1 — `components/layout/TopNav.tsx`: Hover handlers use inline event mutation
**File:** `components/layout/TopNav.tsx`
**Issue:** `onMouseEnter`/`onMouseLeave` directly mutate `style.color` via DOM imperative access. This will not work correctly on elements that are re-rendered by React (style will be overwritten). Pattern is fragile.
**Fix:** Use CSS `:hover` via a `<style>` block or convert nav links to a styled component with proper CSS class toggling.

---

### M-2 — `app/page.tsx`: Hero console preview `font-size-13` is not a token
**File:** `app/page.tsx` near bottom of hero console
**Issue:** `fontSize: 'var(--font-size-13)'` — `13` is not in the type scale (12, 14, 16…). Will resolve to browser default.
**Fix:** Change to `var(--font-size-12)` or `var(--font-size-14)`.

---

### M-3 — `components/demo/DemoConsole.tsx`: No debounce on `handleRunSimulation`
**File:** `components/demo/DemoConsole.tsx`
**Issue:** Rapid clicks on "Run Simulation" before `phase` state updates can queue multiple `setTimeout` chains, causing timeline to fire multiple times.
**Fix:** Disable the button after first click (already partially done via `disabled={isSimulating}` on the textarea, but the button itself has no disabled state during `simulating` phase).

---

### M-4 — SEO: Marketing pages missing `canonical` and schema markup
**Files:** `app/page.tsx`, `app/pricing/page.tsx`, `app/demo/page.tsx`
**Issue:** `metadata` exports are present but no `alternates.canonical`, `SoftwareApplication` JSON-LD, or FAQ schema. Spec §8 requires `SoftwareApplication`, `FAQ`, and `Breadcrumb` schema.
**Fix:** Add to each page:
```tsx
// In layout.tsx or per-page metadata
export const metadata: Metadata = {
  alternates: { canonical: 'https://complicoreplus.com' },
}
// And a <script type="application/ld+json"> block with SoftwareApplication schema
```

---

### M-5 — Performance: No `next/image` used for hero media
**Files:** `app/page.tsx`
**Issue:** No `<Image>` component is used (hero uses a mock console div, not an actual image). If real screenshots or media are added, they must go through `next/image` to meet the 250KB hero media budget.
**Note:** No action needed until actual image assets are introduced. Pre-emptive: add `next.config.ts` image domain configuration for Supabase storage.

---

## LOW (technical debt)

### L-1 — `components/demo/TimelineItem.tsx`: `<style>` for pulse animation missing
**File:** `components/demo/TimelineItem.tsx`
**Issue:** `animation: 'pulse 1.2s ease-in-out infinite'` references a `@keyframes pulse` that is not defined in `globals.css`.
**Fix:** Add to `globals.css`:
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
```

---

### L-2 — `app/api/stripe/webhook/route.ts`: `status` cast uses `as any`
**File:** `app/api/stripe/webhook/route.ts` lines ~107, ~125
**Issue:** `status: status as any` bypasses TypeScript enum checking against `subscription_status`.
**Fix:** Map Stripe statuses to the enum explicitly before the upsert call.

---

### L-3 — Missing `middleware.ts` for dashboard auth guard
**File:** Not yet created
**Issue:** `middleware.ts` is referenced in the file tree and `app/dashboard/layout.tsx` is not yet built. Without it, dashboard routes are publicly accessible.
**Fix:** Create `middleware.ts` with Supabase session check redirecting unauthenticated users to `/login`.

---

## Billing-Critical Rule Compliance Check

| Rule | Status |
|------|--------|
| No synthetic finance data | ✅ Pass — no hardcoded MRR, no fake metrics |
| No hardcoded plan states in UI | ✅ Pass — PricingCard receives props, no internal plan logic |
| subscription_status written only by webhook | ✅ Pass — webhook is the only writer |
| activation_fee_paid set only by `invoice.paid` event | ✅ Pass |
| Stripe state verified server-side before unlocking UI | ✅ Pass — `/api/billing/subscription` reads DB row set by webhook |
| No plan logic inside presentation components | ✅ Pass — PricingCard, DemoConsole contain no billing state |
| Fake Stripe execution in demo mode | ✅ Pass — DemoConsole labels "Demo mode — no real payment processed" |

---

## Performance Budget Check

| Metric | Target | Assessment |
|--------|--------|------------|
| LCP | < 2.5s | ⚠️ No image optimization in place; hero is CSS-only, low risk |
| CLS | < 0.1 | ✅ No layout-shifting elements identified |
| INP | < 200ms | ✅ No heavy client-side event handlers |
| JS per route (initial) | < 180KB | ⚠️ Unverified — requires bundle analysis after build |
| Hero media | < 250KB | ✅ No images in current hero implementation |
| Dashboard above-fold render | < 1.5s | ⚠️ Dashboard not yet built |

---

## Summary

**Blockers (fix before any Stripe test):** C-1, C-2
**Fix before external demo:** H-1, H-2, H-3, H-4
**Fix before public launch:** M-1 through M-5
**Low priority / tech debt:** L-1 through L-3
