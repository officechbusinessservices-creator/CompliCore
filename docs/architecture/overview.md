# Architecture Overview

CompliCore is a monorepo containing two independently deployable applications: a **Next.js frontend** and a **Fastify/Node.js backend**. They communicate over HTTP; the frontend uses `NEXT_PUBLIC_API_BASE` to locate the backend.

---

## Repository Layout

```
CompliCore/
├── src/                    # Next.js 16+ frontend (App Router)
├── backend/                # Fastify 4 + TypeScript REST API
│   ├── src/
│   │   ├── routes/         # One file per domain (auth, bookings, listings, …)
│   │   ├── plugins/        # Fastify plugins (security, logging, metrics, …)
│   │   ├── lib/            # Business logic utilities
│   │   ├── controllers/    # Route controllers
│   │   ├── realtime/       # Socket.IO server
│   │   └── utils/          # Email and file-upload helpers
│   ├── prisma/             # Prisma schema + seed script
│   └── src/__tests__/      # Vitest integration tests
├── specs/openapi.yaml      # OpenAPI 3.1 specification
├── docs/                   # Technical documentation (this directory)
├── contracts/              # Solidity smart contract
├── monitoring/             # Prometheus + Grafana + Alertmanager configs
├── bridge/                 # Kubernetes manifests
├── scripts/                # Operational scripts (backup, restore, release)
└── docker-compose.yml      # Full local stack
```

---

## Frontend

**Framework:** Next.js 16+ with the App Router (`src/app/`).

**Technology:**

| Concern | Library |
|---------|---------|
| Language | TypeScript 5+ |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Auth | NextAuth.js v4 (Credentials provider) |
| Animation | Framer Motion |
| Formatter | Biome |
| Linter | ESLint (eslint-config-next) |

### App Router Structure

```
src/app/
├── (auth)/         # Authenticated host-console routes
│   ├── dashboard/
│   ├── listings/
│   ├── bookings/
│   ├── pricing/
│   ├── messaging/
│   ├── channels/
│   ├── revenue/
│   ├── notifications/
│   ├── ops/
│   └── settings/
├── (portal)/       # Role-specific portals (host, guest, cleaner, maintenance, corporate)
├── (prototype)/    # Feature prototypes (demo/development screens)
├── (public)/       # Public pages (about, privacy, terms, cookies)
├── landing/        # Marketing landing pages (host, guest, enterprise)
├── guest/          # Guest-facing booking and review flows
├── api/            # Next.js API routes (NextAuth.js only)
└── api-docs/       # Interactive API documentation viewer
```

**Path alias:** `@/*` resolves to `./src/*`.

### Frontend–Backend Communication

The frontend calls the backend REST API using `fetch` with `credentials: "include"` so that `HttpOnly` cookies are sent on every request. The base URL is configured via `NEXT_PUBLIC_API_BASE` (e.g., `http://localhost:4000`).

NextAuth.js (`src/app/api/auth/[...nextauth]/`) handles session state on the frontend. The actual user authentication is delegated to the Fastify backend via the Credentials provider.

---

## Backend

**Framework:** Fastify 4 (TypeScript 5+).

**Technology:**

| Concern | Library |
|---------|---------|
| ORM | Prisma 6 |
| Database | PostgreSQL 16+ |
| Cache / PubSub | Redis (ioredis, optional) |
| Auth tokens | @fastify/jwt |
| Password hashing | argon2id |
| MFA | @simplewebauthn/server |
| Input validation | Zod |
| Realtime | Socket.IO |
| Metrics | prom-client (Prometheus) |
| Email | Nodemailer / SendGrid |
| File storage | Cloudinary |

### Entry Points

- `backend/src/index.ts` — Starts the HTTP server; handles graceful shutdown signals.
- `backend/src/server.ts` — Fastify server factory; registers all plugins and route prefixes.

