import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildServer } from "../server";

let server: any;

beforeAll(async () => {
  server = await buildServer();
});

afterAll(async () => {
  if (server) await server.close();
});

async function createAuthToken() {
  const email = `api-core-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  const password = "TestPass123!";

  const register = await server.inject({
    method: "POST",
    url: "/api/auth/register",
    payload: {
      email,
      password,
      firstName: "API",
      lastName: "Tester",
      role: "host",
    },
  });
  expect(register.statusCode).toBe(201);

  const login = await server.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: { email, password },
  });
  expect(login.statusCode).toBe(200);
  const loginBody = JSON.parse(login.payload);
  expect(typeof loginBody.accessToken).toBe("string");
  return loginBody.accessToken as string;
}

describe("API - core endpoints", () => {
  it("GET /api/bookings returns 200", async () => {
    const res = await server.inject({ method: "GET", url: "/api/bookings" });
    expect(res.statusCode).toBe(200);
  });

  it("POST /api/auth/login returns token", async () => {
    const token = await createAuthToken();
    expect(typeof token).toBe("string");
  });

  it("POST /api/bookings without token returns 401", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/bookings",
      payload: { guest_name: "T" },
    });
    expect(res.statusCode).toBe(401);
  });
});
