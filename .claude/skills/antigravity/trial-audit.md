Audit CompliCore's subscription and trial lifecycle for correctness and security.

Step 1: Read these files completely:
- backend/src/lib/lifecycle-email-automation.ts
- backend/src/lib/lifecycle-email-sequences.ts
- backend/prisma/schema.prisma (BillingPlan and Subscription models)
- backend/src/lib/env.ts (check LIFECYCLE_EMAIL_TICK_MS)

Step 2: Check each item (PASS / FAIL):
- [ ] Trial expiry emails are sent BEFORE expiry (not after)
- [ ] Trial reminder email is sent at least 3 days before expiry
- [ ] Expired subscriptions BLOCK access to host features (not just send email)
- [ ] LIFECYCLE_EMAIL_TICK_MS is validated in env.ts with Zod
- [ ] Email send failures do NOT crash the tick (error is caught and logged)
- [ ] No guest PII is logged when processing lifecycle events
- [ ] The ticker does not process the same subscription twice in one tick

Step 3: Simulate the expired trial scenario:
Walk through the code path step by step for this case:
"A host whose trial expired at midnight logs in at 00:01 AM."
What happens at each step? Does it correctly block them?

Step 4: Report gaps as:
| Gap | Severity | Affected Users | Fix |

Step 5: For HIGH severity gaps, implement the fix with approval.
For MEDIUM/LOW, report and ask for prioritization.
