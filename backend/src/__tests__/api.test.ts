import { describe, it, expect, beforeAll, afterAll } from "vitest";
import crypto from "crypto";
import { buildServer } from "../server";
import { Email } from "../utils/email";
import { env } from "../lib/env";
import { createUser, hashPassword } from "../lib/secure-user-model";

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
    url: "/v1/auth/register",
    payload: {
      email,
      password,
      firstName: "API",
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
  expect(typeof loginBody.accessToken).toBe("string");
  return loginBody.accessToken as string;
}

describe("API - core endpoints", () => {
  it("register and login set auth cookies", async () => {
    const email = `api-cookie-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
    const password = "CookiePass123!";

    const register = await server.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email,
        password,
        firstName: "Cookie",
        lastName: "Tester",
      },
    });
    expect(register.statusCode).toBe(201);
    const registerSetCookie = register.headers["set-cookie"];
    expect(registerSetCookie).toBeTruthy();
    const registerCookies = Array.isArray(registerSetCookie) ? registerSetCookie.join(";") : String(registerSetCookie);
    expect(registerCookies).toContain(`${env.ACCESS_TOKEN_COOKIE_NAME}=`);
    expect(registerCookies).toContain(`${env.REFRESH_TOKEN_COOKIE_NAME}=`);

    const login = await server.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email, password },
    });
    expect(login.statusCode).toBe(200);
    const loginSetCookie = login.headers["set-cookie"];
    expect(loginSetCookie).toBeTruthy();
    const loginCookies = Array.isArray(loginSetCookie) ? loginSetCookie.join(";") : String(loginSetCookie);
    expect(loginCookies).toContain(`${env.ACCESS_TOKEN_COOKIE_NAME}=`);
    expect(loginCookies).toContain(`${env.REFRESH_TOKEN_COOKIE_NAME}=`);
  });

  it("GET /v1/bookings without token returns 401", async () => {
    const res = await server.inject({ method: "GET", url: "/v1/bookings" });
    expect(res.statusCode).toBe(401);
  });

  it("POST /v1/auth/login returns token", async () => {
    const token = await createAuthToken();
    expect(typeof token).toBe("string");
  });

  it("locks login after repeated failed attempts", async () => {
    const email = `api-lock-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
    const password = "LockPass123!";

    const register = await server.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email,
        password,
        firstName: "Lock",
        lastName: "Tester",
      },
    });
    expect(register.statusCode).toBe(201);

    let lastStatus = 0;
    let lastBody: any = null;
    for (let i = 0; i < env.AUTH_MAX_FAILED_ATTEMPTS; i += 1) {
      const attempt = await server.inject({
        method: "POST",
        url: "/v1/auth/login",
        payload: { email, password: "WrongPass123!" },
      });
      lastStatus = attempt.statusCode;
      lastBody = JSON.parse(attempt.payload);
    }

    expect(lastStatus).toBe(429);
    expect(lastBody.error).toBe("account temporarily locked");
    expect(typeof lastBody.retryAt).toBe("string");
  });

  it("POST /v1/bookings without token returns 401", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/v1/bookings",
      payload: { guest_name: "T" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("rejects unsigned PMS webhooks when signature secret is enabled", async () => {
    const previousSecret = env.PMS_WEBHOOK_SECRET;
    env.PMS_WEBHOOK_SECRET = "test-webhook-secret";

    try {
      const payload = { event: "reservation.updated", reservationId: "r_123" };
      const unsigned = await server.inject({
        method: "POST",
        url: "/v1/pms/connectors/guesty/webhook",
        payload,
      });
      expect(unsigned.statusCode).toBe(401);

      const signature = crypto
        .createHmac("sha256", env.PMS_WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest("hex");

      const signed = await server.inject({
        method: "POST",
        url: "/v1/pms/connectors/guesty/webhook",
        headers: { "x-pms-signature": signature },
        payload,
      });
      expect(signed.statusCode).toBe(200);
    } finally {
      env.PMS_WEBHOOK_SECRET = previousSecret;
    }
  });

  it("ignores client-supplied role on register and login", async () => {
    const email = `api-role-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
    const password = "TestPass123!";

    const register = await server.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        email,
        password,
        firstName: "Role",
        lastName: "Tester",
        role: "admin",
      },
    });
    expect(register.statusCode).toBe(201);

    const login = await server.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email, password, role: "admin" },
    });
    expect(login.statusCode).toBe(200);

    const body = JSON.parse(login.payload);
    expect(Array.isArray(body.user?.roles)).toBe(true);
    expect(body.user.roles).toContain("guest");
    expect(body.user.roles).not.toContain("admin");
  });

  it("forgot-password uses canonical /v1 reset route", async () => {
    const capturedUrls: string[] = [];
    const originalSend = Email.prototype.sendPasswordReset;
    Email.prototype.sendPasswordReset = async function mockedSendPasswordReset() {
      capturedUrls.push((this as any).url);
    };

    try {
      const email = `forgot-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
      const password = "ForgotPass123!";

      const register = await server.inject({
        method: "POST",
        url: "/v1/auth/register",
        payload: {
          email,
          password,
          firstName: "Forgot",
          lastName: "Flow",
        },
      });
      expect(register.statusCode).toBe(201);

      const forgot = await server.inject({
        method: "POST",
        url: "/v1/auth/forgot-password",
        payload: { email },
      });
      expect(forgot.statusCode).toBe(200);
      expect(capturedUrls.length).toBe(1);
      expect(capturedUrls[0]).toContain("/v1/auth/reset-password/");
      expect(capturedUrls[0]).not.toContain("/api/v1/auth/reset-password/");
    } finally {
      Email.prototype.sendPasswordReset = originalSend;
    }
  });

  it("requires step-up for host/admin sensitive access when step-up is pending", async () => {
    const email = `api-stepup-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
    const password = "StepUpPass123!";
    const passwordHash = await hashPassword(password);
    const host = createUser({
      email,
      firstName: "Step",
      lastName: "Up",
      roles: ["host"],
      passwordHash,
    });

    const login = await server.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email, password },
    });
    expect(login.statusCode).toBe(200);
    const loginBody = JSON.parse(login.payload);
    expect(loginBody.mfa?.required).toBe(true);
    expect(loginBody.mfa?.enrolled).toBe(false);

    const status = await server.inject({
      method: "GET",
      url: "/v1/auth/mfa/step-up/status",
      headers: { Authorization: `Bearer ${loginBody.accessToken}` },
    });
    expect(status.statusCode).toBe(200);
    const statusBody = JSON.parse(status.payload);
    expect(statusBody.required).toBe(true);
    expect(statusBody.verified).toBe(false);

    const denied = await server.inject({
      method: "GET",
      url: "/v1/bookings/1/access",
      headers: { Authorization: `Bearer ${loginBody.accessToken}` },
    });
    expect(denied.statusCode).toBe(401);
    const deniedBody = JSON.parse(denied.payload);
    expect(deniedBody.code).toBe("step_up_required");

    const freshStepUpToken = server.jwt.sign({
      userId: host.id,
      email: host.email,
      roles: host.roles,
      typ: "access",
      stepUpRequired: true,
      stepUpVerifiedAt: Math.floor(Date.now() / 1000),
    });

    const allowed = await server.inject({
      method: "GET",
      url: "/v1/bookings/1/access",
      headers: { Authorization: `Bearer ${freshStepUpToken}` },
    });
    expect(allowed.statusCode).toBe(200);
  });
});
