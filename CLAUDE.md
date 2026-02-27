# CLAUDE.md — CompliCore AI Assistant Reference

## Project Overview

**CompliCore** is a compliance-first, vendor-neutral short-term rental platform built with privacy-by-design, ethical AI, and global regulatory compliance at its core. It serves multiple user roles: hosts, guests, cleaners, maintenance staff, and corporate travelers.

The project is a **monorepo** with two independently deployable applications:
- **Frontend** (`/` root): Next.js 16+ app (App Router) — serves the UI
- **Backend** (`/backend`): Fastify + TypeScript REST API — serves business logic and data

---

## Repository Structure

```
CompliCore/
├── src/                          # Next.js frontend (App Router)
│   ├── app/                      # Pages and layouts
│   │   ├── (auth)/               # Authenticated host console routes
│   │   │   ├── dashboard/        # Host dashboard
│   │   │   ├── listings/         # Listings management
│   │   │   ├── bookings/         # Bookings management
│   │   │   ├── pricing/          # Pricing engine
│   │   │   ├── messaging/        # Guest communications
│   │   │   ├── channels/         # OTA channel management
│   │   │   ├── revenue/          # Revenue analytics
│   │   │   ├── notifications/    # Notifications
│   │   │   ├── ops/              # Operations
│   │   │   └── settings/         # Account settings
│   │   ├── (portal)/             # Role-specific portals
│   │   │   └── portal/
│   │   │       ├── host/         # Host portal
│   │   │       ├── guest/        # Guest portal
│   │   │       ├── cleaner/      # Cleaning staff portal
│   │   │       ├── maintenance/  # Maintenance staff portal
│   │   │       └── corporate/    # Corporate travel portal
│   │   ├── (prototype)/          # Feature prototypes (50+ screens)
│   │   ├── (public)/             # Public-facing pages
│   │   ├── landing/              # Marketing landing pages
│   │   │   ├── host/             # Host-targeted landing
│   │   │   ├── guest/            # Guest-targeted landing
│   │   │   └── enterprise/       # Enterprise landing
│   │   ├── guest/                # Guest-facing booking/review flows
│   │   ├── api/                  # Next.js API routes (NextAuth only)
│   │   │   └── auth/[...nextauth]/ # NextAuth.js handler
│   │   └── api-docs/             # Interactive API documentation viewer
│   ├── components/               # Reusable React components
│   │   └── ui/                   # shadcn/ui base components
│   ├── lib/                      # Frontend utilities
│   └── styles/                   # Global CSS
│
├── backend/                      # Fastify API server
│   ├── src/
│   │   ├── index.ts              # Entry point; graceful shutdown
│   │   ├── server.ts             # Fastify server factory; plugin/route registration
│   │   ├── controllers/
│   │   │   └── auth-controller.ts
│   │   ├── routes/               # Route handlers (one file per domain)
│   │   │   ├── auth.ts
│   │   │   ├── bookings.ts
│   │   │   ├── listings.ts
│   │   │   ├── payments.ts
│   │   │   ├── messages.ts
│   │   │   ├── properties.ts
│   │   │   ├── reviews.ts
│   │   │   ├── users.ts
│   │   │   ├── analytics.ts
│   │   │   ├── ai.ts
│   │   │   ├── pms.ts
│   │   │   ├── pms-connectors.ts
│   │   │   ├── modules.ts
│   │   │   ├── economic.ts
│   │   │   ├── agentic-mesh.ts   # Sovereign agentic AI orchestration
│   │   │   └── lifecycle-email.ts
│   │   ├── lib/                  # Backend utilities
│   │   │   ├── env.ts            # Zod-validated environment config
│   │   │   ├── encryption.ts     # AES-256-GCM field encryption + AWS KMS
│   │   │   ├── jwt-rotation.ts   # JWT key rotation
│   │   │   ├── secure-user-model.ts # In-memory user store; argon2id hashing
│   │   │   ├── validation.ts     # Zod error formatting
│   │   │   ├── security-audit.ts # Security event logging / SIEM export
│   │   │   ├── webauthn-stepup.ts # WebAuthn MFA step-up
│   │   │   ├── signed-url.ts     # Signed URL generation
│   │   │   ├── metrics.ts        # Prometheus metrics
│   │   │   ├── redis.ts          # Redis client
│   │   │   ├── lifecycle-email-automation.ts
│   │   │   ├── lifecycle-email-sequences.ts
│   │   │   └── complicore-orchestrator.ts
│   │   ├── plugins/              # Fastify plugins
│   │   │   ├── security-fortress.ts # CORS, Helmet, rate limiting, cookies
│   │   │   ├── observability.ts  # Prometheus metrics endpoint
│   │   │   ├── idempotency.ts    # Idempotent request handling
│   │   │   ├── error-handler.ts  # Global error handler
│   │   │   ├── logging.ts        # Structured logging
│   │   │   └── request-context.ts # Per-request context
│   │   ├── realtime/
│   │   │   └── socket.ts         # Socket.IO realtime events
│   │   └── utils/
│   │       ├── email.ts          # Nodemailer / SendGrid email utils
│   │       └── upload.ts         # Cloudinary upload handling
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema (PostgreSQL)
│   │   └── seed.ts               # Database seeding
│   └── src/__tests__/            # Vitest integration tests
│
├── contracts/
│   └── ComplicoreInstantSettlement.sol # Ethereum smart contract (DvP settlement)
├── specs/
│   └── openapi.yaml              # OpenAPI 3.1 specification
├── database/                     # SQL schema scripts
├── docs/                         # Architecture documentation
├── bridge/                       # Kubernetes manifests (base + overlays)
├── monitoring/                   # Prometheus, Grafana, Alertmanager configs
├── scripts/                      # Operational scripts (backup, restore, release)
├── netlify/                      # Netlify edge function configs
├── deploy/                       # Additional deployment artifacts
├── docker-compose.yml            # Full local stack
├── docker-compose.prod.yml       # Production Docker Compose
├── docker-compose.blue.yml       # Blue-green deployment
├── docker-compose.green.yml
├── Dockerfile                    # Frontend container
└── backend/Dockerfile            # Backend container
```

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript 5+ |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Animation | Framer Motion, GSAP, Three.js |
| Auth | NextAuth.js v4 (Credentials provider) |
| Linter/Formatter | ESLint (eslint-config-next) + Biome |
| Package Manager | npm (bun lock file also present) |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Fastify 4 |
| Language | TypeScript 5+ |
| Database | PostgreSQL 16+ via Prisma ORM |
| Cache / PubSub | Redis (ioredis) |
| Auth | @fastify/jwt (access + refresh cookie tokens) |
| Password Hashing | argon2id |
| MFA | WebAuthn (@simplewebauthn/server) |
| Input Validation | Zod |
| Realtime | Socket.IO with optional Redis adapter |
| Storage | Cloudinary (images) |
| Email | Nodemailer / SendGrid |
| Metrics | prom-client (Prometheus) |
| Testing | Vitest |
| Encryption | AES-256-GCM + optional AWS KMS |

