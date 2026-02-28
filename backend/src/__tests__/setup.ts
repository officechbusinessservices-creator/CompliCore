// Global test setup — runs before any test module is imported.
// Sets the minimum environment variables required by src/lib/env.ts
// so that tests can run without a real database or secrets store.
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://test:test@localhost:5432/test_db";
process.env.JWT_SECRET =
  process.env.JWT_SECRET ?? "test-jwt-secret-at-least-32-characters-long!!";
process.env.NODE_ENV = process.env.NODE_ENV ?? "test";