All route files are registered under **both** `/v1` and `/api` prefixes. The `/api` prefix is deprecated and carries response headers `Deprecation: true` and `Sunset: Wed, 31 Dec 2026 23:59:59 GMT`.

### Plugins (Registered in Order)

| Plugin | File | Purpose |
|--------|------|---------|
| request-context | `plugins/request-context.ts` | Generates/propagates `X-Request-Id` |
| logging | `plugins/logging.ts` | Structured per-request logging (method, url, status, duration) |
| security-fortress | `plugins/security-fortress.ts` | Helmet headers, CORS, rate limiting, cookie config |
| observability | `plugins/observability.ts` | Prometheus metrics endpoint (`/metrics`) |
| idempotency | `plugins/idempotency.ts` | `Idempotency-Key` deduplication for POST requests |
| error-handler | `plugins/error-handler.ts` | RFC 7807 Problem Details error format |

### Authentication Decorators

Fastify decorators added by the JWT/auth setup:

- `fastify.authenticate` — Verifies the `cc_access` JWT (cookie or `Authorization: Bearer` header).
- `fastify.requireRole(roles)` — Calls `authenticate`, then checks the user's `roles` array, and enforces WebAuthn step-up for `host` / `admin` roles.
- `fastify.requireStepUp` — Verifies that a WebAuthn step-up was completed within the configured TTL.

### Database Layer

Prisma ORM connects to PostgreSQL. The schema lives at `backend/prisma/schema.prisma`. Migrations are managed with `prisma migrate dev`. The Prisma client is instantiated as a singleton in `backend/src/lib/prisma.ts`.

In development, `ENABLE_DEMO_FALLBACK=true` allows the server to operate without a live database using an in-memory user store (`backend/src/lib/secure-user-model.ts`). This mode is explicitly blocked in production by the Zod env validator.

---

## Database Schema

Defined in `backend/prisma/schema.prisma`. Provider: `postgresql`.

| Model | Purpose | Notable indexes |
|-------|---------|-----------------|
| `User` | Platform users (host, guest, admin) | `email` |
| `WebAuthnCredential` | WebAuthn credentials per user | `userId` |
| `Booking` | Guest booking records | `(status, created_at)`, `user_id` |
| `Listing` | Property listings | `host_id` |
| `Message` | Booking thread messages | — |
| `Payment` | Payment records | `stripe_payment_intent_id` (unique) |
| `BillingPlan` | Subscription plan definitions | `code` (unique) |
| `Subscription` | User ↔ plan relationships | — |
| `Payout` | Host payout records | — |

---

## Realtime Layer

Socket.IO (`backend/src/realtime/socket.ts`) provides WebSocket support for real-time messaging and notifications. An optional Redis adapter (`REDIS_URL` + `WS_ENABLE_REDIS_ADAPTER=true`) enables horizontal scaling across multiple backend instances.

---

## Third-Party Integrations

| Category | Providers / Libraries |
|----------|-----------------------|
| PMS | Guesty, Hostaway, Beds24 (webhook + REST connectors) |
| OTA channels | Airbnb, VRBO, Booking.com (prototype; channel routes in `modules.ts`) |
| Payments | Stripe (checkout sessions, webhooks) |
| File storage | Cloudinary (listing photos) |
| Email | Nodemailer (SMTP) or SendGrid |
| Cache | Redis (idempotency store, optional WS adapter) |
| Metrics | Prometheus (scraped from `/metrics`) |
| Key management | AWS KMS (optional; wraps the AES-256-GCM field encryption key) |

---

## Deployment Targets

| Target | Notes |
|--------|-------|
| Netlify | Frontend (`npm run build`, publish `.next`) |
| Render | Backend (`cd backend && npm run build && npm run start`) |
| Docker Compose | `docker compose up -d` runs frontend, backend, PostgreSQL, Redis, and monitoring |
| Kubernetes | Manifests in `bridge/base/` (namespace, deployments, services, network policies) |
| Blue-green | `docker-compose.blue.yml` / `docker-compose.green.yml` |
