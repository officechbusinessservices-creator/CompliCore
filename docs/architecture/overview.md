# Architecture Overview

CompliCore is a monorepo containing two independently deployable applications that communicate over HTTP.

---

## High-level Structure

```
CompliCore/
├── src/            # Next.js 16+ frontend (App Router)
├── backend/        # Fastify + TypeScript REST API
├── prisma/         # (inside backend/) PostgreSQL schema and migrations
├── contracts/      # Ethereum smart contract (DvP settlement)
├── specs/          # OpenAPI 3.1 specification
├── bridge/         # Kubernetes manifests
├── monitoring/     # Prometheus / Grafana / Alertmanager configs
├── scripts/        # Operational scripts
└── docs/           # Technical documentation (this directory)
```

---

## Frontend — Next.js (App Router)

**Root:** `src/`

The frontend uses the Next.js App Router with route groups to separate concerns:

| Route group | Mount path | Purpose |
|-------------|-----------|---------|
| `(auth)` | `/dashboard`, `/listings`, `/bookings`, `/pricing`, `/messaging`, `/channels`, `/revenue`, `/notifications`, `/ops`, `/settings` | Authenticated host console |
| `(portal)` | `/portal/host`, `/portal/guest`, `/portal/cleaner`, `/portal/maintenance`, `/portal/corporate` | Role-specific portals |
| `(prototype)` | `/prototype/*` | Feature prototype screens (50+ demo screens, not production) |
| `(public)` | `/about`, `/privacy`, `/terms`, etc. | Public pages |
| `landing/` | `/landing/host`, `/landing/guest`, `/landing/enterprise` | Marketing pages |
| `guest/` | `/guest/*` | Guest-facing booking and review flows |
| `api/auth/[...nextauth]/` | `/api/auth/*` | NextAuth.js handler only |

**Key UI directories:**

- `src/components/ui/` — shadcn/ui base components (`button.tsx`, `card.tsx`, etc.)
- `src/components/` — feature-level React components
- `src/lib/` — frontend utilities
- `src/styles/` — global CSS
- `src/test/` — Vitest + React Testing Library test files

**Next.js features in use:**

- `reactStrictMode: true`
- `compress: true` (gzip at the Next.js layer)
- Image optimisation: AVIF/WebP formats, custom device sizes; `unoptimized: true` in development only
- Bundle analyser via `ANALYZE=true next build`
- Security headers for every route (see `next.config.js`)

---

## Backend — Fastify + TypeScript

**Root:** `backend/src/`

### Entry points

| File | Responsibility |
|------|---------------|
| `index.ts` | Process entry; graceful shutdown handling |
| `server.ts` | Fastify instance factory; plugin and route registration |

### Plugins (`backend/src/plugins/`)

| Plugin | Purpose |
|--------|---------|
| `security-fortress.ts` | CORS (`@fastify/cors`), Helmet (`@fastify/helmet`), global rate-limiting (`@fastify/rate-limit`), cookie support (`@fastify/cookie`) |
| `observability.ts` | Prometheus `/metrics` endpoint via `prom-client` |
| `idempotency.ts` | Idempotent request handling (prevents duplicate payments/bookings) |
| `error-handler.ts` | Global error handler; emits RFC 9457 Problem Details responses |
| `logging.ts` | Structured JSON logging (Pino); sensitive fields redacted |
| `request-context.ts` | Per-request context storage |

### Route registration

Routes are registered under **both** `/v1` (current) and `/api` (deprecated) prefixes. The `/api` prefix adds `Deprecation: true` and `Sunset` response headers.

### Route files (`backend/src/routes/`)

