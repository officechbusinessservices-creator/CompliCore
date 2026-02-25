import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildServer } from "../server";

let server: any;

beforeAll(async () => {
  server = await buildServer();
});

afterAll(async () => {
  if (server) await server.close();
});

async function registerAndLogin() {
  const email = `integration-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  const password = "IntegrationPass123!";

  const register = await server.inject({
    method: "POST",
    url: "/v1/auth/register",
    payload: {
      email,
      password,
      firstName: "Integration",
      lastName: "Tester",
    },
  });
  expect(register.statusCode).toBe(201);

  const login = await server.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password },
  });
  expect(login.statusCode).toBe(200);
  const loginBody = JSON.parse(login.payload);
  const token = loginBody.accessToken || loginBody.token;
  expect(token).toBeTruthy();
  return token as string;
}

describe("Auth + booking flow", () => {
  it("login -> create booking -> cancel booking", async () => {
    const token = await registerAndLogin();

    const created = await server.inject({
      method: "POST",
      url: "/v1/bookings",
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        confirmation_code: "TST-BOOK",
        listing_id: 1,
        guest_name: "Tester",
        property: "Demo",
        check_in: "2026-03-01",
        check_out: "2026-03-02",
      },
    });
    expect(created.statusCode).toBe(201);
    const createdBody = JSON.parse(created.payload);
    const bookingId = createdBody.id || "demo";

    const cancelled = await server.inject({
      method: "POST",
      url: `/v1/bookings/${bookingId}/cancel`,
      headers: { Authorization: `Bearer ${token}` },
      payload: { reason: "test" },
    });
    expect(cancelled.statusCode).toBe(200);
    const cancelBody = JSON.parse(cancelled.payload);
    expect(cancelBody.booking?.status).toBe("cancelled");
  });

  it("booking access details are restricted to host/admin", async () => {
    const token = await registerAndLogin();
    const bookingId = 1;

    const denied = await server.inject({
      method: "GET",
      url: `/v1/bookings/${bookingId}/access`,
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(denied.statusCode).toBe(403);

    const adminToken = server.jwt.sign({ userId: "admin-user", roles: ["admin"], typ: "access" });
    const allowed = await server.inject({
      method: "GET",
      url: `/v1/bookings/${bookingId}/access`,
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(allowed.statusCode).toBe(200);
    const allowedBody = JSON.parse(allowed.payload);
    expect(allowedBody).toHaveProperty("access_code");
  });

  it("legacy /api prefix emits deprecation headers", async () => {
    const res = await server.inject({ method: "GET", url: "/api/bookings" });
    expect(res.headers.deprecation).toBe("true");
    expect(typeof res.headers.sunset).toBe("string");
  });

  it("module integrations + marketplace endpoints respond", async () => {
    const integrations = await server.inject({
      method: "GET",
      url: "/v1/integrations",
      headers: { Authorization: `Bearer ${server.jwt.sign({ userId: "ops-user", roles: ["admin"], typ: "access" })}` },
    });
    expect(integrations.statusCode).toBe(200);
    const integrationsBody = JSON.parse(integrations.payload);
    expect(Array.isArray(integrationsBody.data)).toBe(true);

    const marketplace = await server.inject({ method: "GET", url: "/v1/marketplace" });
    expect(marketplace.statusCode).toBe(200);
    const marketplaceBody = JSON.parse(marketplace.payload);
    expect(Array.isArray(marketplaceBody.data)).toBe(true);
  });

  it("agentic and economic status endpoints are mounted on /v1", async () => {
    const agentic = await server.inject({ method: "GET", url: "/v1/agentic/status" });
    expect(agentic.statusCode).toBe(200);

    const economic = await server.inject({ method: "GET", url: "/v1/economic/activation/status" });
    expect(economic.statusCode).toBe(200);
  });
});
