# API Endpoints

All routes are registered under two prefixes:

- `/v1/...` — canonical (preferred)
- `/api/...` — deprecated (carries `Deprecation: true` and `Sunset: Wed, 31 Dec 2026 23:59:59 GMT` headers)

Always use the `/v1` prefix in new code.

> **Note:** This list covers the routes found in `backend/src/routes/`. It is non-exhaustive — module-overview and economic/agentic-mesh routes are summarised separately at the end.

---

## Authentication — `/v1/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/auth/register` | No | Register a new user. Body: `{ email, password, firstName, lastName }`. Returns `{ accessToken, user }` and sets `cc_access` / `cc_refresh` cookies. |
| `POST` | `/v1/auth/login` | No | Authenticate with email + password. Body: `{ email, password }`. Returns `{ accessToken, user }` and sets cookies. |
| `POST` | `/v1/auth/refresh` | No (cookie) | Exchange a valid `cc_refresh` cookie for a new access token. |
| `POST` | `/v1/auth/logout` | Yes | Clear `cc_access` and `cc_refresh` cookies. |
| `GET`  | `/v1/auth/me` | Yes | Return the currently authenticated user's profile. |
| `GET`  | `/v1/auth/mfa/step-up/status` | Yes | Check whether step-up MFA has been satisfied for the current session. |
| `POST` | `/v1/auth/webauthn/register-start` | Yes | Begin WebAuthn credential registration (returns challenge options). |
| `POST` | `/v1/auth/webauthn/register-verify` | Yes | Verify and store a new WebAuthn credential. |
| `POST` | `/v1/auth/webauthn/authenticate-start` | Yes | Begin WebAuthn authentication (returns challenge options). |
| `POST` | `/v1/auth/webauthn/authenticate-verify` | Yes | Verify WebAuthn assertion and satisfy step-up requirement. |
| `POST` | `/v1/auth/forgot-password` | No | Send a password-reset email. Body: `{ email }`. |
| `GET`  | `/v1/auth/reset-password/:token` | No | Validate a password-reset token. |
| `POST` | `/v1/auth/reset-password/:token` | No | Apply a new password. Body: `{ password }`. |

---

## Users — `/v1/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/v1/users/me` | Yes | Return the authenticated user's full profile. |
| `PATCH` | `/v1/users/me` | Yes | Update the authenticated user's profile. Body fields are optional (e.g., `firstName`, `lastName`). |

---

## Listings — `/v1/listings`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/v1/listings` | No | List all listings. |
| `GET`  | `/v1/listings/:listingId` | No | Get a single listing by ID. |
| `POST` | `/v1/listings` | Yes (host) | Create a new listing. Body: `{ title, address, price_per_night, ... }`. |
| `PATCH` | `/v1/listings/:listingId` | Yes (host) | Update an existing listing. |
| `DELETE` | `/v1/listings/:listingId` | Yes (host) | Delete a listing. |
| `POST` | `/v1/listings/:listingId/photo` | Yes (host) | Upload a listing photo (multipart). |

---

## Properties — `/v1/properties`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/v1/properties` | Yes | List properties owned by the authenticated host. |
| `POST` | `/v1/properties` | Yes (host) | Create a property. |
| `GET`  | `/v1/properties/:propertyId` | Yes | Get a single property. |
| `PATCH` | `/v1/properties/:propertyId` | Yes (host) | Update a property. |
| `DELETE` | `/v1/properties/:propertyId` | Yes (host) | Delete a property. |
| `GET`  | `/v1/properties/:propertyId/availability` | Yes | Get availability calendar for a property. |
| `PATCH` | `/v1/properties/:propertyId/availability` | Yes (host) | Update availability blocks for a property. |
| `GET`  | `/v1/properties/:propertyId/pricing` | Yes | Get pricing configuration for a property. |
| `POST` | `/v1/properties/:propertyId/quote` | No | Generate a price quote. Body: `{ check_in, check_out, guests }`. |

---

## Bookings — `/v1/bookings`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/v1/bookings` | Yes | List bookings for the authenticated user. |
| `GET`  | `/v1/bookings/:bookingId` | Yes | Get a single booking. |
| `GET`  | `/v1/bookings/:bookingId/access` | Yes | Retrieve access credentials (access code, WiFi) for a booking. |
| `POST` | `/v1/bookings` | Yes | Create a booking. Body: `{ confirmation_code, listing_id, guest_name, property, check_in, check_out }`. |
| `PATCH` | `/v1/bookings/:bookingId/status` | Yes | Update booking status. Body: `{ status }`. |
| `POST` | `/v1/bookings/:bookingId/cancel` | Yes | Cancel a booking. |

---

## Messages — `/v1/messages`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/v1/messages` | Yes | List messages for the authenticated user. |
| `POST` | `/v1/messages` | Yes | Post a message. Body: `{ booking_id, body }`. |
| `GET`  | `/v1/messages/threads` | Yes | List message threads. |
| `GET`  | `/v1/messages/threads/:threadId` | Yes | Get all messages in a thread. |
| `POST` | `/v1/messages/send` | Yes | Send a message in a thread. Body: `{ threadId, body }`. |

