# Testing Framework

---

## Test runners

| Layer | Runner | Config file |
|-------|--------|-------------|
| Frontend | [Vitest](https://vitest.dev/) 3.x | `vitest.config.ts` (root) |
| Backend | [Vitest](https://vitest.dev/) | `backend/vitest.config.mts` |

---

## Frontend Tests

### Configuration

`vitest.config.ts` (root):

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",      // Browser-like DOM environment
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/app/layout.tsx",
        "src/app/globals.css",
        "src/test/**",
      ],
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

### Test location

`src/test/` and any `src/**/*.{test,spec}.{ts,tsx}` file.

### Running frontend tests

```bash
# Run once
npm run test:frontend

# Watch mode
npm run test:frontend:watch

# With coverage report
npm run test:frontend:coverage
```

### Test setup

`src/test/setup.ts` — global test setup loaded before every test file (e.g. `@testing-library/jest-dom` matchers).

### Example

`src/test/` contains a smoke test:

```ts
import { describe, expect, it } from "vitest";

describe("sample test", () => {
  it("verifies math works", () => {
    expect(1 + 1).toBe(2);
  });
});
```

---

## Backend Tests

### Configuration

`backend/vitest.config.mts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
  },
});
```

### Test location

`backend/src/__tests__/`

### Running backend tests

```bash
cd backend
npm run test
# Internally runs: ENABLE_DEMO_FALLBACK=true vitest --run --config vitest.config.mts
```

The `ENABLE_DEMO_FALLBACK=true` environment variable activates the in-memory user store so tests can run without a live PostgreSQL database.

### Coverage

```bash
cd backend
npm run test -- --coverage
```

### Test files

| File | What it covers |
|------|---------------|
| `sample.test.ts` | Trivial smoke test (math assertion) |
| `api.test.ts` | Core API endpoints: user registration, login, auth cookies, email/password validation. Uses `fastify.inject()` for in-process HTTP calls. |
| `payments.test.ts` | Stripe checkout flow, billing plan retrieval, rate-limit enforcement. Creates a test user via register/login before each suite. |
| `integration.test.ts` | Broader end-to-end integration patterns. |

### Test patterns

Backend tests follow this pattern:

```ts
import { buildServer } from "../server";

let app: Awaited<ReturnType<typeof buildServer>>;

beforeAll(async () => {
  app = await buildServer();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

it("registers a new user", async () => {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/register",
    payload: { email: "test@example.com", password: "Password1!" },
  });
  expect(res.statusCode).toBe(201);
});
```

Key conventions:
- Use `fastify.inject()` — no real network ports are opened.
- Set `ENABLE_DEMO_FALLBACK=true` so tests don't require a database.
- Create authenticated users via the register/login API rather than seeding the database directly.

---

## Running All Tests

The root `npm test` script runs all layers in sequence:

```bash
npm test
# Equivalent to:
# npm run test:frontend && npm run lint && (cd backend && npm run test)
```

This also runs `npm run lint` (TypeScript type-check + ESLint) for the frontend between the two test suites.

---

## CI Coverage

The CI pipeline (`.github/workflows/ci.yml`) runs `vitest --coverage` in the `backend-validate` job. Coverage reports are generated but not currently gated on a minimum threshold.
