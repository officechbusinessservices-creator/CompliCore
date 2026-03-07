# Changelog

All notable changes to CompliCore will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> For security vulnerability disclosures and audit history, see [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) and [SECURITY_AUDIT.md](./SECURITY_AUDIT.md).

## [Unreleased]

### Security

- Production-safe defaults for `DB_SSL` and `COOKIE_SECURE` environment variables to prevent accidental insecure deployments

### Fixed

- Redis client now uses the Zod-validated env schema instead of raw `process.env` references, ensuring consistent configuration at startup
- Type-safe Fastify upload handler — removed unsafe `as any` casts in multipart file handling

### Added

- Database-backed PMS provider persistence (replaces hardcoded demo data) for Guesty, Hostaway, Lodgify, Hostfully, and Beds24 connectors
- Frontend Vitest setup with React Testing Library and GitHub Actions CI workflow

### Changed

- Decomposed monolithic `src/app/page.tsx` into focused, independently testable landing section components

## [0.1.0] - 2026-03-07

### Added

#### Frontend

- Next.js 16 frontend with App Router, Tailwind CSS 3, and Framer Motion animations
- Role-specific portals: host, guest, cleaner, maintenance, and corporate travel views
- 50+ prototype screens covering analytics, calendar sync, smart pricing, AI features, and PMS management
- Dark mode support via `ThemeProvider` and Tailwind CSS `class` strategy
- NextAuth.js v4 Credentials provider for session management with HttpOnly cookies
- shadcn/ui component library as the UI primitive layer (`src/components/ui/`)
- Comprehensive security headers set in `next.config.js`: HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, CSP, COOP, CORP, Referrer-Policy, Permissions-Policy

#### Backend

- Fastify 5 REST API with dual-prefix route registration (`/v1` canonical, `/api` deprecated with `Deprecation` and `Sunset` headers)
- JWT authentication with short-lived access tokens (HttpOnly `cc_access` cookie) and long-lived refresh tokens (HttpOnly `cc_refresh` cookie)
- Argon2id password hashing (memoryCost: 19456, timeCost: 2) via `secure-user-model.ts`
- Role-based access control (RBAC) with `guest`, `host`, and `admin` roles using `fastify.requireRole` and `fastify.authenticate` decorators
- WebAuthn/passkey step-up MFA for host and admin sensitive actions (`webauthn-stepup.ts`)
- Field-level AES-256-GCM encryption for sensitive Prisma model fields with optional AWS KMS envelope key management (`encryption.ts`)
- HMAC-signed plan URLs with configurable TTL (`signed-url.ts`)
- JWT key rotation support via `JWT_PREVIOUS_SECRET` environment variable (`jwt-rotation.ts`)
- Account lockout after configurable failed-login threshold
- Honeytoken detection with alert triggering on access to configured sentinel resource IDs
- HMAC-chained security audit log in JSONL format with optional SIEM export for login failures, RBAC denials, step-up events, and impossible-travel alerts (`security-audit.ts`)
- Zod-validated environment schema with startup-time validation — server refuses to start on invalid config (`env.ts`)
- Idempotency plugin to prevent duplicate payment and booking operations
- Rate limiting, CORS, and Helmet security headers via `security-fortress` Fastify plugin
- Structured JSON logging via Pino with automatic redaction of `authorization`, `cookie`, `password`, `accessToken`, `refreshToken`, and `token` fields
- Prometheus metrics via `prom-client`: HTTP request counters, duration histograms, DB query tracking, and slow query detection (`metrics.ts`)
- Global RFC 9457 Problem Details error handler (`error-handler.ts`)

#### Data & Storage

- Prisma ORM with PostgreSQL 16+ — models: `User`, `Booking`, `Listing`, `Message`, `Payment`, `BillingPlan`, `Subscription`, `Payout`, `WebAuthnCredential`
- Redis-backed session caching and Socket.IO adapter via `ioredis` (`redis.ts`)
- Cloudinary image upload for user profile photos with 2 MB limit, JPEG/PNG type validation (`upload.ts`)

#### Integrations & Messaging

- PMS integration routes for Guesty, Hostaway, Lodgify, Hostfully, and Beds24 with HMAC-verified inbound webhooks
- Lifecycle email automation system with Nodemailer and SendGrid support — covers trial expiry, onboarding sequences, and retention emails
- Socket.IO realtime events with optional Redis pub/sub adapter for horizontal scaling
- AI/agentic endpoints: pricing suggestions, listing generator, sentiment analysis, and Sovereign Agentic Mesh with A2A handshake and guardrail checks (`agentic-mesh.ts`)
- MCP `connect-apps-plugin` for external PMS, OTA, payment, smart lock, accounting, and insurance integrations

#### Infrastructure & Deployment

- Docker Compose configurations for development, production, and blue/green deployments
- Netlify edge function support and `netlify.toml` configuration
- Render deployment configuration (`render.yaml`)
- Kubernetes manifests in `bridge/` (namespace, deployments, services, network policies)
- Prometheus + Grafana + Alertmanager monitoring stack with provisioned dashboards and alert rules
- OpenAPI 3.1 contract specification (`specs/openapi.yaml`) with validation and smoke-test scripts
- Agent/AI tooling integration configs for Claude Code, Cursor, Windsurf, Codex, Gemini, Roo, and Kiro

#### Documentation

- `README.md` — Quick start, feature overview, and local dev setup
- `DEV_SETUP.md` — Full local development environment guide
- `QUICK_START.md` — Fast setup guide
- `DEPLOYMENT.md` — Detailed deployment guide for Netlify, Render, Docker, and Kubernetes
- `SECURITY_GUIDE.md` — Security hardening notes and configuration reference
- `SECURITY_AUDIT.md` — Security audit report
- `USER_GUIDE.md` — End-user documentation
- `MAINTENANCE_CHEAT_SHEET.md` — Operations quick reference
- `PUBLIC_APIS.md` — External API integrations catalog
- `AI_ENGINEERING_HUB_ROADMAP.md` — AI feature roadmap

[Unreleased]: https://github.com/officechbusinessservices-creator/CompliCore/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/officechbusinessservices-creator/CompliCore/releases/tag/v0.1.0