---

## Reviews — `/v1/reviews`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/reviews` | Yes | Submit a review. Body: `{ booking_id, rating, comment }`. |
| `GET`  | `/v1/properties/:propertyId/reviews` | No | List reviews for a property. |

---

## Payments & Billing — `/v1/payments`, `/v1/billing`, `/v1/payouts`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/payments/checkout` | Yes | Create a checkout session. Body: `{ booking_id, amount, currency }`. |
| `POST` | `/v1/payments/create` | Yes | Create a payment record. |
| `POST` | `/v1/payments/checkout-session` | Yes | Create a Stripe checkout session. |
| `GET`  | `/v1/payments/methods` | Yes | List saved payment methods for the authenticated user. |
| `GET`  | `/v1/payouts` | Yes (host) | List payouts for the authenticated host. |
| `GET`  | `/v1/billing/plans` | No | List available billing plans. |
| `POST` | `/v1/billing/subscribe` | Yes | Subscribe to a billing plan. Body: `{ planCode }`. |
| `POST` | `/v1/billing/cancel` | Yes | Cancel the current subscription. |
| `GET`  | `/v1/billing/subscriptions` | Yes | Get the authenticated user's active subscription. |

---

## Analytics — `/v1/analytics`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/v1/analytics/dashboard` | Yes (host) | Return dashboard KPIs: occupancy rate, revenue, booking counts, and trend data. |

---

## AI — `/v1/ai`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/v1/ai/pricing/suggestions` | Yes | Get AI-generated pricing suggestions. Query params: `listingId`, `date`. |
| `POST` | `/v1/ai/listing/optimize` | Yes | Optimise a listing's title and description. Body: `{ listingId }`. |
| `POST` | `/v1/ai/orchestrate` | Yes | Invoke the CompliCore multi-service AI orchestrator. Body: `{ task, context }`. |

---

## PMS (Property Management System) — `/v1/pms`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/v1/pms/providers` | Yes (host) | List supported PMS providers (Guesty, Hostaway, Beds24). |
| `POST` | `/v1/pms/connect` | Yes (host) | Connect a PMS provider. Body: `{ provider, credentials }`. |
| `POST` | `/v1/pms/sync` | Yes (host) | Trigger a manual sync from the connected PMS. |
| `GET`  | `/v1/pms/status` | Yes (host) | Get the current sync status. |
| `GET`  | `/v1/pms/history` | Yes (host) | Get sync history. |
| `POST` | `/v1/pms/import` | Yes (host) | Import listings/bookings from the connected PMS. |

PMS webhook ingestion (HMAC-verified) is handled by `backend/src/routes/pms-connectors.ts` and supports Guesty, Hostaway, and Beds24.

---

## Lifecycle Email — `/v1/lifecycle`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/v1/lifecycle/emails/sequences` | Yes (admin) | List configured email sequences. |
| `GET`  | `/v1/lifecycle/emails/enrollments` | Yes (admin) | List user enrollments in email sequences. |
| `POST` | `/v1/lifecycle/emails/preview` | Yes (admin) | Preview a rendered email template. Body: `{ sequenceId, stepIndex }`. |
| `POST` | `/v1/lifecycle/emails/send-test` | Yes (admin) | Send a test email. Body: `{ sequenceId, stepIndex, to }`. |
| `POST` | `/v1/lifecycle/emails/enroll` | Yes (admin) | Enroll a user in an email sequence. Body: `{ userId, sequenceId }`. |

---

## Modules Overview — `/v1/modules`, `/v1/channels`, and others

`backend/src/routes/modules.ts` exposes read-only module overview endpoints used by the prototype UI. These return static or mock data for features that are partially implemented or in development:

`GET /v1/modules/overview`, `GET /v1/channels`, `GET /v1/cleaning/tasks`, `GET /v1/maintenance/tasks`, `GET /v1/pricing/seasonal`, `GET /v1/taxes/reports`, `GET /v1/loyalty`, `GET /v1/sustainability`, `GET /v1/tickets`, `GET /v1/insurance/policies`, `GET /v1/forecasting`, `GET /v1/benchmarks`, `GET /v1/occupancy`, `GET /v1/calendar-sync`, `GET /v1/map/properties`, `GET /v1/compare`, `GET /v1/wishlist`, `GET /v1/bundles`, `GET /v1/marketplace`, `GET /v1/integrations`.

---

## Error Responses

All errors follow RFC 9457 Problem Details:

```json
{
  "type": "urn:problem:validation",
  "title": "Request validation failed",
  "status": 400,
  "detail": "email: Invalid email address",
  "errors": [...]
}
```

Common status codes: `400` validation, `401` unauthenticated, `403` forbidden / insufficient role, `404` not found, `409` conflict, `429` rate limited, `500` server error.
