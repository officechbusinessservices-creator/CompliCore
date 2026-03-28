# CompliCore+ — QA + Launch Checklist

**Classification:** P0 = launch blocker | P1 = fix within 24h | P2 = post-launch

---

## Billing Integrity (P0)
- [ ] `invoice.paid` updates `subscriptions.status = active`
- [ ] `invoice.paid` updates `workspaces.status = active`
- [ ] `invoice.payment_failed` sets `past_due` correctly
- [ ] `subscription.deleted` sets `canceled`
- [ ] No hardcoded revenue anywhere
- [ ] Dashboard MRR derived only from subscriptions table
- [ ] No "demo" or "fake" values in billing UI
- [ ] Active flows ≤ entitled flows at all times
- [ ] Locked flows cannot be activated
- [ ] Add-flow upgrade correctly increases entitlement
- [ ] Flow toggle blocked when billing inactive

## Activation Logic (P0)
- [ ] Payment → activation occurs only after webhook
- [ ] No activation from frontend-only event
- [ ] First purchase unlocks correct flows
- [ ] Workspace status transitions correctly

## Demo System (P0)
- [ ] Lead simulation works end-to-end
- [ ] Timeline events appear in correct order
- [ ] Demo uses simulation data, not production data
- [ ] Demo works without authentication

## API Integrity (P0)
- [ ] `POST /api/book-demo` functional
- [ ] `POST /api/demo/simulate-lead` functional
- [ ] `POST /api/stripe/create-checkout` functional
- [ ] `GET /api/dashboard/overview` functional
- [ ] `GET /api/flows` functional
- [ ] All endpoints return structured errors
- [ ] No unhandled 500 responses

## Database (P0)
- [ ] All tables created
- [ ] Indexes applied
- [ ] RLS enabled on all user-facing tables
- [ ] Stripe event idempotency enforced
- [ ] Default flows seeded on workspace creation

## Security (P0)
- [ ] Supabase Auth enforced on all protected routes
- [ ] Users cannot access other workspaces (RLS verified)
- [ ] Stripe webhook signature verified
- [ ] All inputs sanitized
- [ ] No secret keys exposed client-side

## Performance (P0)
- [ ] LCP < 2.5s on homepage
- [ ] CLS < 0.1
- [ ] Hero loads under 1s on broadband
- [ ] Dashboard shell < 1.5s

## SEO (P0)
- [ ] Unique title + meta for each page
- [ ] H1 present on all pages
- [ ] sitemap.xml generated
- [ ] robots.txt configured
- [ ] OG + Twitter meta tags

## Accessibility (P0)
- [ ] WCAG 2.2 AA contrast
- [ ] Keyboard navigation works everywhere
- [ ] Focus states visible
- [ ] Forms labeled correctly

## Analytics (P0)
- [ ] `hero_cta_clicked` fires
- [ ] `demo_started` fires
- [ ] `book_demo_submitted` fires
- [ ] `stripe_checkout_started` fires
- [ ] `stripe_activation_paid` fires (server-side)

---

## Launch Sequence

```
1. Deploy Supabase schema + RLS
2. Set all environment variables in Vercel
3. Deploy Next.js app to Vercel
4. Register Stripe webhook endpoint
5. Run test payment in live mode
6. Confirm: invoice.paid → workspace active → flows unlocked
7. Run demo publicly (end-to-end test)
8. Submit sitemap to Google Search Console
9. Start outreach (Day 1: 20 emails)
10. Monitor dashboard for 30 minutes post-launch
```

## Go / No-Go Gate

**Must be TRUE before launch:**
- Stripe → DB sync works
- Activation depends on real payment
- Demo works end-to-end
- Dashboard reflects real data only
- No fake revenue in any UI surface

**Must be FALSE:**
- Any synthetic MRR
- Any activation without payment
- Any unrestricted cross-workspace data access
- Any broken checkout flow
