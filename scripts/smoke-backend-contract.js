#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.PUBLIC_API_BASE_URL = process.env.PUBLIC_API_BASE_URL || "http://localhost:4000";
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/rental_dev";
process.env.JWT_SECRET =
  process.env.JWT_SECRET || "test-secret-with-at-least-32-characters-123456";
process.env.ENABLE_DEMO_FALLBACK = process.env.ENABLE_DEMO_FALLBACK || "true";

const specPath = path.join(__dirname, "..", "specs", "openapi.yaml");
const { buildServer } = require(path.join(__dirname, "..", "backend", "dist", "server"));

const documentedCritical = [
  { method: "post", path: "/auth/register" },
  { method: "post", path: "/auth/login" },
  { method: "get", path: "/bookings" },
  { method: "get", path: "/bookings/{bookingId}/access" },
  { method: "get", path: "/agentic/status" },
  { method: "get", path: "/economic/activation/status" },
];

function fail(message) {
  throw new Error(message);
}

function getSpec() {
  return yaml.load(fs.readFileSync(specPath, "utf8"));
}

function assertDocumentedEndpoints(spec) {
  for (const endpoint of documentedCritical) {
    const route = spec.paths?.[endpoint.path];
    if (!route || !route[endpoint.method]) {
      fail(`documented endpoint missing in OpenAPI: ${endpoint.method.toUpperCase()} ${endpoint.path}`);
    }
  }
}

function toFastifyPath(openApiPath) {
  return `/v1${openApiPath.replace(/\{([^}]+)\}/g, ":$1")}`;
}

function assertRoutedEndpoints(server) {
  for (const endpoint of documentedCritical) {
    const url = toFastifyPath(endpoint.path);
    const exists = server.hasRoute({ method: endpoint.method.toUpperCase(), url });
    if (!exists) {
      fail(`backend route missing for documented endpoint: ${endpoint.method.toUpperCase()} ${url}`);
    }
  }
}

async function main() {
  const spec = getSpec();
  assertDocumentedEndpoints(spec);

  const server = await buildServer();
  try {
    assertRoutedEndpoints(server);

    const deprecated = await server.inject({ method: "GET", url: "/api/bookings" });
    if (deprecated.headers.deprecation !== "true") {
      fail("legacy /api routes must return Deprecation=true header");
    }
    if (!deprecated.headers.sunset) {
      fail("legacy /api routes must return Sunset header");
    }

    const email = `smoke-${Date.now()}@example.com`;
    const password = "SmokePass123!";
    const register = await server.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email, password, firstName: "Smoke", lastName: "Tester", role: "admin" },
    });
    if (register.statusCode !== 201) {
      fail(`expected register 201, got ${register.statusCode}`);
    }

    const login = await server.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email, password, role: "admin" },
    });
    if (login.statusCode !== 200) {
      fail(`expected login 200, got ${login.statusCode}`);
    }
    const loginBody = JSON.parse(login.payload);
    if (loginBody.user?.roles?.includes("admin")) {
      fail("login response must not allow client role escalation");
    }
    const token = loginBody.accessToken;

    const bookingList = await server.inject({
      method: "GET",
      url: "/v1/bookings",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (bookingList.statusCode !== 200) {
      fail(`expected booking list 200, got ${bookingList.statusCode}`);
    }
    const listBody = JSON.parse(bookingList.payload);
    const first = Array.isArray(listBody) ? listBody[0] : listBody;
    if (first && ("access_code" in first || "wifi_password" in first)) {
      fail("booking list must not expose access_code or wifi_password");
    }

    const created = await server.inject({
      method: "POST",
      url: "/v1/bookings",
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        listing_id: 1,
        guest_name: "Smoke Tester",
        property: "Demo",
        check_in: "2026-03-01",
        check_out: "2026-03-02",
        access_code: "1234",
        wifi_name: "WiFi",
        wifi_password: "Secret",
      },
    });
    if (created.statusCode !== 201) {
      fail(`expected create booking 201, got ${created.statusCode}`);
    }
    const bookingId = 1;

    const guestAccess = await server.inject({
      method: "GET",
      url: `/v1/bookings/${bookingId}/access`,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (guestAccess.statusCode !== 403) {
      fail(`expected guest access 403, got ${guestAccess.statusCode}`);
    }

    const adminToken = server.jwt.sign({ userId: "smoke-admin", roles: ["admin"], typ: "access" });
    const adminAccess = await server.inject({
      method: "GET",
      url: `/v1/bookings/${bookingId}/access`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (adminAccess.statusCode !== 200) {
      fail(`expected admin access 200, got ${adminAccess.statusCode}`);
    }

    const agentic = await server.inject({ method: "GET", url: "/v1/agentic/status" });
    if (agentic.statusCode !== 200) {
      fail(`expected /v1/agentic/status 200, got ${agentic.statusCode}`);
    }

    const economic = await server.inject({ method: "GET", url: "/v1/economic/activation/status" });
    if (economic.statusCode !== 200) {
      fail(`expected /v1/economic/activation/status 200, got ${economic.statusCode}`);
    }
  } finally {
    await server.close();
  }
}

main()
  .then(() => {
    console.log("Backend contract smoke checks passed.");
  })
  .catch((error) => {
    console.error(`Backend contract smoke checks failed: ${error.message}`);
    process.exit(1);
  });
