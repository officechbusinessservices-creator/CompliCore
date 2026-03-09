# Security & Compliance Framework

This document describes the security controls **actually implemented** in the codebase. References point to the relevant source files.

---

## Authentication

### Token Model

`backend/src/routes/auth.ts` + `@fastify/jwt`

- **Access token** — Short-lived JWT (default: 3600 s, configurable via `ACCESS_TOKEN_TTL_SECONDS`). Delivered as an `HttpOnly`, `SameSite=Lax` cookie named `cc_access` **and** in the JSON response body.
- **Refresh token** — Longer-lived JWT (default: 604800 s / 7 days, configurable via `REFRESH_TOKEN_TTL_SECONDS`). Delivered only as an `HttpOnly` cookie named `cc_refresh`.
- Tokens are signed with `JWT_SECRET` (minimum 32 characters, enforced at startup). A second key (`JWT_PREVIOUS_SECRET`) is supported during key rotation without invalidating existing sessions.
- In production `COOKIE_SECURE` is forced to `true` and `COOKIE_SAME_SITE` defaults to `"lax"`.

### Password Hashing

`backend/src/lib/secure-user-model.ts`

- Passwords are hashed with **argon2id** (`memoryCost: 19456`, `timeCost: 2`).

### Account Lockout

Configurable via environment variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `AUTH_MAX_FAILED_ATTEMPTS` | `5` | Failed logins before lockout |
| `AUTH_LOCKOUT_WINDOW_SECONDS` | `900` | Rolling window for counting failures |
| `AUTH_LOCKOUT_DURATION_SECONDS` | `900` | Duration of lockout |

### Password Reset

Time-limited single-use tokens are generated for password reset. Token delivery and validation are handled in `backend/src/routes/auth.ts`.

---

## Multi-Factor Authentication (WebAuthn Step-Up)

`backend/src/lib/webauthn-stepup.ts` + `@simplewebauthn/server`

WebAuthn credential registration and authentication are exposed via `/v1/auth/webauthn/*` routes. Host and admin roles require a step-up verification (configurable TTL: `MFA_STEP_UP_TTL_SECONDS`, default 900 s) before accessing sensitive operations.

Configuration:

| Variable | Default |
|----------|---------|
| `WEBAUTHN_MFA_ENABLED` | `true` |
| `WEBAUTHN_RP_NAME` | — |
| `WEBAUTHN_RP_ID` | — |
| `WEBAUTHN_ALLOWED_ORIGINS` | — |
| `WEBAUTHN_CHALLENGE_TTL_SECONDS` | `300` |

---

## Role-Based Access Control (RBAC)

`backend/src/server.ts` (decorator registration) + `backend/src/routes/*`

Three roles are assigned server-side at registration: `guest`, `host`, `admin`. Roles are encoded in the JWT payload and verified by the `requireRole` decorator.

Fastify decorators:

| Decorator | Behaviour |
|-----------|-----------|
| `fastify.authenticate` | Verifies the JWT; rejects with `401` if missing or expired |
| `fastify.requireRole(roles)` | Verifies JWT, checks `roles` array, and enforces step-up MFA for `host` / `admin` |
| `fastify.requireStepUp` | Asserts a completed WebAuthn step-up within `MFA_STEP_UP_TTL_SECONDS` |

Frontend components use a utility in `src/lib/rbac.ts` (tested in `src/test/lib/rbac.test.ts`) to make role-based rendering decisions.

---

## Input Validation

`backend/src/routes/*` + Zod

Every request body and query parameter is validated with a **Zod** schema at the route level before any business logic runs. Validation errors are returned as RFC 9457 Problem Details (`400 Bad Request`).

All environment variables are validated at startup by `backend/src/lib/env.ts` (also Zod). The server refuses to start if any required variable is missing or invalid.

---

## Security Headers

`backend/src/plugins/security-fortress.ts` (Fastify Helmet) and `next.config.js` (Next.js headers).