### Infrastructure
| Component | Technology |
|---|---|
| Frontend hosting | Netlify / Vercel |
| Backend hosting | Render / Docker / Kubernetes |
| Database | Render PostgreSQL / AWS RDS |
| CDN | Cloudflare / CloudFront |
| Monitoring | Prometheus + Grafana + Alertmanager |
| Blockchain | Ethereum (Solidity smart contract) |

---

## Development Workflows

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ (or Docker)
- npm

### Frontend (root)

```bash
# Install dependencies
npm install

# Copy env file (required for NextAuth)
cp .env.local.example .env.local
# Set: NEXTAUTH_URL, NEXTAUTH_SECRET, DEMO_EMAIL, DEMO_PASSWORD, NEXT_PUBLIC_API_BASE

# Start dev server (port 3000)
npm run dev

# Type-check + lint
npm run lint

# Format with Biome
npm run format

# Analyze bundle size
npm run analyze

# Security checks
npm run security-check
```

### Backend (`/backend`)

```bash
cd backend

# Copy env file
cp .env.example .env
# Set DATABASE_URL at minimum; see Environment Variables section

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Or push schema without migration history (for dev/Docker)
npx prisma db push --accept-data-loss

# Seed database
npm run seed

# Start dev server (port 4000, hot-reload)
npm run dev

# Build
npm run build

# Start production
npm run start

# Run tests
npm run test

# Open Prisma Studio
npx prisma studio
```

### Full Stack with Docker Compose

```bash
# Start all services (frontend, backend, postgres, redis, monitoring)
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f api
```

### Running Tests

