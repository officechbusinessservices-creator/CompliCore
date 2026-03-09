# Performance Optimization Guide

This document describes performance features and configurations **present in the codebase**. Recommendations are grounded in the actual stack (Next.js frontend, Fastify + Prisma backend, PostgreSQL).

---

## Database Indexes (Prisma Schema)

`backend/prisma/schema.prisma` defines the following indexes:

| Model | Index | Type | Rationale |
|-------|-------|------|-----------|
| `User` | `email` | Single-column | Fast lookup during login and uniqueness checks |
| `WebAuthnCredential` | `userId` | Single-column | Retrieve all credentials for a user during WebAuthn flows |
| `Booking` | `(status, created_at)` | Composite | Filter bookings by status ordered by recency (e.g., active bookings dashboard) |
| `Booking` | `user_id` | Single-column | Fetch all bookings for a specific user |
| `Listing` | `host_id` | Single-column | Fetch all listings owned by a host |

The `Payment` model has a unique constraint on `stripe_payment_intent_id`, which doubles as an index and prevents duplicate payment records.

### Recommendations

- **`Message` table:** `booking_id` is queried on every thread fetch. Add `@@index([booking_id])` if the messages table grows large.
- **`Subscription` table:** `user_id` is queried to find active subscriptions. Add `@@index([user_id])` if the table scales.
- **`Payout` table:** `host_id` is likely the primary filter. Add `@@index([host_id])` for host payout history queries.

Run `npx prisma migrate dev --name add_missing_indexes` after adding indexes to the schema.

---

## Database Connection Pool

Configured via environment variables validated in `backend/src/lib/env.ts`:

| Variable | Default | Notes |
|----------|---------|-------|
| `DB_POOL_MAX` | `20` | Maximum concurrent database connections |
| `DB_IDLE_TIMEOUT_MS` | `30000` | Close idle connections after 30 s |
| `DB_CONNECT_TIMEOUT_MS` | `5000` | Fail fast on connection errors |
| `DB_SLOW_QUERY_THRESHOLD_MS` | `100` | Queries exceeding this threshold are logged as slow |

Tune `DB_POOL_MAX` to match the number of available PostgreSQL connections (typically `max_connections - reserved`).

---

## Next.js Optimizations

Configured in `next.config.js`.

### React Strict Mode

```js
reactStrictMode: true
```

Enables double-rendering in development to surface side-effect bugs early. No production overhead.

### Gzip Compression

```js
compress: true
```

Next.js compresses HTTP responses with gzip. Offload to a CDN or reverse proxy (Cloudflare, nginx) in high-traffic production environments for better throughput.

### Image Optimization

Next.js `<Image>` component is configured with:

- **Formats:** AVIF (preferred), WebP fallback.
- **Device sizes:** 640, 750, 828, 1080, 1200, 1920, 2048, 3840 px.
- **Image sizes:** 16, 32, 48, 64, 96, 128, 256, 384 px.
- **Remote patterns:** `source.unsplash.com`, `images.unsplash.com`, `ext.same-assets.com`, `ugc.same-assets.com`.

Using `<Image>` (rather than `<img>`) ensures lazy loading, automatic format negotiation, and correctly sized `srcset` attributes.

### Bundle Analysis

Set `ANALYZE=true` before building to generate a visual bundle size report:

```bash
ANALYZE=true npm run build
```

This uses `@next/bundle-analyzer`. Use the output to identify large dependencies that can be replaced with lighter alternatives or code-split.

### Removed `X-Powered-By` Header

```js
poweredByHeader: false
```

Reduces response size slightly and avoids advertising the framework version.

---

## Caching

### Idempotency Cache (Backend)

`backend/src/plugins/idempotency.ts` caches POST responses keyed by `Idempotency-Key`. Redis is used when `REDIS_URL` is configured; an in-memory map is the fallback. This primarily prevents duplicate writes but also eliminates redundant processing for retried requests.

### Static Asset Caching (Next.js)

Next.js automatically sets long-lived `Cache-Control: public, max-age=31536000, immutable` headers for hashed static assets in `/_next/static/`. No configuration is required.

### No Application-Level Cache Configured

There is currently no explicit Redis or in-memory cache for API responses (listings, analytics, etc.). If response latency becomes a bottleneck, consider caching frequently read, rarely updated data (e.g., listing details, billing plans) using Redis with a short TTL.

---

## Prometheus Metrics

`backend/src/plugins/observability.ts` exposes a `/metrics` endpoint that Prometheus can scrape. Two metrics are tracked out of the box:

| Metric | Type | Description |
|--------|------|-------------|
| `http_requests_total` | Counter | Total HTTP requests, labelled by method, route, and status |
| `http_request_duration_seconds` | Histogram | Request duration distribution |

Use these metrics in Grafana (dashboards are provisioned from `monitoring/grafana/`) to identify slow routes and high-error-rate endpoints before optimizing.

---

## Realtime (Socket.IO)

By default Socket.IO runs in a single-instance mode. For horizontal scaling, set:

```
REDIS_URL=redis://...
WS_ENABLE_REDIS_ADAPTER=true
```

This switches Socket.IO to the Redis pub/sub adapter (`@socket.io/redis-adapter`) so messages are fan-out across all backend instances.

---

## Lifecycle Email Background Worker

`backend/src/lib/lifecycle-email-automation.ts` runs a background ticker. The interval is configurable:

```
LIFECYCLE_EMAIL_TICK_MS=60000  # default: 1 minute
```

In high-volume deployments consider increasing this interval or moving the worker to a dedicated process to avoid competing with request handling.
