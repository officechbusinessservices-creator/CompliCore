Run a comprehensive validation of the Stripe integration in CompliCore.

Step 1: Read backend/src/routes/payments.ts completely.

Step 2: Check for each of the following (report PASS or FAIL per item):
- [ ] HMAC signature verification is applied before any business logic
- [ ] env.STRIPE_WEBHOOK_SECRET is used (not a hardcoded string)
- [ ] Idempotency plugin is active on payment mutation routes
- [ ] HTTP 400 is returned for invalid signatures (not 500)
- [ ] payment_intent.succeeded updates Payment.status to 'succeeded'
- [ ] payment_intent.payment_failed updates Payment.status to 'failed'
- [ ] charge.refunded handles the refund case
- [ ] customer.subscription.deleted updates Subscription.status to 'cancelled'
- [ ] No payment data is logged (amount, card details, customer PII)

Step 3: Run the relevant backend tests:
```
cd backend && npm test -- --grep "payment"
```

Step 4: Report summary:
- PASS count / total checks
- List each FAIL with: check name | file | line | what's wrong

Step 5: For each FAIL, propose the minimal fix. Ask for approval before implementing.
Do not implement fixes without explicit confirmation.
