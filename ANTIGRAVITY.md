# CompliCore Antigravity System
## The Claude Code Multiplier Guide

> **Antigravity** (n): A workflow architecture that makes development effort feel lighter than it is — compressing days of work into hours through parallel AI orchestration, disciplined planning, and institutional knowledge loops.

This document is the operational manual for shipping CompliCore at an order-of-magnitude faster velocity using Claude Code. It covers eleven systems, each self-contained, each composable with the others.

---

## Table of Contents

1. [Parallel Worktrees — The Velocity Engine](#1-parallel-worktrees--the-velocity-engine)
2. [Plan Mode — The Staff Engineer Protocol](#2-plan-mode--the-staff-engineer-protocol)
3. [CLAUDE.md — The Institutional Memory Layer](#3-claudemd--the-institutional-memory-layer)
4. [Slash Commands — The Automation Keyboard](#4-slash-commands--the-automation-keyboard)
5. [Autonomous Bug Fixing — The Self-Healing Loop](#5-autonomous-bug-fixing--the-self-healing-loop)
6. [Advanced Prompting — The Signal Amplifier](#6-advanced-prompting--the-signal-amplifier)
7. [Data & Analytics — The Evidence Engine](#7-data--analytics--the-evidence-engine)
8. [Performance Audit — The Scalability Radar](#8-performance-audit--the-scalability-radar)
9. [Learning Mode — The Knowledge Crystallizer](#9-learning-mode--the-knowledge-crystallizer)
10. [14-Day Build Plan — The Sprint Blueprint](#10-14-day-build-plan--the-sprint-blueprint)
11. [Launch Checklist — The Go-Live Gate](#11-launch-checklist--the-go-live-gate)

---

## 1. Parallel Worktrees — The Velocity Engine

### The Core Idea

Git worktrees let you check out multiple branches simultaneously into separate directories. Combined with Claude Code sessions, this means you can have three or four separate Claude agents working on independent CompliCore features at the same time — no branch-switching, no stashing, no context loss.

The wall-clock multiplier: a 3-day sprint becomes roughly 8 hours.

### Setup: Create the Worktree Forest

Run these commands once from the CompliCore root to create your parallel workspace:

```bash
# From the CompliCore root
git worktree add ../complicore-payments claude/payments-sprint
git worktree add ../complicore-ai      claude/ai-features-sprint
git worktree add ../complicore-pms     claude/pms-integration-sprint
git worktree add ../complicore-ui      claude/ui-components-sprint
git worktree add ../complicore-hotfix  claude/hotfix-staging
```

Each directory is a fully independent checkout with its own working tree. Changes in `../complicore-payments` never bleed into `../complicore-ai`.

### Shell Aliases for Fast Navigation

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# CompliCore worktree aliases
alias za='cd /home/user/CompliCore'              # main trunk
alias zp='cd /home/user/complicore-payments'     # payments sprint
alias zai='cd /home/user/complicore-ai'          # AI features sprint
alias zm='cd /home/user/complicore-pms'          # PMS integration sprint
alias zu='cd /home/user/complicore-ui'           # UI components sprint
alias zh='cd /home/user/complicore-hotfix'       # hotfix staging

# Open a Claude Code session in a specific worktree
alias claude-pay='cd /home/user/complicore-payments && claude'
alias claude-ai='cd /home/user/complicore-ai && claude'
alias claude-pms='cd /home/user/complicore-pms && claude'
alias claude-ui='cd /home/user/complicore-ui && claude'
```

### Parallel Sprint Assignment Table

| Session | Directory | Branch | Task | Dependency |
|---|---|---|---|---|
| A (main) | `CompliCore/` | `main` | Code review, merges, coordination | none |
| B | `complicore-payments` | `claude/payments-sprint` | Stripe webhooks, payout flows | none |
| C | `complicore-ai` | `claude/ai-features-sprint` | AI pricing, sentiment analysis | none |
| D | `complicore-pms` | `claude/pms-integration-sprint` | Guesty/Hostaway connectors | none |
| E | `complicore-ui` | `claude/ui-components-sprint` | Dashboard components, portal UI | waits for D schema |

### Workflow Rules for Parallel Worktrees

**Rule 1: Never share a branch between two active sessions.** If Session B owns `claude/payments-sprint`, Session A should not open files in that worktree directory.

**Rule 2: Coordinate through CLAUDE.md notes.** Each session should write a brief status note to `.claude/notes/{branch}.md` when finishing a task block so the coordination session (A) can monitor progress without interrupting.

**Rule 3: Schema changes are serialized.** If any sprint needs a Prisma schema change, it must be coordinated through Session A. The migration runs once; other sessions then pull.

**Rule 4: Integration tests run before merge.** Each sprint branch must pass `cd backend && npm test` before Session A merges it.

**Rule 5: Hotfix takes priority.** If a production issue arrives, the `complicore-hotfix` worktree is reserved and always clean. Switch there without disturbing any active sprint.

### Starting a Parallel Sprint: The Exact Prompt

When opening a new Claude Code session in a sprint worktree, begin with:

```
You are working in the CompliCore parallel worktree for [FEATURE].
Branch: [branch-name]
This is an ISOLATED session. Do not reference or modify:
- ../CompliCore (main trunk)
- ../complicore-[other-sprint] directories

Your task: [TASK DESCRIPTION]

Before writing code:
1. Read backend/src/routes/[relevant-file].ts
2. Read backend/prisma/schema.prisma
3. Read the relevant section of CLAUDE.md

Do not create migrations. If a schema change is needed, write the proposed
change to .claude/notes/schema-requests.md and halt. Coordinate through main.
```

### Worktree Status Dashboard

Create `.claude/notes/worktree-status.md` to track active sprints:

```markdown
# Worktree Status — Updated: [DATE]

| Worktree | Branch | Status | Last Commit | Blocker |
|---|---|---|---|---|
| complicore-payments | claude/payments-sprint | in-progress | abc1234 | none |
| complicore-ai | claude/ai-features-sprint | blocked | def5678 | schema request |
| complicore-pms | claude/pms-integration-sprint | complete | ready to merge | — |
| complicore-ui | claude/ui-components-sprint | not started | — | — |
```

Update this file after every session. It is the single source of truth for parallel work state.

---

## 2. Plan Mode — The Staff Engineer Protocol

### Why Plan Mode First

Every significant CompliCore feature touches multiple layers: the Prisma schema, a Fastify route, a Zod validation schema, frontend API calls, NextAuth session guards, and potentially Socket.IO events. Writing code before understanding the full blast radius of a change causes rework.

Plan Mode forces a map before the march.

### Activating Plan Mode

In any Claude Code session, activate planning before touching code:

```
/plan

I need to implement [FEATURE]. Before writing any code, produce:
1. A list of every file that needs to change
2. The exact schema additions/modifications required
3. The API contract (endpoint, request shape, response shape)
4. Security considerations (auth, rate limiting, validation)
5. Test cases that must pass
6. Edge cases and failure modes
7. Estimated complexity: Low / Medium / High
```

Do not exit plan mode until the plan is confirmed.

### The Dual-Claude Planning Protocol

For high-complexity features (Complexity: High), use two sessions:

**Session A — The Architect**: Produces the plan.

**Session B — The Reviewer**: Opens the same codebase in a second Claude Code instance and critiques the plan:

```
Act as a senior staff engineer reviewing a proposed implementation plan for CompliCore.
The plan is below. Your job is to find:
- Security holes (especially: auth bypass, injection, PII exposure)
- Missing validation at Zod boundaries
- N+1 query risks in Prisma
- Race conditions under concurrent requests
- Missing idempotency for payment/booking mutations
- Incomplete error handling
- Test coverage gaps

Plan:
[PASTE PLAN FROM SESSION A]
```

The reviewer's critique feeds back into Session A for a re-plan before a single line of code is written.

### Re-Plan Triggers

Initiate a re-plan mid-implementation if any of the following occur:

- A Prisma migration requires more than two new fields
- A route needs to call more than two external services
- A security concern is flagged during code review
- Tests fail for reasons unrelated to the intended change
- A third module is discovered to depend on the one being modified

Re-plan prompt:

```
STOP. We have hit a re-plan trigger: [REASON].
Archive the current partial implementation to .claude/notes/partial-[feature].md
Return to plan mode. What needs to change about the original plan?
```

### Plan Mode for CompliCore-Specific Domains

**Stripe Integration Plan Prompt:**
```
/plan
Plan a Stripe webhook handler for CompliCore. Cover:
- Which Fastify route file receives the webhook (backend/src/routes/payments.ts)
- Stripe signature verification middleware placement
- Which Prisma Payment model fields update on which events
- Idempotency: what happens if the same event arrives twice?
- The exact Zod schema for the incoming webhook payload
- Error responses for invalid signatures (return 400, not 500)
- Security: the webhook secret must come from env.STRIPE_WEBHOOK_SECRET (validated by env.ts)
```

**PMS Connector Plan Prompt:**
```
/plan
Plan a new PMS connector for [PROVIDER] in backend/src/routes/pms-connectors.ts. Cover:
- HMAC webhook verification using env.PMS_WEBHOOK_SECRET
- Rate limiting strategy (this provider sends bursts)
- Data mapping: their property model → our Prisma Listing model
- Conflict resolution: what wins when their data conflicts with ours?
- Backfill endpoint: POST /v1/pms/backfill/:connectorId
- Test fixtures: minimum three webhook payloads to simulate
```

**AI Feature Plan Prompt:**
```
/plan
Plan the [AI FEATURE] endpoint in backend/src/routes/ai.ts. Cover:
- External AI service URL (from env: AGENTIC_RAG_SERVICE_URL or similar)
- Request timeout and fallback behavior (what does the UI show if AI is down?)
- Prompt construction: what CompliCore data is injected into the prompt?
- PII guardrail: confirm no guest PII reaches the external AI service
- Caching: should results be cached in Redis? TTL?
- Rate limiting: per-host limits to prevent AI abuse
- Response validation: Zod schema for what we accept back from the AI service
```

---

## 3. CLAUDE.md — The Institutional Memory Layer

### The Notes Directory Pattern

CLAUDE.md is read at the start of every session. But it should not bloat into a 2,000-line monolith. Instead, use a tiered system:

```
.claude/
├── notes/
│   ├── decisions.md          # Architecture decisions made and why
│   ├── gotchas.md            # Things that burned us; never repeat
│   ├── schema-requests.md    # Pending schema changes from sprint sessions
│   ├── worktree-status.md    # Active parallel worktree state
│   ├── partial-[feature].md  # Abandoned/paused partial implementations
│   └── lessons.md            # Patterns learned; auto-updated
```

CLAUDE.md's bottom section links to this directory:

```markdown
## Session Notes (do not inline — read on demand)
- Architecture decisions: .claude/notes/decisions.md
- Known gotchas: .claude/notes/gotchas.md
- Pending schema requests: .claude/notes/schema-requests.md
- Worktree status: .claude/notes/worktree-status.md
```

### Auto-Updating Lessons

At the end of any session where a non-obvious problem was solved, Claude appends to `.claude/notes/lessons.md`:

```markdown
## [DATE] — [TOPIC]
**Problem:** [What went wrong or was confusing]
**Root cause:** [Why]
**Solution:** [Exact fix]
**Prevention:** [Rule to add or check to do next time]
```

This file becomes CompliCore's permanent institutional memory. Future sessions read it on demand when hitting related problems.

### CompliCore-Specific CLAUDE.md Rules (Production Version)

The following rules belong permanently in CLAUDE.md for all CompliCore sessions:

```markdown
## CompliCore Non-Negotiable Rules

### Authentication
- ALL protected routes must use `fastify.authenticate` or `fastify.requireRole`
- NEVER store JWT in localStorage or sessionStorage
- NEVER trust client-supplied roles; roles are server-assigned only
- Step-up MFA (WebAuthn) is required for host/admin sensitive actions

### Data Access
- ALL Prisma queries on production paths must use `select` to limit fields
- NEVER return password hashes, access codes, or WiFi credentials in API responses
- Guest PII (name, email, phone) must NEVER be sent to external AI services

### Payments
- ALL payment mutations require idempotency keys (idempotency plugin handles this)
- NEVER process a payment without first verifying webhook HMAC signature
- Stripe webhook secret comes from env.STRIPE_WEBHOOK_SECRET only

### Security Headers
- NEVER disable CORS, Helmet, or rate limiting
- NEVER set ENABLE_DEMO_FALLBACK=true in production
- COOKIE_SECURE=true is mandatory in production environments

### Code Quality
- ALL new routes must have corresponding Zod input validation
- ALL new routes must have at least one Vitest integration test
- Run `cd backend && npm test` before every commit on a backend change
- Run `npm run lint` before every commit on a frontend change

### What Never to Log
- passwords, access codes, guest PII, WiFi credentials, payment tokens
- authorization headers, cookie values, JWT payloads
```

### CLAUDE.md Gotchas Section

```markdown
## Known Gotchas (read before touching these areas)

### Dual-Prefix Routes
All routes are registered under BOTH /api and /v1. The /api prefix is deprecated.
ALWAYS use /v1 in new code. Never add new /api-only routes.
See: backend/src/server.ts — dual prefix registration

### In-Memory User Store vs Prisma
backend/src/lib/secure-user-model.ts is an in-memory store used in dev/demo mode.
In production, auth uses the Prisma User model.
ENABLE_DEMO_FALLBACK=false enforces this at startup.
Do NOT mix these two auth paths in the same code block.

### Prisma Schema Location
The schema is at backend/prisma/schema.prisma (inside /backend, not root).
Running `npx prisma generate` must be done from the /backend directory.

### Environment Validation at Startup
backend/src/lib/env.ts validates ALL env vars with Zod on startup.
Adding a new env var requires: (1) add to env.ts schema, (2) add to .env.example.
The server refuses to start on invalid config — this is intentional.

### Socket.IO Scaling
Socket.IO realtime currently requires Redis adapter for multi-instance deployments.
Without REDIS_URL, realtime events only work on single-instance deployments.
Do not promise realtime features on multi-instance prod until Redis is configured.

### Frontend tsconfig excludes backend
The root tsconfig.json excludes backend/**. Type errors in backend/ will NOT show
in frontend lint runs. Run backend build separately: cd backend && npm run build.
```

---

## 4. Slash Commands — The Automation Keyboard

### Creating Custom Slash Commands for CompliCore

Custom slash commands live in `.claude/skills/`. Each is a markdown file that Claude reads and executes as a prompt template.

Create these files now:

### `/techdebt` — Technical Debt Scanner

File: `.claude/skills/techdebt.md`

```markdown
Scan the CompliCore codebase for technical debt. Report findings in four categories:

**CRITICAL** (blocks production readiness):
- Missing authentication on routes that should be protected
- TODO/FIXME comments in payment or auth code
- Hardcoded secrets or credentials (even test values)
- Disabled security middleware

**HIGH** (fix before next milestone):
- Routes missing Zod input validation
- Prisma queries without select (returning full model)
- Missing error handling in external service calls
- Console.log statements in production code paths

**MEDIUM** (fix within this sprint):
- Duplicate code that should be a shared utility
- Inconsistent naming (camelCase vs snake_case mixed)
- Missing TypeScript types (any usage)
- Tests that test implementation rather than behavior

**LOW** (backlog):
- Missing JSDoc on public functions
- Outdated dependency versions
- Unused imports

Format as a markdown table per category: File | Line | Issue | Suggested Fix
```

### `/stripe-test` — Stripe Integration Test Runner

File: `.claude/skills/stripe-test.md`

```markdown
Run a comprehensive validation of the Stripe integration in CompliCore.

1. Read backend/src/routes/payments.ts completely
2. Check for:
   - HMAC signature verification on the webhook endpoint
   - Idempotency handling (what happens on duplicate events)
   - Correct HTTP status codes (return 400 for bad signatures, not 500)
   - env.STRIPE_WEBHOOK_SECRET usage (not hardcoded)
   - Prisma Payment model updates on: payment_intent.succeeded, payment_intent.payment_failed, charge.refunded
3. Run the relevant backend tests: cd backend && npm test -- --grep "payment"
4. Report: PASS / FAIL per check with the exact line number of any failure
5. If any check fails, propose the minimal fix and ask for approval before implementing
```

### `/schema-check` — Prisma Schema Validator

File: `.claude/skills/schema-check.md`

```markdown
Perform a full audit of backend/prisma/schema.prisma.

Check for:
1. Every model has a proper primary key (id with @id)
2. Unique constraints on fields that must be unique (email, confirmation_code, etc.)
3. Relations are correctly defined (both sides of @relation)
4. Sensitive fields (access_code, wifi_password, etc.) are noted for encryption in code
5. No missing @updatedAt on models that need audit trails
6. Index coverage: frequently queried fields have @@index
7. The schema compiles: run `cd backend && npx prisma validate`

Report findings as: Model | Field | Issue | Recommended Fix
Flag any field that stores PII without a comment noting its encryption status.
```

### `/trial-audit` — Subscription & Trial Health Check

File: `.claude/skills/trial-audit.md`

```markdown
Audit CompliCore's subscription and trial lifecycle.

1. Read backend/src/lib/lifecycle-email-automation.ts
2. Read backend/src/lib/lifecycle-email-sequences.ts
3. Read backend/prisma/schema.prisma (BillingPlan, Subscription models)
4. Check:
   - Trial expiry emails are sent before expiry (not after)
   - Expired subscriptions block access to host features (not just send email)
   - The LIFECYCLE_EMAIL_TICK_MS env var is validated in env.ts
   - Email sending has error handling (failed email send should NOT crash the tick)
   - No PII is logged when sending lifecycle emails
5. Simulate: what happens to a host whose trial expires at midnight and logs in at 00:01?
   Walk through the code path step by step.
6. Report gaps as: Gap | Severity | Affected Users | Fix
```

### `/batch` — Batch Task Executor

File: `.claude/skills/batch.md`

```markdown
Execute a batch of independent tasks in sequence. For each task:
1. Read the relevant files
2. Implement the change
3. Run the appropriate test or lint command
4. Commit with a descriptive message
5. Report: DONE | FAILED | SKIPPED (with reason)

Tasks to execute:
$ARGUMENTS

Rules:
- If any task FAILS, halt and report. Do not continue to the next task.
- If a task requires a schema migration, flag it and skip (requires human coordination).
- Commit each task separately so the history is clean.
```

### `/perf-audit` — Performance Audit

File: `.claude/skills/perf-audit.md`

```markdown
Perform a performance audit of the CompliCore backend.

1. Scan all files in backend/src/routes/ for N+1 query patterns:
   - A Prisma query inside a .map() or .forEach() loop
   - Multiple sequential Prisma queries that could be a single query with include

2. Identify the top 5 routes by estimated query count per request

3. Check Redis usage:
   - Is Redis used for caching expensive queries?
   - Are cache TTLs set appropriately?
   - Is there cache invalidation on mutations?

4. Check for missing database indexes on frequently filtered fields

5. Report as: Route | Issue | Query Count Impact | Fix Priority (P0/P1/P2)

6. For each P0 issue, propose the exact Prisma query optimization and ask for approval.
```

---

## 5. Autonomous Bug Fixing — The Self-Healing Loop

### The Three-Source Bug Detection Protocol

CompliCore bugs surface from three sources. Each has a dedicated response protocol.

**Source 1: CI Failure**

When `npm run lint` or `cd backend && npm test` fails:

```
A CI check has failed. Do not ask me what to do. Follow this protocol:

1. Read the full error output
2. Identify the root cause (not just the symptom)
3. Read the affected file(s) completely
4. Implement the minimal fix
5. Run the failing check again to confirm it passes
6. Commit with message: "fix: [root cause description]"
7. Report: what failed, why, what you changed, and the line numbers
```

**Source 2: Docker Logs**

When a production-like issue appears in Docker logs:

```
I'm seeing this error in Docker logs:
[PASTE ERROR]

Do not guess. Follow this protocol:
1. Identify which service emitted this log (frontend / backend / postgres / redis)
2. Read the relevant source file
3. Trace the code path that leads to this error
4. Identify: is this a bug, a configuration issue, or expected behavior?
5. If it's a bug: implement the fix, test it, commit
6. If it's config: tell me exactly what env var to set and where
7. If it's expected: explain why and suggest if/how to suppress the log noise
```

**Source 3: Runtime Exception (Fastify Error Handler)**

The global error handler in `backend/src/plugins/error-handler.ts` catches unhandled exceptions. When a 500 appears in backend logs:

```
Production 500 error detected in backend/src/plugins/error-handler.ts logs:
[PASTE ERROR + STACK TRACE]

Protocol:
1. Parse the stack trace to find the originating file and line
2. Read that file
3. Identify the unhandled case
4. Implement defensive handling:
   - Validate inputs earlier (Zod schema)
   - Add null checks
   - Add try/catch with meaningful error messages
5. Ensure the fix returns RFC 9457 Problem Details format, not raw error
6. Test with a crafted request that would reproduce the error
7. Commit
```

### Autonomous Bug Fix Commit Message Format

All autonomous bug fixes must use this commit message format:

```
fix([scope]): [what was broken] — [what the fix does]

Root cause: [one sentence]
Affected: [file:line]
Tested by: [how you verified the fix]
```

### The "Never Retry" Rule

If an autonomous fix attempt fails (the test still fails after the fix):

1. Stop immediately. Do not attempt a second fix.
2. Write the failure state to `.claude/notes/partial-[bugid].md`
3. Report: what you tried, why you believe it failed, and what human judgment is needed.

Brute-forcing a fix creates worse bugs. Escalate instead.

---

## 6. Advanced Prompting — The Signal Amplifier

### High-Signal Prompts for CompliCore Development

The quality of Claude Code output is determined almost entirely by prompt quality. These prompts are calibrated for CompliCore's architecture and security requirements.

**"Grill Me" — Challenge Your Own Understanding:**
```
I believe the correct approach for [FEATURE] is [APPROACH].
Grill me on this. Find every assumption I'm making.
Point out what I might be wrong about.
Then tell me: is my approach sound, or is there a better one?
```

**"Prove It Works" — Evidence-First Development:**
```
Before implementing [FEATURE], write the tests first.
The tests should cover:
- The happy path
- Missing required fields (expect 400)
- Invalid auth (expect 401)
- Insufficient role (expect 403)
- Idempotent behavior (send the same request twice, expect consistent state)

Run the tests to confirm they fail (red). Then implement the feature.
Run the tests again to confirm they pass (green).
```

**"Elegant Solution" — Quality Bar Raising:**
```
You've implemented [FEATURE]. Now: make it elegant.
- Remove any code that isn't doing essential work
- Find any abstraction that can be simplified
- Find any validation that can be done at the Zod level instead of imperatively
- Find any Prisma query that returns more data than needed
- Find any magic number that should be a named constant
- Find any comment that explains what the code does instead of why

Do not change behavior. Only improve clarity and correctness.
```

**"Security Review" — Before Every Merge:**
```
Review this implementation for security issues before it merges.

Check specifically for CompliCore's known risk areas:
1. Is every route behind authentication if it should be?
2. Is every external input validated with Zod?
3. Does any response include fields it shouldn't (PII, credentials, tokens)?
4. Are there any SQL/NoSQL injection vectors? (Prisma prevents most but check raw queries)
5. Is the rate limiter applied to this endpoint?
6. Does the error response leak implementation details?
7. Is the idempotency plugin applied to any payment/booking mutations?

File: [PASTE FILE]
```

**"Explain Like an Architecture Diagram" — Learning Mode:**
```
Explain how [FEATURE/SYSTEM] works in CompliCore using:
1. An ASCII box diagram showing the data flow
2. A numbered walkthrough of each step
3. The exact file and line number where each step happens
4. What would go wrong if step N failed

Use CompliCore's actual code, not generic examples.
```

### Subagent Routing Table

Use Claude's subagents (via `claude --subagent`) for these task categories:

| Task Type | Route To | Why |
|---|---|---|
| Broad codebase exploration | `Explore` subagent | Protects main context from excessive file reads |
| Implementation planning | `Plan` subagent | Dedicated planning context; no code drift |
| Multi-file search | `Explore` subagent | Parallel search across large directory trees |
| Documentation research | `claude-code-guide` subagent | Specialized for Claude/API docs |
| UI layout design | `ui-ux-pro-max` skill | 67-style design intelligence |

### Prompt Anti-Patterns to Avoid

These prompts consistently produce worse output:

- "Can you help me with X?" — Vague. State what you need, not that you need help.
- "Fix the bug" without providing the error — Claude will guess. Paste the actual error.
- "Improve this code" without criteria — Claude will change random things. Specify what to improve.
- "Is this secure?" without context — Always specify: secure against what threat model?
- "Make it faster" without a baseline — Specify: faster than what, measured how?

---

## 7. Data & Analytics — The Evidence Engine

### The No-Manual-SQL Rule

All CompliCore analytics queries must go through Prisma. Direct SQL string construction is banned (injection risk). For complex analytics that Prisma can't express cleanly, use Prisma's `$queryRaw` with tagged template literals only:

```typescript
// CORRECT — parameterized, injection-safe
const result = await prisma.$queryRaw`
  SELECT listing_id, COUNT(*) as booking_count
  FROM "Booking"
  WHERE check_in >= ${startDate}
  AND status = 'confirmed'
  GROUP BY listing_id
  ORDER BY booking_count DESC
  LIMIT ${limit}
`;

// WRONG — never do this
const result = await prisma.$queryRawUnsafe(
  `SELECT * FROM "Booking" WHERE status = '${status}'`
);
```

### PostgreSQL Analytics Patterns for CompliCore

**Booking Revenue by Listing (Last 30 Days):**
```typescript
const revenueByListing = await prisma.payment.groupBy({
  by: ['booking_id'],
  where: {
    status: 'succeeded',
    created_at: { gte: thirtyDaysAgo },
  },
  _sum: { amount: true },
  orderBy: { _sum: { amount: 'desc' } },
});
```

**Occupancy Rate per Listing:**
```typescript
const occupancyDays = await prisma.booking.count({
  where: {
    listing_id: listingId,
    status: 'confirmed',
    check_in: { gte: periodStart },
    check_out: { lte: periodEnd },
  },
});
const occupancyRate = occupancyDays / totalDaysInPeriod;
```

**Guest Retention (Repeat Bookers):**
```typescript
const repeatGuests = await prisma.booking.groupBy({
  by: ['guest_name'],  // ideally guest_id in production
  having: { guest_name: { _count: { gt: 1 } } },
  _count: { guest_name: true },
});
```

### Prometheus Metrics for CompliCore

The backend exposes a `/metrics` endpoint via the `observability` plugin. Standard counters to track:

**Add to `backend/src/lib/metrics.ts`:**

```typescript
// Booking funnel metrics
export const bookingCreated = new Counter({
  name: 'complicore_booking_created_total',
  help: 'Total bookings created',
  labelNames: ['listing_id', 'channel'],
});

export const bookingConfirmed = new Counter({
  name: 'complicore_booking_confirmed_total',
  help: 'Total bookings confirmed',
});

export const paymentSucceeded = new Counter({
  name: 'complicore_payment_succeeded_total',
  help: 'Total successful payments',
  labelNames: ['currency'],
});

export const aiRequestDuration = new Histogram({
  name: 'complicore_ai_request_duration_seconds',
  help: 'Duration of AI service requests',
  labelNames: ['service', 'endpoint'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});
```

### Grafana Dashboard Queries for CompliCore

These PromQL queries work with the monitoring stack in `monitoring/`:

**Booking Rate (per minute, 5-min average):**
```promql
rate(complicore_booking_created_total[5m]) * 60
```

**Payment Success Rate:**
```promql
rate(complicore_payment_succeeded_total[5m]) /
rate(complicore_booking_confirmed_total[5m])
```

**API Latency P95 (by route):**
```promql
histogram_quantile(0.95,
  rate(http_request_duration_seconds_bucket{job="complicore-api"}[5m])
)
```

**Error Rate (non-2xx responses):**
```promql
rate(http_requests_total{job="complicore-api", status=~"5.."}[5m]) /
rate(http_requests_total{job="complicore-api"}[5m])
```

### Analytics Skill Template

When adding a new analytics endpoint, use this template:

```typescript
// GET /v1/analytics/[metric]
// Auth: requireRole(['host', 'admin'])
// Returns: time-series data for the requesting host's properties

fastify.get('/analytics/[metric]', {
  preHandler: [fastify.requireRole(['host', 'admin'])],
  schema: {
    querystring: z.object({
      from: z.string().datetime(),
      to: z.string().datetime(),
      listingId: z.string().uuid().optional(),
    }),
    response: {
      200: z.object({
        data: z.array(z.object({
          date: z.string(),
          value: z.number(),
        })),
        meta: z.object({
          total: z.number(),
          currency: z.string().optional(),
        }),
      }),
    },
  },
}, async (request, reply) => {
  const { from, to, listingId } = request.query;
  const hostId = request.user.sub;

  // Scope all queries to this host's properties
  const where = {
    listing: { host_id: hostId },
    ...(listingId ? { listing_id: listingId } : {}),
    created_at: { gte: new Date(from), lte: new Date(to) },
  };

  // ... query and return
});
```

---

## 8. Performance Audit — The Scalability Radar

### Known N+1 Risk Zones in CompliCore

These code patterns in CompliCore are N+1 risks. Check for them before every merge:

**Risk Zone 1: Booking List with Payment Status**

Anti-pattern:
```typescript
const bookings = await prisma.booking.findMany({ where: { listing_id } });
// N+1: fetching payment for each booking separately
const withPayments = await Promise.all(
  bookings.map(b => prisma.payment.findFirst({ where: { booking_id: b.id } }))
);
```

Fix:
```typescript
const bookings = await prisma.booking.findMany({
  where: { listing_id },
  include: { payments: { take: 1, orderBy: { created_at: 'desc' } } },
});
```

**Risk Zone 2: Listing List with Booking Count**

Anti-pattern:
```typescript
const listings = await prisma.listing.findMany();
const withCounts = await Promise.all(
  listings.map(l => prisma.booking.count({ where: { listing_id: l.id } }))
);
```

Fix:
```typescript
const listings = await prisma.listing.findMany({
  include: { _count: { select: { bookings: true } } },
});
```

**Risk Zone 3: Message Thread Loading**

Anti-pattern: Loading messages one by one as the user scrolls.

Fix: Paginate at the query level with cursor-based pagination:
```typescript
const messages = await prisma.message.findMany({
  where: { booking_id },
  orderBy: { created_at: 'desc' },
  take: 50,
  cursor: cursor ? { id: cursor } : undefined,
  skip: cursor ? 1 : 0,
});
```

### k6 Load Test Setup for CompliCore

Create `scripts/load-test.js` for k6 benchmarking:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.API_URL || 'http://localhost:4000';
const AUTH_TOKEN = __ENV.AUTH_TOKEN;

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // ramp to 10 users
    { duration: '1m',  target: 50 },   // ramp to 50 users
    { duration: '30s', target: 100 },  // ramp to 100 users
    { duration: '1m',  target: 100 },  // hold at 100
    { duration: '30s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],    // less than 1% failure rate
  },
};

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    'Cookie': `cc_access=${AUTH_TOKEN}`,
  };

  // Listings endpoint
  const listingsRes = http.get(`${BASE_URL}/v1/listings`, { headers });
  check(listingsRes, { 'listings status 200': (r) => r.status === 200 });

  // Bookings endpoint
  const bookingsRes = http.get(`${BASE_URL}/v1/bookings`, { headers });
  check(bookingsRes, { 'bookings status 200': (r) => r.status === 200 });

  sleep(1);
}
```

Run with: `k6 run --env API_URL=http://localhost:4000 --env AUTH_TOKEN=[token] scripts/load-test.js`

### Scalability Constraints Identified

These are the current hard limits of the CompliCore architecture:

| Constraint | Current State | Limit | Fix Path |
|---|---|---|---|
| Redis | Optional (REDIS_URL) | Single instance without Redis | Make REDIS_URL required for multi-instance |
| Socket.IO | No Redis adapter | 1 backend instance only | Add Redis adapter when REDIS_URL present |
| Prisma Connection Pool | Default (5 connections) | Hits limit at ~50 concurrent users | Set `connection_limit` in DATABASE_URL |
| AI Service | No circuit breaker | AI down = 500 errors | Add timeout + fallback in ai.ts routes |
| File Upload | Direct to Cloudinary | No size/type validation | Add Multer guards before Cloudinary upload |

### Performance Budget for CompliCore Routes

Target response times (P95) for production:

| Route Category | P95 Target | Alert Threshold |
|---|---|---|
| Auth endpoints (/v1/auth/*) | < 200ms | > 500ms |
| Listing/Booking CRUD | < 300ms | > 800ms |
| Analytics endpoints | < 1000ms | > 3000ms |
| AI endpoints | < 5000ms | > 15000ms |
| Webhook endpoints | < 100ms | > 300ms |

---

## 9. Learning Mode — The Knowledge Crystallizer

### ASCII Architecture Diagrams for CompliCore

Request these diagrams when onboarding a new team member or starting work in an unfamiliar area:

**Full Request Lifecycle:**
```
Ask Claude:
Draw an ASCII box diagram of a typical CompliCore API request lifecycle,
from browser to database and back. Show: NextAuth session, Next.js route,
fetch to Fastify, JWT verification, RBAC check, Zod validation,
Prisma query, PostgreSQL, response, and the error handler path.
Include actual file paths at each step.
```

**Auth Flow:**
```
Ask Claude:
Draw the CompliCore authentication flow: initial login → access token →
refresh token → step-up MFA (WebAuthn) → protected resource access.
Show the HttpOnly cookie flow. Show what happens on token expiry.
Use ASCII boxes. Include actual file names.
```

**Agentic Mesh Architecture:**
```
Ask Claude:
Draw the Sovereign Agentic Mesh architecture from
backend/src/routes/agentic-mesh.ts and backend/src/lib/complicore-orchestrator.ts.
Show: agent registry, A2A handshake, guardrail checks, external AI services,
and the biometric settlement trigger path to the Ethereum smart contract.
```

### HTML Slide Explainer Pattern

For complex subsystems, request an HTML explainer:

```
Create a self-contained HTML file (single file, no external dependencies)
that explains [SUBSYSTEM] in CompliCore using:
- Animated step-by-step code walkthrough (CSS transitions)
- Highlighted file paths
- Color-coded data flow (green = success path, red = error path, yellow = decision)
- A "try it" interactive example using mock data

Target audience: a mid-level engineer who knows TypeScript but has never seen CompliCore.
Save to: docs/explainers/[subsystem].html
```

### Spaced Repetition Pattern

After each learning session, create a flashcard file:

```markdown
# CompliCore Flashcards — [TOPIC] — [DATE]

Q: Where is the global error handler registered?
A: backend/src/plugins/error-handler.ts — registered in server.ts

Q: What format does CompliCore use for validation errors?
A: RFC 9457 Problem Details — {type, title, status, detail, errors[]}

Q: What prevents duplicate payment processing?
A: The idempotency plugin at backend/src/plugins/idempotency.ts

Q: What is ENABLE_DEMO_FALLBACK and why is it dangerous in production?
A: When true, uses the in-memory user store instead of PostgreSQL.
   Dangerous because: no persistence, no real auth, demo credentials work.

Q: What two prefixes are all routes registered under?
A: /v1 (canonical) and /api (deprecated). Always use /v1 in new code.
```

Save flashcards to `.claude/notes/flashcards/[topic].md`. Review weekly.

---

## 10. 14-Day Build Plan — The Sprint Blueprint

### The Plan

This is a two-week sprint to take CompliCore from its current state to production-ready for the first paying hosts. Each day has a primary Claude Code prompt, a done criterion, and an integration checkpoint.

| Day | Focus Area | Primary Prompt | Done Criterion |
|---|---|---|---|
| 1 | Schema audit & migrations | `/schema-check` → fix all HIGH issues | `npx prisma validate` passes |
| 2 | Auth hardening | Prompt: "Audit all routes for missing auth decorators" | Zero unprotected host/admin routes |
| 3 | Stripe webhook complete | `/stripe-test` → fix all failures | All Stripe event types handled |
| 4 | PMS connector hardening | Prompt: "Verify HMAC on all PMS webhook paths" | All webhooks reject invalid signatures |
| 5 | Lifecycle email audit | `/trial-audit` → fix gaps | Trial expiry blocks access (not just email) |
| 6 | AI safety audit | Prompt: "Audit AI routes for PII exposure" | No guest PII reaches external AI services |
| 7 | Performance baseline | `/perf-audit` → fix P0 N+1s | k6 P95 < 500ms at 50 concurrent users |
| 8 | Error handling sweep | Prompt: "Find all unhandled promise rejections" | No unhandled rejections in test run |
| 9 | Frontend auth guards | Prompt: "Audit all (auth) routes for session checks" | Unauthenticated access returns 401 |
| 10 | Test coverage sprint | Prompt: "Write tests for every route missing coverage" | Backend test coverage > 70% |
| 11 | Technical debt | `/techdebt` → fix all CRITICAL | Zero CRITICAL tech debt items |
| 12 | OpenAPI drift check | `npm run openapi:smoke` → fix contract drift | OpenAPI spec matches implementation |
| 13 | Load test + tune | k6 load test → tune connection pool + cache | P95 < 500ms at 100 concurrent users |
| 14 | Production readiness | Full launch checklist (Section 11) | All checklist items green |

### Day-by-Day Exact Prompts

**Day 1 — Schema Audit:**
```
/schema-check
For every HIGH issue found, implement the fix now.
Run `cd backend && npx prisma validate` after each fix.
Run `cd backend && npm test` when all fixes are done.
Commit as: "fix(schema): [summary of all fixes]"
```

**Day 3 — Stripe Complete:**
```
Read backend/src/routes/payments.ts completely.
Then read the Stripe documentation pattern for webhook handling.
Implement handlers for these events if missing:
- payment_intent.succeeded → update Payment.status to 'succeeded'
- payment_intent.payment_failed → update Payment.status to 'failed', log reason
- charge.refunded → update Payment.status to 'refunded', create refund record
- customer.subscription.deleted → update Subscription.status to 'cancelled'

For each handler:
1. Verify it's inside the HMAC signature check
2. Verify it uses the idempotency plugin
3. Write a test that sends the raw Stripe event payload

Commit as: "feat(payments): complete Stripe webhook event handlers"
```

**Day 7 — Performance Baseline:**
```
/perf-audit
Fix all P0 N+1 issues identified.
After fixing, run: cd backend && npm test
Then set up k6 with the script in scripts/load-test.js.
Run: k6 run scripts/load-test.js
Report the P95 latency for each major endpoint.
If any endpoint exceeds 500ms P95, identify the cause and fix it.
Target: all endpoints under 500ms P95 at 50 concurrent users.
```

**Day 10 — Test Coverage Sprint:**
```
Run: cd backend && npm run test -- --coverage
For every file below 50% coverage, write integration tests using fastify.inject().
Priority order:
1. backend/src/routes/payments.ts
2. backend/src/routes/bookings.ts
3. backend/src/routes/listings.ts
4. backend/src/routes/auth.ts
5. backend/src/routes/ai.ts

Each test must cover: happy path, auth failure (401), and at least one validation failure (400).
Commit as: "test: increase coverage for [file]" per file.
```

---

## 11. Launch Checklist — The Go-Live Gate

### Product Readiness

- [ ] Listings CRUD: create, read, update, delete — all working
- [ ] Booking flow: create booking → payment → confirmation email → access code delivery
- [ ] Guest portal: booking details, check-in instructions, WiFi credentials accessible
- [ ] Host dashboard: bookings list, calendar, revenue summary
- [ ] Cleaner portal: upcoming cleanings, property access
- [ ] Stripe Connect: host onboarding, payout scheduling
- [ ] PMS integration: at least one connector (Guesty or Hostaway) working end-to-end
- [ ] Lifecycle emails: trial start, trial reminder (3 days before), trial expiry, onboarding sequence

### Security Readiness

- [ ] `NODE_ENV=production` set
- [ ] `ENABLE_DEMO_FALLBACK=false` enforced
- [ ] `PMS_WEBHOOK_SECRET` configured
- [ ] `STRIPE_WEBHOOK_SECRET` configured
- [ ] `COOKIE_SECURE=true` and `COOKIE_SAME_SITE=none`
- [ ] `DB_SSL=true` and `DB_SSL_REJECT_UNAUTHORIZED=true`
- [ ] `JWT_SECRET` is at least 32 characters, randomly generated
- [ ] `SECURITY_AUDIT_LOG_PATH` configured (or SIEM URL)
- [ ] `FIELD_ENCRYPTION_KEY` configured for access_code and WiFi credential fields
- [ ] Rate limiting tested: brute force on login endpoint returns 429 after threshold
- [ ] WebAuthn step-up working for host-sensitive actions
- [ ] All `/api/*` routes returning Deprecation headers
- [ ] CORS allowlist set to production frontend domain only
- [ ] Security headers verified: HSTS, CSP, X-Frame-Options, etc.
- [ ] `npm audit` run: zero high/critical vulnerabilities

### Legal & Compliance Readiness

- [ ] Privacy Policy published and linked from all data collection forms
- [ ] Terms of Service published and linked from signup
- [ ] GDPR data deletion flow implemented (DELETE /v1/users/me)
- [ ] Cookie consent banner implemented
- [ ] Data processing agreement with Stripe, Cloudinary, SendGrid reviewed
- [ ] Local STR compliance: platform does not help hosts evade local regulations
- [ ] Guest identity verification flow reviewed for applicable jurisdictions

### Monitoring & Observability Readiness

- [ ] Prometheus metrics endpoint (`/metrics`) accessible to scraper only (not public)
- [ ] Grafana dashboard shows: booking rate, payment success rate, error rate, API latency
- [ ] Alertmanager configured: PagerDuty or Slack alerts for: error rate > 1%, P95 latency > 2s, payment failure rate > 5%
- [ ] Log aggregation: all backend logs flowing to centralized log store
- [ ] Uptime monitoring: external synthetic check on `/v1/health` every 60 seconds
- [ ] Database backup: automated daily backup with tested restore procedure
- [ ] Redis persistence: AOF or RDB configured (not default ephemeral)

### Infrastructure Readiness

- [ ] Database connection pool: `connection_limit=20` in `DATABASE_URL`
- [ ] Redis URL configured: Socket.IO adapter active for multi-instance
- [ ] Horizontal scaling tested: two backend instances with shared Redis/PostgreSQL
- [ ] CDN configured: Cloudflare or CloudFront in front of frontend
- [ ] Image upload: Cloudinary credentials configured, upload size limits enforced
- [ ] Graceful shutdown: `SIGTERM` handler in `backend/src/index.ts` closes connections
- [ ] Health check endpoint: `GET /v1/health` returns 200 when DB and Redis are reachable
- [ ] Docker images: build and push pipeline working (no local-only images in production)
- [ ] Blue-green deployment: tested cutover procedure using docker-compose.blue/green.yml

### Load & Performance Readiness

- [ ] k6 load test passing: P95 < 500ms at 100 concurrent users
- [ ] Zero N+1 queries in booking/listing list endpoints
- [ ] Redis caching on: listing details (TTL: 5 min), AI responses (TTL: 1 hour)
- [ ] Database indexes on: booking.listing_id, booking.status, payment.booking_id, message.booking_id
- [ ] Prisma query count per request: no route exceeds 5 queries

---

## The Multiplier in Practice

The table below shows the wall-clock compression achievable with the Antigravity system running at full capacity — all five worktrees active, Plan Mode used before every feature, slash commands automating audits.

| Task | Traditional Solo Dev | Antigravity (5 parallel sessions) |
|---|---|---|
| 3-day revenue sprint | 3 days | ~8 hours |
| Full security audit | 2 days | ~3 hours |
| Test coverage from 20% → 70% | 4 days | ~10 hours |
| PMS connector integration | 3 days | ~6 hours |
| Production launch checklist | 2 days | ~4 hours |
| **Full two-week build plan** | **14 days** | **~4 days** |

The compression comes from three sources:
1. **Parallel execution**: Five independent tasks run simultaneously instead of sequentially
2. **Zero context-switching cost**: Each Claude session stays focused; no human cognitive overhead from switching
3. **Institutional memory**: CLAUDE.md + notes directory eliminates re-learning the same lessons across sessions

The Antigravity system does not make Claude Code faster per task. It eliminates the overhead that exists between tasks. That is where the time goes.

---

*Generated for CompliCore — Compliance-First Short-Term Rental Platform*
*Branch: `claude/antigravity-system-implementation-IUy9J`*
