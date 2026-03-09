# API Endpoints

All routes are registered under **two prefixes**:

- `/v1/...` — current, preferred
- `/api/...` — deprecated; responses include `Deprecation: true` and `Sunset: Wed, 31 Dec 2026 23:59:59 GMT` headers

Use `/v1` for all new integrations.

---

## Authentication (`/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/register` | No | Register a new user. Rate-limited (20/min). |
| `POST` | `/auth/login` | No | Authenticate and receive access + refresh tokens as HttpOnly cookies. Rate-limited (12/min). |
| `POST` | `/auth/refresh` | No | Exchange a valid refresh-token cookie for a new access token. |
| `POST` | `/auth/logout` | No | Clear auth cookies. |
| `GET`  | `/auth/me` | Yes | Return the authenticated user's profile. |
| `POST` | `/auth/forgot-password` | No | Send a password-reset email. Rate-limited (8/min). |
| `POST` | `/auth/reset-password/:token` | No | Reset password using a one-time token. |
| `GET`  | `/auth/mfa/step-up/status` | Yes | Check whether the current session has satisfied WebAuthn step-up. |
| `POST` | `/auth/mfa/webauthn/register/options` | Yes | Begin WebAuthn credential registration (returns `PublicKeyCredentialCreationOptions`). Rate-limited (20/min). |
| `POST` | `/auth/mfa/webauthn/register/verify` | Yes | Complete WebAuthn credential registration. Rate-limited (20/min). |
| `POST` | `/auth/mfa/webauthn/auth/options` | Yes | Begin WebAuthn assertion (returns `PublicKeyCredentialRequestOptions`). Rate-limited (30/min). |
| `POST` | `/auth/mfa/webauthn/auth/verify` | Yes | Complete WebAuthn assertion and satisfy step-up. Rate-limited (30/min). |
| `GET`  | `/auth/admin/ping` | Yes (`admin`) | Admin liveness check. |

**Request / Response Notes**

- `POST /auth/register` body: `{ email, password, firstName?, lastName? }`
- `POST /auth/login` body: `{ email, password }`; sets `cc_access` and `cc_refresh` HttpOnly cookies; also returns `{ accessToken }` in body.
- All protected routes must include the `cc_access` cookie or an `Authorization: Bearer <token>` header.

---

## Users (`/users`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`   | `/users/me`   | Yes | Return the authenticated user's profile. |
| `PATCH` | `/users/me`   | Yes | Update profile (name, optional photo upload via `multipart/form-data`). |

---

## Bookings (`/bookings`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`   | `/bookings`                      | Yes (`guest`/`host`/`admin`) | List bookings. Hosts see all bookings; guests see their own. |
| `POST`  | `/bookings`                      | No  | Create a new booking. Body: `{ guest_name, listing_id, check_in, check_out, property? }`. |
| `GET`   | `/bookings/:bookingId`           | Yes | Retrieve a single booking by ID. |
| `PATCH` | `/bookings/:bookingId/status`    | Yes | Update booking status (`pending`/`confirmed`/`cancelled`). |
| `POST`  | `/bookings/:bookingId/cancel`    | Yes | Cancel a booking. |
| `GET`   | `/bookings/:bookingId/access`    | Yes (`host`/`admin`) | Retrieve access credentials (access code, WiFi name/password) for a booking. |

---

## Listings (`/listings`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`    | `/listings`                  | Yes (`host`/`admin`) | List the authenticated host's listings. |
| `POST`   | `/listings`                  | Yes (`host`/`admin`) | Create a new listing. Body: `{ title, address?, price_per_night? }`. |
| `GET`    | `/listings/:listingId`       | Yes | Retrieve a single listing. |
| `PATCH`  | `/listings/:listingId`       | Yes | Update listing fields. |
| `DELETE` | `/listings/:listingId`       | Yes | Delete a listing. |
| `POST`   | `/listings/:listingId/photo` | Yes (`host`/`admin`) | Upload a listing photo (`multipart/form-data`). Stored via Cloudinary. |

---

## Properties (`/properties`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`    | `/properties`                            | No  | List properties (falls back to demo data when demo mode is enabled). |
| `POST`   | `/properties`                            | Yes (`host`/`admin`) | Create a property. |
| `GET`    | `/properties/:propertyId`                | No  | Retrieve a single property. |
| `PATCH`  | `/properties/:propertyId`                | Yes | Update a property. |
| `DELETE` | `/properties/:propertyId`                | Yes | Delete a property. |
| `GET`    | `/properties/:propertyId/availability`   | No  | Retrieve availability calendar. |
| `PATCH`  | `/properties/:propertyId/availability`   | Yes | Update availability. |
| `GET`    | `/properties/:propertyId/pricing`        | No  | Retrieve pricing rules. |
| `POST`   | `/properties/:propertyId/quote`          | No  | Generate a price quote for given dates. |

---

## Payments (`/payments`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/payments/checkout` | Yes | Create a Stripe `PaymentIntent`. Body: `{ bookingId, amount, currency }`. Returns `{ clientSecret }`. |

> **Note:** Additional billing-plan and subscription endpoints exist in `payments.ts`; this list covers the primary checkout flow. The full file is ~23 KB.

