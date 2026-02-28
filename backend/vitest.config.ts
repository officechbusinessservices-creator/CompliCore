import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://testuser:testonly@localhost:5432/complicore_test",
      JWT_SECRET: "test-jwt-secret-must-be-at-least-32-characters!!",
      ENABLE_DEMO_FALLBACK: "true",
    },
  },
});