```bash
# All tests (lint + type-check frontend, vitest backend)
npm test

# Backend tests only
cd backend && npm test

# Backend tests with coverage
cd backend && npm run test -- --coverage
```

### OpenAPI Validation

```bash
# Validate openapi.yaml schema
npm run openapi:validate

# Build backend and smoke-test contract endpoints
npm run openapi:smoke
```

---

## Environment Variables

### Frontend (`.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE` | Backend URL (e.g., `http://localhost:4000`) |
| `NEXTAUTH_URL` | NextAuth canonical URL (e.g., `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Secret for NextAuth (min 32 chars) |
| `DEMO_EMAIL` | Demo login email |
| `DEMO_PASSWORD` | Demo login password |

### Backend (`.env` — full list in `backend/.env.example`)
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string **(required)** |
| `JWT_SECRET` | JWT signing secret, min 32 chars **(required)** |
| `PORT` | Server port (default: `4000`) |
| `ALLOWED_ORIGINS` | CORS allowlist, comma-separated |
| `ENABLE_DEMO_FALLBACK` | `true` for in-memory demo mode (forbidden in production) |
| `FIELD_ENCRYPTION_KEY` | Base64 AES-256 key for field-level encryption |
| `KMS_REGION` | AWS KMS region (required when using KMS-wrapped key) |
| `WEBAUTHN_MFA_ENABLED` | Enable WebAuthn MFA (default: `true`) |
| `PMS_WEBHOOK_SECRET` | HMAC secret for PMS webhooks **(required in production)** |
| `REDIS_URL` | Redis connection string (optional, enables WS scaling) |
| `CLOUDINARY_*` | Cloudinary credentials for image uploads |
| `EMAIL_*` / `SENDGRID_*` | Email delivery credentials |
| `SECURITY_AUDIT_LOG_PATH` | Path for security audit log file |

All environment variables are validated at startup via **Zod** (`backend/src/lib/env.ts`). The server refuses to start on invalid config.

---

## API Architecture

### Dual-prefix routes
All API routes are registered under **both** `/api` and `/v1` prefixes:
```
/v1/auth/...         ← canonical (preferred)
/api/auth/...        ← deprecated (Deprecation + Sunset headers sent)
```
The `/api` prefix carries `Deprecation: true` and `Sunset: Wed, 31 Dec 2026 23:59:59 GMT` headers. **Always use `/v1`.**

### Authentication Model
- **Access token**: Short-lived JWT (default 1 hour), set as `HttpOnly` cookie (`cc_access`) and also returned in response body
- **Refresh token**: Longer-lived JWT (default 7 days), set as `HttpOnly` cookie (`cc_refresh`)
- Use `credentials: "include"` on all authenticated frontend requests
- Roles: `guest`, `host`, `admin` — server-assigned, never trust client-supplied roles
- **Step-up MFA**: Host/admin routes require WebAuthn step-up verification; check `stepUpRequired` in JWT and `stepUpVerifiedAt` timestamp

### RBAC Decorators (Backend)
```typescript
fastify.authenticate       // Verifies JWT
fastify.requireRole(roles) // Verifies JWT + checks roles + step-up for host/admin
fastify.requireStepUp      // Verifies step-up MFA is satisfied
```

### Request Validation
All inputs validated with **Zod** schemas at the route level. Errors return RFC 9457 Problem Details format:
```json
{
  "type": "urn:problem:validation",
  "title": "Request validation failed",
  "status": 400,
  "detail": "...",
  "errors": [...]
}
```

---

## Database Schema (Prisma)

Key models in `backend/prisma/schema.prisma`:
- `User` — email (unique), name
- `Booking` — confirmation_code (unique), listing_id, guest_name, check_in, check_out, access_code (encrypted), wifi credentials, status
- `Listing` — title, address, price_per_night
- `Message` — booking_id, sender, body
- `Payment` — booking_id, amount, currency, status
- `BillingPlan` — code (unique), pricing tiers (flat, per-property, commission)
- `Subscription` — user → plan relation with status and dates
- `Payout` — host_id, amount, method, status

**Note**: The in-memory `secure-user-model.ts` is used for auth in the demo/development mode. Production should integrate with the Prisma `User` model.

---

## Security Architecture

Security is a first-class concern throughout the codebase.

### Backend Security Layers
1. **`security-fortress` plugin**: CORS, Helmet (security headers), rate limiting, cookie handling
2. **`argon2id`** password hashing (memoryCost: 19456, timeCost: 2)
3. **JWT rotation**: Support for previous secret (`JWT_PREVIOUS_SECRET`) during key rotation
4. **WebAuthn step-up MFA**: Required for host/admin sensitive actions
5. **Account lockout**: Configurable failed-login threshold and lockout duration
6. **Field-level encryption**: AES-256-GCM for sensitive fields; AWS KMS-backed key option
7. **Security audit log**: JSONL log + optional SIEM export for: login failures, RBAC denials, step-up events, impossible travel
8. **Signed URLs**: Time-limited signed URLs for sensitive resource access
9. **PMS webhook HMAC verification**: All inbound PMS webhooks must be signed
10. **Idempotency plugin**: Prevents duplicate payment/booking operations
11. **Honeytoken detection**: Configurable honeytoken IDs that trigger alerts

### Frontend Security Headers (Next.js)
Set in `next.config.js` for all routes: HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, CSP, COOP, CORP, Referrer-Policy, Permissions-Policy.

### Key Security Rules for AI Assistants
- **Never** store JWT tokens in `localStorage` or `sessionStorage` in frontend code; use HttpOnly cookies
- **Never** log or expose: passwords, access codes, guest PII, WiFi credentials, payment tokens
- **Never** trust client-supplied roles; roles are assigned server-side
- **Never** disable rate limiting, CORS, or Helmet in production code
- **Always** validate all external inputs with Zod at route boundaries
- **Always** use `fastify.requireRole` or `fastify.authenticate` on protected routes
- **Never** set `ENABLE_DEMO_FALLBACK=true` in production
- **Never** commit real secrets; use environment variables

---

## CI/CD Pipeline (`.github/workflows/ci.yml`)

Triggers on push/PR to `main`. Four parallel jobs:

| Job | Steps |
|---|---|
| `lint-type-test` | Frontend: `npm ci`, `npm run lint` (tsc + eslint). Backend: `npm ci`, `npm run build`, `npm run test` |
| `frontend-build` | (needs lint-type-test) `npm run build` |
| `backend-validate` | (needs lint-type-test) `prisma generate`, `vitest --coverage` |
| `openapi-drift-check` | (needs lint-type-test) Validate OpenAPI schema + smoke-test backend contract |

**Always ensure `npm run lint` and backend tests pass before merging.**

---

## Code Conventions

### TypeScript
- Strict mode enabled (`"strict": true`) for backend; frontend has `"noImplicitAny": false`
- Path alias `@/*` maps to `./src/*` in the frontend
- Backend and frontend have separate `tsconfig.json` files; frontend excludes `backend/**`

### Formatting & Linting
- **Biome** (`biome.json`): Formats `.ts`/`.tsx` in `src/` with spaces (2-space indent), double quotes
- **ESLint**: `eslint-config-next` for Next.js rules
- Run `npm run format` before committing frontend code
- Run `npm run lint` to type-check and lint

### Frontend Components
- UI primitives live in `src/components/ui/` (shadcn/ui pattern — `button.tsx`, `card.tsx`, etc.)
- Feature components live directly in `src/components/`
- Use Tailwind CSS for all styling; follow the existing color token system (CSS custom properties via HSL)
- Dark mode supported via `class` strategy (ThemeProvider at `src/components/ThemeProvider.tsx`)
- Use `clsx` + `tailwind-merge` for conditional class names

### Backend Routes
- One file per domain in `backend/src/routes/`
- Validate all request bodies with Zod before processing
- Register routes as Fastify plugins; prefix is injected by `server.ts`
- Use `fastify.inject()` in tests (not real HTTP calls)

### Naming Conventions
- Files: `kebab-case.ts` / `kebab-case.tsx`
- React components: `PascalCase`
- Variables/functions: `camelCase`
- Database fields: `snake_case` (Prisma schema)
- Environment variables: `UPPER_SNAKE_CASE`
- API endpoints: RESTful `/resource/:id` pattern

---

## Frontend Route Groups

| Group | Path | Description |
|---|---|---|
| `(auth)` | `/dashboard`, `/listings`, `/bookings`, etc. | Host console (requires session) |
| `(portal)` | `/portal/host`, `/portal/guest`, etc. | Role-specific portals |
| `(prototype)` | `/prototype/*` | 50+ feature prototype screens for demos |
| `(public)` | `/about`, `/privacy`, `/terms`, etc. | Public pages |
| root | `/`, `/login`, `/signup`, `/landing/*` | Homepage and marketing pages |

The `(prototype)` route group contains extensive demo screens (analytics, calendar-sync, smart pricing, AI features, etc.). These are not production-ready but demonstrate planned features.

---

## Key Integrations

### PMS (Property Management Systems)
- Routes: `backend/src/routes/pms.ts`, `pms-connectors.ts`
- Supports webhook ingestion (HMAC-verified) from Guesty and other PMS providers
- Prototype screens for PMS sync, import, and troubleshooting in `/prototype/pms*`

### AI / Agentic Features
- `backend/src/routes/ai.ts` — AI endpoints (pricing suggestions, listing generator, sentiment analysis)
- `backend/src/routes/agentic-mesh.ts` — Sovereign Agentic Mesh (agent registry, A2A handshake, guardrail checks, biometric settlement triggers)
- `backend/src/lib/complicore-orchestrator.ts` — Multi-service AI orchestration
- External AI services configured via env: `AGENTIC_RAG_SERVICE_URL`, `CORRECTIVE_RAG_SERVICE_URL`, etc.
- `AGENTS.md` — Defines the `LodgingOrchestrator-01` sub-agent manifesto (W3C DID identity, policy-as-code guardrails)

### Blockchain / Smart Contracts
- `contracts/ComplicoreInstantSettlement.sol` — Solidity (^0.8.24) Delivery-vs-Payment smart contract for instant travel booking settlement
- Integrates with compliance oracle for CSRD/Scope-3 checks
- Paired with the agentic mesh for biometric check-in triggered settlement

### Lifecycle Email Automation
- `backend/src/lib/lifecycle-email-automation.ts` / `lifecycle-email-sequences.ts`
- Runs as a background ticker (configurable via `LIFECYCLE_EMAIL_TICK_MS`)
- Handles trial expiry, onboarding sequences, and retention emails

---

## Monitoring & Observability

- **Prometheus** scrapes metrics from backend's `/metrics` endpoint (via `observability` plugin)
- **Grafana** dashboards provisioned from `monitoring/grafana/`
- **Alertmanager** sends Slack alerts (configure via `ALERTMANAGER_SLACK_WEBHOOK_URL`)
- **Alert rules** defined in `monitoring/alert_rules.yml`
- Backend logs are structured JSON via Fastify's pino logger; sensitive fields are redacted: `authorization`, `cookie`, `password`, `accessToken`, `refreshToken`, `token`

---

## Deployment

### Deployment Targets
- **Netlify**: Frontend (build: `npm run build`, publish: `.next`)
- **Render**: Backend (`cd backend && npm install && npm run build`, start: `npm run start`)
- **Vercel**: All-in-one option
- **Kubernetes**: Bridge manifests in `bridge/base/` (namespace, deployments, services, network policies)
- **Blue-Green**: `docker-compose.blue.yml` / `docker-compose.green.yml`

### Key Production Checklist
- Set `NODE_ENV=production`
- `ENABLE_DEMO_FALLBACK=false` (enforced by env validation)
- `PMS_WEBHOOK_SECRET` must be set
- `COOKIE_SECURE=true`, `COOKIE_SAME_SITE=none` for cross-site cookies
- `DB_SSL=true`, `DB_SSL_REJECT_UNAUTHORIZED=true`
- `JWT_SECRET` min 32 chars
- Configure `SECURITY_AUDIT_LOG_PATH` or `SECURITY_SIEM_EXPORT_URL`

---

## Additional Documentation

| File | Contents |
|---|---|
| `README.md` | Quick start, feature overview, local dev setup |
| `DEPLOYMENT.md` | Detailed deployment guide |
| `SECURITY_GUIDE.md` | Security hardening notes |
| `SECURITY_AUDIT.md` | Security audit report |
| `USER_GUIDE.md` | End-user documentation |
| `QUICK_START.md` | Fast setup guide |
| `PRODUCTION_READY.md` | Production readiness checklist |
| `MAINTENANCE_CHEAT_SHEET.md` | Operations reference |
| `PUBLIC_APIS.md` | External API integrations catalog |
| `AI_ENGINEERING_HUB_ROADMAP.md` | AI feature roadmap |
| `AGENTS.md` | Sub-agent manifesto (LodgingOrchestrator-01) |
| `specs/openapi.yaml` | OpenAPI 3.1 specification |
| `docs/` | Architecture documentation |
