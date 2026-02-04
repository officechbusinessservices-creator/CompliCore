import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildServer } from "../server";

let server: any;

beforeAll(async () => {
  server = await buildServer();
});

afterAll(async () => {
  if (server) await server.close();
});

describe("API - core endpoints", () => {
  it("GET /api/bookings returns 200", async () => {
    const res = await server.inject({ method: "GET", url: "/api/bookings" });
    expect(res.statusCode).toBe(200);
  });

  it("POST /api/auth/login returns token", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email: "dev@local" },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty("token");
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
