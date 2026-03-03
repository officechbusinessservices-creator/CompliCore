## Task: Stripe Webhook Lifecycle Handlers

## Context:
The current payments route (`backend/src/routes/payments.ts`) has basic Stripe
webhook handling scaffolded, but does not fully process the three most critical
subscription and payment lifecycle events:

- `customer.subscription.deleted` — triggered when a subscription is cancelled
  (trial expires, user cancels, payment permanently fails)
- `payment_intent.succeeded` — triggered when a payment completes successfully
- `payment_intent.payment_failed` — triggered when a payment attempt fails

These events need to update the `Subscription` and `Payout` Prisma models
accordingly, and must be logged to the security audit log for compliance.
Idempotency must be enforced to prevent duplicate processing.

## Files to touch:
- backend/src/routes/payments.ts
- backend/src/lib/security-audit.ts

## Acceptance Criteria:
- [ ] `customer.subscription.deleted` handler updates `Subscription.status` to `cancelled` in the database
- [ ] `payment_intent.succeeded` handler updates associated `Payment.status` to `paid` and creates/updates a `Payout` record if applicable
- [ ] `payment_intent.payment_failed` handler updates `Payment.status` to `failed` and logs the failure reason
- [ ] All three events are logged via the security audit module with event type, relevant IDs, and timestamp
- [ ] Stripe webhook signature verification (`stripe.webhooks.constructEvent`) is used on all inbound webhook requests
- [ ] Each handler returns HTTP 200 quickly (Stripe expects a response within 30 s)
- [ ] All backend tests still pass (`cd backend && npm run test`)
- [ ] No existing payment or auth routes are broken

## What DONE looks like:
- A `POST /v1/payments/webhook` route (or the existing equivalent) processes the three event types
- The Prisma `Subscription` and `Payment` models are updated atomically
- The security audit log contains entries for each processed event
- Running `cd backend && npm run test` passes with no new failures
- A manual `curl -X POST` with a simulated Stripe event body returns 200

## Do NOT:
- Do not expose `STRIPE_WEBHOOK_SECRET` or `STRIPE_SECRET_KEY` in any log or response body
- Do not modify existing endpoint paths or remove existing routes
- Do not change the Prisma schema (`schema.prisma`) — use existing models as-is
- Do not touch auth.ts, jwt-rotation.ts, encryption.ts, or any security plugin
- Do not add new npm dependencies

## Escalate if:
- The Prisma schema needs to change to support these events
- More than 3 files need to be modified
- Existing tests start failing for reasons unrelated to this task
- The webhook route requires touching authentication or RBAC logic
