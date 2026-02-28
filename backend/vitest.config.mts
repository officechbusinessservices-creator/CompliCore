import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Inject minimum required env vars before any module is imported.
    setupFiles: ["src/__tests__/setup.ts"],
    include: ["src/__tests__/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    // Use forks pool to avoid Vite CJS Node API deprecation warning.
    // Forks spawn isolated child processes that load Vite via ESM import()
    // rather than through the deprecated CJS require() path.
    pool: "forks",
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/__tests__/**", "src/index.ts"],
    },
  },
});
