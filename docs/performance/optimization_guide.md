# Performance Optimization Guide

This document covers performance considerations based on what is actually present in the CompliCore codebase.

---

## Database — Prisma Indexes

The Prisma schema (`backend/prisma/schema.prisma`) defines the following indexes:

| Model | Index | Type | Purpose |
|-------|-------|------|---------|
| `User` | `email` | Unique + index | Fast lookup on login and registration |
| `WebAuthnCredential` | `userId` | Index | Fast join to user when verifying a credential |
| `Booking` | `(status, created_at)` | Composite index | Efficient filtering of bookings by status ordered by creation time |
| `Booking` | `user_id` | Index | Fast lookup of all bookings for a user |
| `Listing` | `host_id` | Index | Fast lookup of all listings for a host |

These indexes cover the most common read patterns (auth, booking lists, listing management). Columns without indexes (`Message.booking_id`, `Payment.booking_id`, `Subscription.user_id`) are candidates for future indexing if query volumes grow.

### Recommendations

- Add `@@index([booking_id])` to `Message` and `Payment` if message threading or payment lookup becomes a hot path.
- Use `select` in Prisma queries to fetch only required columns, especially for wide models like `Booking`.
- Paginate list queries using `take` / `skip` or cursor-based pagination to avoid full-table scans.

---

## Redis Caching

`backend/src/lib/redis.ts` provides a `getOrDefault` helper that wraps any async call with Redis-backed caching:

```ts
// Returns cached value if available, otherwise calls fallback and caches result
const data = await getOrDefault(
  "cache:key",
  () => prisma.listing.findMany(),
  300 // TTL in seconds
);
```

- The Redis client is **optional**: if `REDIS_URL` is not set, the helper falls back to calling the underlying function directly with no caching.
- Default TTL is 300 seconds (5 minutes).
- Used in analytics and AI endpoints to reduce repeated database or external API calls.

---

## Next.js Optimizations

### Image Optimization

Configured in `next.config.js`:

- **Formats:** AVIF and WebP are generated automatically by the Next.js image service.
- **Device sizes:** `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`
- **Image sizes:** `[16, 32, 48, 64, 96, 128, 256, 384]`
- **Remote patterns:** Unsplash (`source.unsplash.com`, `images.unsplash.com`) and Same Assets CDN are whitelisted.
- **Development:** `unoptimized: true` is set in development to speed up local iteration; optimization is active in production.

Use the `next/image` component (`<Image>`) instead of `<img>` for all property photos and user avatars to take advantage of automatic resizing and format selection.

### Compression

`compress: true` is enabled in `next.config.js`, which activates gzip compression for all Next.js-served responses.

### Bundle Analysis

Run `ANALYZE=true npm run build` to open an interactive bundle analyser (powered by `@next/bundle-analyzer`). Use this to identify large dependencies in the client bundle.

### React Strict Mode

`reactStrictMode: true` is enabled, which surfaces rendering issues during development that could affect performance in production.

### Server Components

The App Router (`src/app/`) supports React Server Components by default. Pages that do not require client-side interactivity should avoid the `"use client"` directive to keep them server-rendered, reducing JavaScript bundle size.

---

## API-level Considerations

### Rate Limiting

`@fastify/rate-limit` is applied globally. High-frequency automated clients (internal services, monitoring) should be added to `RATE_LIMIT_ALLOWLIST` to avoid throttling.

### Idempotency

The `idempotency` plugin caches responses for non-idempotent operations (payments, bookings). This prevents duplicated work from retried requests.

### Socket.IO Scaling

When running multiple backend instances, set `REDIS_URL` to enable the Socket.IO Redis adapter so that real-time events are broadcast across all nodes.

---

## Build & Deployment

- The frontend build script (`npm run build`) passes the `--webpack` flag explicitly: `next build --webpack`. The project therefore uses Webpack rather than Turbopack.
- Keep `NODE_ENV=production` in deployed environments to enable all Next.js production optimizations (minification, dead code elimination, etc.).
- The backend build (`cd backend && npm run build`) runs `prisma generate` before `tsc`. Both steps are required for a valid production artifact.
