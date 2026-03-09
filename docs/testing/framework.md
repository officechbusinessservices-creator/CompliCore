# Testing Framework

CompliCore uses **Vitest** for both frontend and backend tests.

---

## Running Tests

```bash
# Run all tests (frontend + lint + backend)
npm test

# Frontend tests only
npm run test:frontend

# Frontend tests in watch mode
npm run test:frontend:watch

# Frontend tests with coverage report
npm run test:frontend:coverage

# Backend tests only
cd backend && npm test

# Backend tests with coverage report
cd backend && npm run test -- --coverage
```

The CI pipeline runs `npm run lint` and backend tests on every push/PR (see `.github/workflows/ci.yml`).

---

## Frontend Tests

**Configuration:** `vitest.config.ts` (repository root)

| Setting | Value |
|---------|-------|
| Test environment | `jsdom` |
| Globals | `true` (no import needed for `describe`, `it`, `expect`) |
| Setup file | `src/test/setup.ts` |
| Test pattern | `src/**/*.{test,spec}.{ts,tsx}` |
| Coverage provider | `v8` |
| Coverage reporters | HTML, JSON, text |
| Excluded from coverage | `layout.tsx`, `globals.css`, test files |

**Setup file** (`src/test/setup.ts`) imports `@testing-library/jest-dom`, extending Vitest's `expect` with DOM matchers (e.g., `toBeInTheDocument()`, `toHaveTextContent()`).

### Test Location

Frontend tests live alongside source files in `src/`, or in the `src/test/` directory.

Current test files:

| File | What it tests |
|------|--------------|
| `src/test/lib/rbac.test.ts` | RBAC utility functions in `src/lib/rbac.ts` — role checking and access-control logic used by frontend components |

### Example: Frontend Test Pattern

```typescript
// src/test/lib/rbac.test.ts
import { describe, it, expect } from "vitest";
import { hasRole } from "@/lib/rbac";

describe("hasRole", () => {
  it("returns true when user has the required role", () => {
    const user = { roles: ["host"] };
    expect(hasRole(user, "host")).toBe(true);
  });

  it("returns false when user does not have the role", () => {
    const user = { roles: ["guest"] };
    expect(hasRole(user, "host")).toBe(false);
  });
});
```

---

## Backend Tests

**Configuration:** `backend/vitest.config.mts`

| Setting | Value |
|---------|-------|
| Test environment | `node` |
| Test pattern | `src/__tests__/**/*.test.ts` |
| Excluded | `node_modules`, `dist` |

Backend tests require `ENABLE_DEMO_FALLBACK=true` (set automatically by the `npm run test` script in `backend/package.json`) to run without a live PostgreSQL database.

### Test Location

All backend tests live in `backend/src/__tests__/`.

| File | What it tests |
|------|--------------|
| `integration.test.ts` | End-to-end auth + booking flow (register → login → create booking → cancel booking) |
| `payments.test.ts` | Payment creation and checkout session handling |
| `api.test.ts` | Core API endpoint behaviour (register, login, cookies, auth guards) |
| `sample.test.ts` | Utility / smoke tests |

### Test Infrastructure

Tests use `fastify.inject()` — Fastify's built-in HTTP injection — rather than starting a real server or making network calls. This makes tests fast and self-contained.

```typescript
// Typical backend test pattern
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildServer } from "../server";

let server: any;

beforeAll(async () => {
  server = await buildServer();
});

afterAll(async () => {
  if (server) await server.close();
});

describe("Auth + booking flow", () => {
  it("register → login → create booking → cancel booking", async () => {
    // Register
    const register = await server.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email: "test@example.com",
        password: "TestPass123!",
        firstName: "Test",
        lastName: "User",
      },
    });
    expect(register.statusCode).toBe(201);

    // Login
    const login = await server.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "test@example.com", password: "TestPass123!" },
    });
    expect(login.statusCode).toBe(200);
    const { accessToken } = JSON.parse(login.payload);

    // Create booking
    const booking = await server.inject({
      method: "POST",
      url: "/v1/bookings",
      headers: { Authorization: `Bearer ${accessToken}` },
      payload: {
        confirmation_code: "TST-001",
        listing_id: 1,
        guest_name: "Test User",
        property: "Demo Property",
        check_in: "2026-03-01",
        check_out: "2026-03-02",
      },
    });
    expect(booking.statusCode).toBe(201);
  });
});
```

---

## Coverage Reports

Both the frontend and backend support coverage reporting:

```bash
# Frontend
npm run test:frontend:coverage
# → outputs to coverage/ directory

# Backend
cd backend && npm run test -- --coverage
# → outputs to backend/coverage/ directory
```

The CI pipeline (`backend-validate` job) runs vitest with `--coverage` on every push to `main`.
