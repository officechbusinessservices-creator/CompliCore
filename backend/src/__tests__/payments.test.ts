import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildServer } from "../server";

let server: any;
let token: string;

beforeAll(async () => {
  server = await buildServer();

  // Register + login to get a valid token for authenticated routes
  const email = `payments-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  const password = "PaymentsPass123!";

  const register = await server.inject({
    method: "POST",
    url: "/v1/auth/register",
    payload: { email, password, firstName: "Pay", lastName: "Tester" },
  });
  expect(register.statusCode).toBe(201);

  const login = await server.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: { email, password },
  });
  expect(login.statusCode).toBe(200);
  token = JSON.parse(login.payload).accessToken;
  expect(typeof token).toBe("string");
});

afterAll(async () => {
  if (server) await server.close();
});

describe("GET /v1/billing/plans", () => {
  it("returns billing plans without auth", async () => {
    const res = await server.inject({ method: "GET", url: "/v1/billing/plans" });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    const plan = body[0];
    expect(plan).toHaveProperty("id");
    expect(plan).toHaveProperty("name");
  });
});

describe("POST /v1/payments/checkout", () => {
  it("returns 401 without auth token", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/v1/payments/checkout",
      payload: { bookingId: "BK-001", amount: 250, currency: "usd" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("returns 400 when amount is missing", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/v1/payments/checkout",
      headers: { Authorization: `Bearer ${token}` },
      payload: { bookingId: "BK-001" },
    });
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.payload);
    expect(body.type).toBe("urn:problem:validation");
  });

  it("returns 400 when bookingId is missing", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/v1/payments/checkout",
      headers: { Authorization: `Bearer ${token}` },
      payload: { amount: 250, currency: "usd" },
    });
    expect(res.statusCode).toBe(400);
  });

  it("returns demo PaymentIntent when Stripe not configured", async () => {
    // In test mode STRIPE_SECRET_KEY is empty, so demo fallback fires
    const res = await server.inject({
      method: "POST",
      url: "/v1/payments/checkout",
      headers: { Authorization: `Bearer ${token}` },
      payload: { bookingId: "BK-001", amount: 250, currency: "usd" },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(typeof body.clientSecret).toBe("string");
    expect(typeof body.paymentIntentId).toBe("string");
    expect(body.booking).toMatchObject({ id: "BK-001" });
  });

  it("defaults currency to usd when omitted", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/v1/payments/checkout",
      headers: { Authorization: `Bearer ${token}` },
      payload: { bookingId: "BK-002", amount: 100 },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
  });
});

describe("POST /v1/payments/create", () => {
  it("returns 401 without auth token", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/v1/payments/create",
      payload: { amount: 500, currency: "usd" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("returns 400 on invalid payload", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/v1/payments/create",
      headers: { Authorization: `Bearer ${token}` },
      payload: { amount: -50, currency: "usd" },
    });
    expect(res.statusCode).toBe(400);
  });

  it("returns demo PaymentIntent when Stripe not configured", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/v1/payments/create",
      headers: { Authorization: `Bearer ${token}` },
      payload: { amount: 500, currency: "usd" },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(typeof body.paymentIntentId).toBe("string");
    expect(typeof body.clientSecret).toBe("string");
    expect(body.amount).toBe(500);
    expect(body.currency).toBe("usd");
  });
});

describe("POST /v1/payments/webhook", () => {
  it("returns 400 when Stripe is not configured", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/v1/payments/webhook",
      headers: { "content-type": "application/json", "stripe-signature": "t=123,v1=abc" },
      payload: JSON.stringify({ type: "payment_intent.succeeded", data: { object: { id: "pi_test" } } }),
    });
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.payload);
    // Either "not configured" or "signature verification failed" depending on env
    expect([400]).toContain(res.statusCode);
    expect(body.type).toMatch(/urn:problem:/);
  });

  it("returns 400 when stripe-signature header is missing", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/v1/payments/webhook",
      headers: { "content-type": "application/json" },
      payload: JSON.stringify({ type: "ping" }),
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /v1/payments/methods", () => {
  it("returns 401 without auth token", async () => {
    const res = await server.inject({ method: "GET", url: "/v1/payments/methods" });
    expect(res.statusCode).toBe(401);
  });

  it("returns payment methods list for authenticated user", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/v1/payments/methods",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty("last4");
    expect(body[0]).toHaveProperty("brand");
  });
});

describe("GET /v1/payouts", () => {
  it("returns 401 without auth token", async () => {
    const res = await server.inject({ method: "GET", url: "/v1/payouts" });
    expect(res.statusCode).toBe(401);
  });

  it("returns 403 for guest-role user (payouts require host/admin)", async () => {
    // Newly registered users default to guest role; payouts require host or admin
    const res = await server.inject({
      method: "GET",
      url: "/v1/payouts",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(403);
  });
});

describe("POST /v1/billing/subscribe", () => {
  it("returns 401 without auth token", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/v1/billing/subscribe",
      payload: { planId: "host_club" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("returns 403 for guest-role user (subscribe requires host/admin)", async () => {
    // Auth check fires before payload validation; guest role is denied first
    const res = await server.inject({
      method: "POST",
      url: "/v1/billing/subscribe",
      headers: { Authorization: `Bearer ${token}` },
      payload: { planId: "host_club" },
    });
    expect(res.statusCode).toBe(403);
  });
});
