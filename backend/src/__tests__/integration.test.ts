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
  it("login -> create booking -> cancel booking", async () => {
    const login = await server.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email: "dev@local" },
    });
    expect(login.statusCode).toBe(200);
    const loginBody = JSON.parse(login.payload);
    const token = loginBody.accessToken || loginBody.token;
    expect(token).toBeTruthy();

    const created = await server.inject({
      method: "POST",
      url: "/api/bookings",
      headers: { Authorization: `Bearer ${token}` },
      payload: {
        confirmation_code: "TST-BOOK",
        guest_name: "Tester",
        property: "Demo",
        check_in: "2026-03-01",
        check_out: "2026-03-02",
      },
    });
    expect(created.statusCode).toBe(200);
    const createdBody = JSON.parse(created.payload);
    const bookingId = createdBody.id || "demo";

    const cancelled = await server.inject({
      method: "POST",
      url: `/api/bookings/${bookingId}/cancel`,
      payload: { reason: "test" },
    });
    expect(cancelled.statusCode).toBe(200);
    const cancelBody = JSON.parse(cancelled.payload);
    expect(cancelBody.booking?.status).toBe("cancelled");
  });
});