| File | Domain |
|------|--------|
| `auth.ts` | Registration, login, logout, token refresh, WebAuthn MFA step-up, password reset |
| `users.ts` | User profile read/update |
| `bookings.ts` | Booking CRUD, status changes, access-credential retrieval |
| `listings.ts` | Listing CRUD, photo upload |
| `properties.ts` | Property CRUD, availability, pricing, quotes |
| `payments.ts` | Stripe PaymentIntent creation, billing plans |
| `messages.ts` | Guest–host messaging threads |
| `reviews.ts` | Review submission and retrieval |
| `analytics.ts` | Dashboard metrics |
| `ai.ts` | AI pricing suggestions, listing optimisation, orchestration |
| `pms.ts` | PMS provider connection, sync, import |
| `pms-connectors.ts` | Direct PMS connectors (Guesty, Hostaway, Beds24) with HMAC-validated webhooks |
| `modules.ts` | Optional platform modules (channels, cleaning, pricing, tax, loyalty, etc.) |
| `lifecycle-email.ts` | Lifecycle email sequence management (admin only) |
| `agentic-mesh.ts` | Experimental agentic AI orchestration endpoints |
| `economic.ts` | Experimental economic simulation endpoints |

### Library utilities (`backend/src/lib/`)

| File | Purpose |
|------|---------|
| `env.ts` | Zod-validated environment variables; server refuses to start on invalid config |
| `encryption.ts` | AES-256-GCM field encryption with optional AWS KMS key-wrapping |
| `jwt-rotation.ts` | JWT signing with support for `JWT_PREVIOUS_SECRET` key rotation |
| `secure-user-model.ts` | In-memory user store for demo/development mode; argon2id password hashing |
| `validation.ts` | Zod error formatting helpers |
| `security-audit.ts` | JSONL security event log; optional SIEM export |
| `webauthn-stepup.ts` | WebAuthn MFA step-up challenge/verification logic |
| `signed-url.ts` | Time-limited signed URL generation |
| `metrics.ts` | Prometheus counter and histogram definitions |
| `redis.ts` | ioredis client with a `getOrDefault` cache helper (optional; falls back gracefully when `REDIS_URL` is not set) |
| `complicore-orchestrator.ts` | Multi-service AI orchestration |
| `lifecycle-email-automation.ts` | Background lifecycle email scheduler |
| `lifecycle-email-sequences.ts` | Email sequence definitions |

### Realtime

`backend/src/realtime/socket.ts` — Socket.IO server with an optional Redis adapter for horizontal scaling.

---

## Database — PostgreSQL via Prisma

**Schema:** `backend/prisma/schema.prisma`

Key models:

| Model | Purpose |
|-------|---------|
| `User` | Accounts; holds `roles[]`, password hash, reset token |
| `WebAuthnCredential` | WebAuthn public keys linked to a `User` |
| `Booking` | Rental bookings; holds confirmation code, access code (encrypted), WiFi credentials |
| `Listing` | Property listings managed by hosts |
| `Message` | Guest–host messages linked to a booking |
| `Payment` | Stripe payment records |
| `BillingPlan` | Platform subscription tiers |
| `Subscription` | User ↔ plan subscriptions |
| `Payout` | Host payout records |

---

## Frontend ↔ Backend Communication

- The frontend reads `NEXT_PUBLIC_API_BASE` (e.g. `http://localhost:4000`) and calls the backend REST API directly from the browser.
- Authentication uses HttpOnly cookies (`cc_access`, `cc_refresh`) set by the backend. All authenticated fetch calls use `credentials: "include"`.
- NextAuth.js (`src/app/api/auth/[...nextauth]/`) handles the frontend session layer; it validates credentials against the backend `/v1/auth/login` endpoint.
- Real-time updates use Socket.IO from the backend.

---

## Third-party Integrations

| Category | Services |
|----------|---------|
| **PMS** | Guesty, Hostaway, Lodgify, Hostfully, Beds24 |
| **OTA channels** | Airbnb, VRBO, Booking.com (via channel module) |
| **Payments** | Stripe (PaymentIntent API) |
| **Image storage** | Cloudinary |
| **Email delivery** | Nodemailer / SendGrid |
| **Cache / PubSub** | Redis (ioredis) — optional |
| **Observability** | Prometheus + Grafana + Alertmanager |
| **Blockchain** | Ethereum smart contract (`contracts/ComplicoreInstantSettlement.sol`) — experimental |

---

## Deployment Topology

| Component | Target |
|-----------|--------|
| Frontend | Netlify / Vercel |
| Backend | Render / Docker / Kubernetes (bridge manifests) |
| Database | Render PostgreSQL / AWS RDS |
| CDN | Cloudflare / CloudFront |

See `DEPLOYMENT.md` and `bridge/` for full deployment details.
