# Known Gotchas — CompliCore

Things that burned us. Never repeat these.

---

## Dual-Prefix Route Registration

**What happens:** Adding a route to only /v1 works fine. Adding it to only /api also works.
But forgetting to register under both means some clients (using deprecated /api) get 404.

**Root cause:** backend/src/server.ts registers all routes under BOTH /v1 and /api prefixes.
New routes inherit this automatically only if added via the standard plugin pattern.
If you manually register a route outside the plugin, you may miss one prefix.

**Prevention:** Always add routes inside the plugin function in their respective route file.
Never call fastify.get/post/etc. outside the plugin pattern.

---

## Prisma Client Location

**What happens:** Running `npx prisma generate` from the root directory generates the client
to the wrong location and breaks backend imports.

**Root cause:** The prisma schema is at backend/prisma/schema.prisma. The Prisma client
must be generated from inside the /backend directory.

**Prevention:** Always cd backend before running any prisma commands.
```bash
cd backend && npx prisma generate
cd backend && npx prisma migrate dev
```

---

## In-Memory User Store in Tests

**What happens:** Backend tests pass locally but fail in CI because the in-memory user store
resets between test runs and test order matters.

**Root cause:** secure-user-model.ts stores users in a module-level Map. If test A creates
a user and test B depends on it, test B fails when run in isolation.

**Prevention:** Each test must set up its own data. Never rely on state from another test.
Use beforeEach to reset or seed required state.

---

## Frontend tsconfig Excludes Backend

**What happens:** TypeScript errors in backend/ are invisible to `npm run lint` at the root.
A broken backend type can be committed without any frontend CI warning.

**Root cause:** Root tsconfig.json has `"exclude": ["backend/**"]` intentionally.

**Prevention:** Always run `cd backend && npm run build` as part of backend change review.
The backend has its own tsconfig with strict mode.

---

## Socket.IO Single-Instance Constraint

**What happens:** Realtime events (new messages, booking updates) only work when all users
connect to the same backend instance. With two instances, events sent to instance A
do not reach users connected to instance B.

**Root cause:** Socket.IO requires a Redis adapter for multi-instance message broadcasting.
The adapter is only active when REDIS_URL is configured.

**Prevention:** Do not promise realtime features in production until REDIS_URL is set
and the Redis adapter is confirmed active. Check with: `redis-cli PUBSUB CHANNELS "socket.io*"`

---
