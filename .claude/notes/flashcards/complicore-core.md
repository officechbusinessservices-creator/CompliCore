# CompliCore Core Flashcards

Review weekly. Add new cards after each learning session.

---

Q: Where is the global error handler registered?
A: backend/src/plugins/error-handler.ts — registered in server.ts

---

Q: What format does CompliCore use for validation errors?
A: RFC 9457 Problem Details — {type, title, status, detail, errors[]}

---

Q: What prevents duplicate payment processing?
A: The idempotency plugin at backend/src/plugins/idempotency.ts

---

Q: What is ENABLE_DEMO_FALLBACK and why is it dangerous in production?
A: When true, uses the in-memory user store (secure-user-model.ts) instead of PostgreSQL.
   Dangerous: no persistence, demo credentials work, real auth bypassed.

---

Q: What two prefixes are all routes registered under?
A: /v1 (canonical) and /api (deprecated). Always use /v1 in new code.

---

Q: What does `fastify.requireRole(['host'])` check?
A: 1) Valid JWT (authenticate), 2) User has 'host' role, 3) Step-up MFA satisfied.
   It is the combination of authenticate + role check + WebAuthn step-up.

---

Q: Where is the Prisma schema located?
A: backend/prisma/schema.prisma (inside /backend, not repo root)

---

Q: Where are environment variables validated?
A: backend/src/lib/env.ts — Zod schema, validated at startup. Server refuses to start on invalid config.

---

Q: What hashing algorithm is used for passwords?
A: argon2id (memoryCost: 19456, timeCost: 2) — configured in secure-user-model.ts

---

Q: What does the security-fortress plugin do?
A: Applies CORS, Helmet security headers, rate limiting, and cookie configuration.
   Located at backend/src/plugins/security-fortress.ts

---

Q: How are JWTs delivered to the client?
A: Two HttpOnly cookies: cc_access (short-lived) and cc_refresh (7 days).
   Also returned in response body for API clients that can't use cookies.
   NEVER store in localStorage or sessionStorage.

---

Q: What is the Socket.IO scaling constraint?
A: Without REDIS_URL, realtime only works on single-instance deployments.
   Redis adapter (for multi-instance) is only active when REDIS_URL is configured.

---

Q: What format are PMS webhooks verified with?
A: HMAC-SHA256 signature verification using env.PMS_WEBHOOK_SECRET

---

Q: What is the Agentic Mesh?
A: Sovereign AI orchestration system in backend/src/routes/agentic-mesh.ts.
   Handles: agent registry, A2A handshake, guardrail checks, biometric settlement triggers.
   Connects to the Ethereum smart contract for instant DvP settlement.

---