---

## Messages (`/messages`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/messages`                       | Yes | List the most recent 50 messages. Rate-limited (50/min for export). |
| `POST` | `/messages`                       | Yes | Create a message. Body: `{ booking_id, body }`. |
| `GET`  | `/messages/threads`               | Yes | List message threads, grouped by booking. |
| `GET`  | `/messages/threads/:threadId`     | Yes | Retrieve all messages in a thread. |
| `POST` | `/messages/send`                  | Yes | Alias for creating a message in a thread. |

---

## Reviews (`/reviews`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/reviews`                              | Yes (`guest`/`host`/`admin`) | Submit a review. Body: `{ booking_id, rating, body }`. |
| `GET`  | `/properties/:propertyId/reviews`      | Yes (`host`/`admin`) | Retrieve reviews for a property. |

---

## Analytics (`/analytics`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/analytics/dashboard` | Yes (`host`/`admin`/`enterprise`/`corporate`) | Return aggregated occupancy, revenue, and booking metrics. |

---

## AI (`/ai`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/ai/pricing/suggestions`  | Yes | Return AI-generated dynamic pricing suggestions for a listing. Query param: `listingId`. |
| `POST` | `/ai/listing/optimize`     | Yes | Optimize listing copy via AI. Body: `{ listingId }`. |
| `POST` | `/ai/orchestrate`          | Yes | Route a request to a configured AI back-end (RAG, OCR, audio, finance, reasoning, etc.). Body: `{ type, payload }`. |

---

## PMS Integration (`/pms`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/pms/providers`                        | Yes | List supported PMS providers (Guesty, Hostaway, Lodgify, Hostfully, Beds24). |
| `POST` | `/pms/connect`                          | Yes | Connect to a PMS provider. Body: `{ provider, apiKey }`. |
| `POST` | `/pms/sync`                             | Yes | Trigger a full sync with the connected PMS. |
| `GET`  | `/pms/status`                           | Yes | Return the current PMS connection and sync status. |
| `GET`  | `/pms/history`                          | Yes | Return sync history log entries. |
| `POST` | `/pms/import`                           | Yes | Import listings/bookings from the connected PMS. |
| `GET`  | `/pms/connectors`                       | Yes | List available direct connectors (Guesty, Hostaway, Beds24). |
| `POST` | `/pms/connectors/:providerId/connect`   | Yes | Authenticate with a specific PMS connector. |
| `POST` | `/pms/connectors/:providerId/webhook`   | No  | Inbound PMS webhook (HMAC-signature validated via `PMS_WEBHOOK_SECRET`). |
| `POST` | `/pms/connectors/:providerId/sync`      | Yes | Trigger a manual sync for a specific connector. |

---

## Modules & Add-ons (`/modules`, `/channels`, etc.)

These endpoints return structured data for optional platform modules. All require authentication.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/modules/overview`     | Module enablement status |
| `GET` | `/channels`             | Connected OTA channels |
| `GET` | `/cleaning/tasks`       | Cleaning task queue |
| `GET` | `/maintenance/tasks`    | Maintenance task queue |
| `GET` | `/pricing/seasonal`     | Seasonal pricing rules |
| `GET` | `/taxes/reports`        | Tax report data |
| `GET` | `/loyalty`              | Guest loyalty programme status |
| `GET` | `/sustainability`       | Sustainability / carbon metrics |
| `GET` | `/tickets`              | Support tickets |
| `GET` | `/insurance/policies`   | Insurance policy records |
| `GET` | `/forecasting`          | Revenue forecast data |
| `GET` | `/benchmarks`           | Industry benchmark comparisons |
| `GET` | `/occupancy`            | Occupancy metrics |
| `GET` | `/calendar-sync`        | Calendar sync status |
| `GET` | `/map/properties`       | Property map data |
| `GET` | `/compare`              | Property comparison |
| `GET` | `/wishlist`             | Guest wishlists |
| `GET` | `/bundles`              | Property bundle definitions |
| `GET` | `/marketplace`          | Marketplace add-on catalogue |
| `GET` | `/integrations`         | Available OTA, pricing, IoT, and ops integrations |

---

## Lifecycle Emails (`/lifecycle`)

All lifecycle-email endpoints require the `admin` role.

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/lifecycle/emails/sequences`  | List configured email sequences (`trial_welcome`, `trial_win_back`). |
| `GET`  | `/lifecycle/emails/enrollments`| List current subscriber enrolments. |
| `POST` | `/lifecycle/emails/preview`    | Preview a single step in a sequence. Body: `{ sequenceId, stepIndex }`. |
| `POST` | `/lifecycle/emails/send-test`  | Send a test email for a given step. Body: `{ sequenceId, stepIndex, to }`. |
| `POST` | `/lifecycle/emails/enroll`     | Enrol a user in a trial sequence. Body: `{ userId, sequenceId }`. |
| `POST` | `/lifecycle/emails/run`        | Manually trigger the scheduler tick (for debugging). |

---

> **Note:** This list covers the primary REST endpoints discovered in `backend/src/routes/`. The `economic.ts` and `agentic-mesh.ts` route files contain additional experimental/internal endpoints that are not documented here.
