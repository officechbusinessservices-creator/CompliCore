# Security & Compliance Framework

This document describes the security controls **actually implemented** in the CompliCore codebase.

---

## Authentication

### Token model

The backend issues two JWTs on login, both set as `HttpOnly`, `Secure` cookies:

| Cookie | Name | Default TTL | Purpose |
|--------|------|-------------|---------|
| Access token | `cc_access` | 1 hour | Sent with every authenticated request |
| Refresh token | `cc_refresh` | 7 days | Used by `POST /v1/auth/refresh` to obtain a new access token |

Tokens are also returned in the response body so the frontend can optionally use them with `Authorization: Bearer <token>`.

**Implementation:** `backend/src/lib/jwt-rotation.ts` and `backend/src/server.ts` (decorator `fastify.authenticate`).

### Key rotation

`JWT_SECRET` signs new tokens. When rotating keys, set `JWT_PREVIOUS_SECRET` to the old value — the backend accepts tokens signed by either secret during the transition period.

### Password hashing

Passwords are hashed with **argon2id** (`memoryCost: 19456`, `timeCost: 2`) via the `backend/src/lib/secure-user-model.ts` utility.

### Account lockout

Configurable failed-login threshold and lockout duration are enforced before tokens are issued. Settings are controlled via environment variables validated in `backend/src/lib/env.ts`.

### Password reset

`POST /v1/auth/forgot-password` issues a one-time reset token (stored as a hash). `POST /v1/auth/reset-password/:token` verifies the token expiry and hash before allowing the change.

---

## WebAuthn Step-up MFA

Host and admin routes require WebAuthn step-up verification in addition to a valid JWT. The flow:

1. Client calls `POST /v1/auth/mfa/webauthn/auth/options` to receive a challenge.
2. Client signs the challenge with a registered authenticator.
3. Client sends the assertion to `POST /v1/auth/mfa/webauthn/auth/verify`.
4. On success the backend embeds `stepUpVerifiedAt` in the JWT.
5. `fastify.requireStepUp` decorator checks that `stepUpVerifiedAt` is present and recent enough.

Credentials are stored in the `WebAuthnCredential` Prisma model, linked to `User`.

**Implementation:** `backend/src/lib/webauthn-stepup.ts`, `backend/src/routes/auth.ts`.

---

## RBAC — Role-based Access Control

Roles are assigned server-side and stored in `User.roles[]`. The frontend never supplies or modifies roles.

Available roles: `guest`, `host`, `admin`.

### Fastify decorators

| Decorator | Effect |
|-----------|--------|
| `fastify.authenticate` | Verifies the JWT; rejects with 401 if absent or invalid. |
| `fastify.requireRole(roles)` | Calls `authenticate`, then checks that the user holds at least one of the listed roles; additionally enforces step-up MFA for `host` and `admin` routes. |
| `fastify.requireStepUp` | Verifies that WebAuthn step-up was completed in the current session. |

**Implementation:** `backend/src/server.ts` (lines 94–170).

---

## Rate Limiting

Global rate limiting is applied to every route via `@fastify/rate-limit`:

| Setting | Environment variable | Default |
|---------|----------------------|---------|
| Max requests per window | `RATE_LIMIT_MAX` | Configured in `env.ts` |
| Time window | `RATE_LIMIT_WINDOW` | Configured in `env.ts` |
| IP allowlist | `RATE_LIMIT_ALLOWLIST` | Empty (comma-separated) |

Per-route overrides (stricter limits) are set in individual route handlers:

| Route | Limit |
|-------|-------|
| `POST /auth/register` | 20/min |
| `POST /auth/login` | 12/min |
| `POST /auth/forgot-password` | 8/min |
| WebAuthn register | 20/min |
| WebAuthn authenticate | 30/min |
| `GET /messages` (export) | 50/min |

**Implementation:** `backend/src/plugins/security-fortress.ts`.

---

## CORS

CORS is configured via `@fastify/cors`:

- Allowed origins: comma-separated list in `ALLOWED_ORIGINS` (falls back to permissive if empty).
- Allowed methods: comma-separated list in `ALLOWED_METHODS`.
- `credentials: true` to support HttpOnly cookie flow.

---

## Security Headers

### Backend (Fastify)

Helmet (`@fastify/helmet`) applies a standard set of security headers to all API responses (`hidePoweredBy: true`; custom CSP is disabled at the plugin level — headers are set per-route or via proxy).

### Frontend (Next.js)

`next.config.js` applies the following headers to **every** frontend route:

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; …` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `X-DNS-Prefetch-Control` | `on` |

---

## Input Validation

All request bodies are validated with **Zod** schemas at the route boundary before any business logic executes. Validation errors are returned as RFC 9457 Problem Details:

```json
{
  "type": "urn:problem:validation",
  "title": "Request validation failed",
  "status": 400,
  "errors": [...]
}
```

**Implementation:** `backend/src/lib/validation.ts`, individual route files.

---

## Field-level Encryption

Sensitive database fields (e.g. `Booking.access_code`, WiFi credentials) are encrypted at rest using **AES-256-GCM**. An optional AWS KMS integration is available for key-wrapping.

| Environment variable | Purpose |
|----------------------|---------|
| `FIELD_ENCRYPTION_KEY` | Base64-encoded 256-bit AES key |
| `KMS_REGION` | AWS region for KMS (required when using KMS-backed key) |

**Implementation:** `backend/src/lib/encryption.ts`.

---

## Security Audit Logging

Security events are written to a JSONL file and optionally forwarded to a SIEM:

| Event type | Logged when |
|------------|-------------|
| Login failure | Bad credentials or account locked |
| RBAC denial | `requireRole` or `requireStepUp` rejects a request |
| Step-up events | MFA challenge issued or verified |
| Impossible travel | Login from a geographically inconsistent IP |

| Environment variable | Purpose |
|----------------------|---------|
| `SECURITY_AUDIT_LOG_PATH` | File path for JSONL audit log |
| `SECURITY_SIEM_EXPORT_URL` | HTTP endpoint for SIEM forwarding |

**Implementation:** `backend/src/lib/security-audit.ts`.

---

## PMS Webhook Signature Validation

Inbound PMS webhook payloads are verified using **HMAC-SHA256** before processing. The shared secret is set via `PMS_WEBHOOK_SECRET` (required in production; validated at startup).

**Implementation:** `backend/src/routes/pms-connectors.ts`.

---

## Idempotency

The `idempotency` plugin (`backend/src/plugins/idempotency.ts`) tracks request keys to prevent duplicate payment or booking operations.

---

## Environment Variable Validation

All environment variables are validated with **Zod** at server startup (`backend/src/lib/env.ts`). The server refuses to start if required variables are absent or fail type/format checks.

Key required variables:

| Variable | Constraint |
|----------|-----------|
| `DATABASE_URL` | Must be a valid connection string |
| `JWT_SECRET` | Minimum 32 characters |
| `PMS_WEBHOOK_SECRET` | Required in production |
| `ENABLE_DEMO_FALLBACK` | Must be `false` in production |

---

## Demo / Development Mode

When `ENABLE_DEMO_FALLBACK=true`, the backend uses an in-memory user store instead of the Prisma/PostgreSQL user model. **This mode is forbidden in production** and is enforced by the Zod env validator.