Headers set on every response:

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `origin-when-cross-origin` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; …` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `X-DNS-Prefetch-Control` | `on` |
| `X-Powered-By` | Removed |

---

## Rate Limiting

`backend/src/plugins/security-fortress.ts` + `@fastify/rate-limit`

| Variable | Default | Description |
|----------|---------|-------------|
| `RATE_LIMIT_MAX` | `120` | Max requests per window |
| `RATE_LIMIT_WINDOW` | `"1 minute"` | Time window |
| `RATE_LIMIT_ALLOWLIST` | — | Comma-separated IPs exempt from limits |

Exceeding the limit returns `429 Too Many Requests`.

---

## CORS

`backend/src/plugins/security-fortress.ts`

Only origins listed in `ALLOWED_ORIGINS` (comma-separated) are permitted. In development a permissive default may apply; in production, `ALLOWED_ORIGINS` must be explicitly set.

---

## Field-Level Encryption

`backend/src/lib/encryption.ts`

Sensitive booking fields (`access_code`, `wifi_name`, `wifi_password`) are encrypted at rest using **AES-256-GCM**. The encryption key is provided via:

- `FIELD_ENCRYPTION_KEY` — raw base64 key, **or**
- `FIELD_ENCRYPTION_KEY_ENCRYPTED_B64` + `KMS_REGION` — AWS KMS-wrapped key (the server calls KMS to decrypt at startup).

When neither variable is set the fields are stored unencrypted (development only).

---

## Idempotency

`backend/src/plugins/idempotency.ts`

POST requests that include an `Idempotency-Key` header are deduplicated. Responses are cached in Redis (with in-memory fallback) for a configurable TTL. This prevents duplicate payments and bookings caused by retried requests.
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

`backend/src/lib/security-audit.ts`

The following events are written to a structured JSONL log (path: `SECURITY_AUDIT_LOG_PATH`) and optionally exported to a SIEM endpoint (`SECURITY_SIEM_EXPORT_URL`):

- Failed login attempts
- RBAC denials
- Step-up MFA events
- Impossible travel detection (configurable window: `LOGIN_IMPOSSIBLE_TRAVEL_WINDOW_SECONDS`)

Alert thresholds:

| Variable | Default |
|----------|---------|
| `SECURITY_ALERT_FAILED_LOGIN_THRESHOLD` | `8` |
| `SECURITY_ALERT_RBAC_DENY_THRESHOLD` | `20` |
| `SECURITY_ALERT_WINDOW_SECONDS` | `600` |

---

## PMS Webhook Verification

`backend/src/routes/pms-connectors.ts`

All inbound PMS webhooks (Guesty, Hostaway, Beds24) must carry a valid HMAC-SHA256 signature verified against `PMS_WEBHOOK_SECRET`. Requests with invalid or missing signatures are rejected with `401`.

---

## Honeytoken Detection

`backend/src/lib/env.ts` / security audit

`HONEYTOKEN_IDS` (comma-separated) can be configured. Any request that references a honeytoken ID triggers an alert in the security audit log.

---

## Signed URLs

`backend/src/lib/signed-url.ts`

Time-limited signed URLs are generated for sensitive resource access. TTL is configured via `SIGNED_URL_TTL_SECONDS` (default: 60 s).

---

## Sensitive Field Logging Redaction

Fastify's pino logger is configured to redact the following fields from all log output: `authorization`, `cookie`, `password`, `accessToken`, `refreshToken`, `token`.

---

## Environment Variable Constraints

The following rules are enforced at startup by the Zod schema in `backend/src/lib/env.ts`:

- `JWT_SECRET` — minimum 32 characters.
- `ENABLE_DEMO_FALLBACK` — forced to `false` in `NODE_ENV=production`.
- `COOKIE_SECURE` — forced to `true` in `NODE_ENV=production`.
- `DB_SSL` — defaults to `true` in production.
- `STRIPE_WEBHOOK_SECRET` — required in production.
- `PMS_WEBHOOK_SECRET` — required in production.

The server will not start if any required variable is absent or fails validation.
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
