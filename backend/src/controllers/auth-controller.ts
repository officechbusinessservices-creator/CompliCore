import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { env } from "../lib/env";
import {
  clearPasswordResetToken,
  createUser,
  createPasswordResetToken,
  findUserByEmail,
  findUserById,
  findUserByPasswordResetToken,
  hashPassword,
  userNeedsPrivilegedStepUp,
  updateUserPassword,
  userHasAnyRole,
  verifyPassword,
} from "../lib/secure-user-model";
import { Email } from "../utils/email";
import { verifyTokenWithRotation } from "../lib/jwt-rotation";
import { appendSecurityAuditEvent } from "../lib/security-audit";
import {
  createAuthenticationOptionsForUser,
  createRegistrationOptionsForUser,
  hasWebAuthnCredentials,
  isStepUpSatisfied,
  isWebAuthnMfaEnabled,
  verifyAuthenticationForUser,
  verifyRegistrationForUser,
} from "../lib/webauthn-stepup";

type RegisterBody = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type LoginBody = {
  email: string;
  password: string;
};

type ForgotPasswordBody = {
  email: string;
};

type ResetPasswordBody = {
  password: string;
};

type LoginThrottleState = {
  failures: number;
  windowStartMs: number;
  lockedUntilMs: number;
};

type LastLoginRecord = {
  atMs: number;
  ip: string;
  country: string | null;
};

const loginThrottleByKey = new Map<string, LoginThrottleState>();
const lastLoginByEmail = new Map<string, LastLoginRecord>();

function lockoutWindowMs() {
  return env.AUTH_LOCKOUT_WINDOW_SECONDS * 1000;
}

function lockoutDurationMs() {
  return env.AUTH_LOCKOUT_DURATION_SECONDS * 1000;
}

function impossibleTravelWindowMs() {
  return env.LOGIN_IMPOSSIBLE_TRAVEL_WINDOW_SECONDS * 1000;
}

function throttleKey(email: string, ip: string) {
  return `${email.toLowerCase()}|${ip || "unknown"}`;
}

function getActiveLockoutMs(key: string, nowMs: number) {
  const state = loginThrottleByKey.get(key);
  if (!state) return 0;
  if (state.lockedUntilMs > nowMs) return state.lockedUntilMs - nowMs;
  return 0;
}

function registerFailedAttempt(key: string, nowMs: number) {
  const existing = loginThrottleByKey.get(key);
  if (!existing || nowMs - existing.windowStartMs > lockoutWindowMs()) {
    const lockedUntilMs =
      env.AUTH_MAX_FAILED_ATTEMPTS <= 1 ? nowMs + lockoutDurationMs() : 0;
    const next = { failures: 1, windowStartMs: nowMs, lockedUntilMs };
    loginThrottleByKey.set(key, next);
    return next;
  }

  const failures = existing.failures + 1;
  const lockedUntilMs =
    failures >= env.AUTH_MAX_FAILED_ATTEMPTS
      ? nowMs + lockoutDurationMs()
      : existing.lockedUntilMs;
  const next = { ...existing, failures, lockedUntilMs };
  loginThrottleByKey.set(key, next);
  return next;
}

function clearFailedAttempts(key: string) {
  loginThrottleByKey.delete(key);
}

function resolveRequestCountry(request: FastifyRequest) {
  const countryHeader =
    request.headers["x-vercel-ip-country"] ||
    request.headers["cf-ipcountry"] ||
    request.headers["x-country-code"];
  if (typeof countryHeader !== "string") return null;

  const normalized = countryHeader.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return null;
  return normalized;
}

function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    domain: env.COOKIE_DOMAIN || undefined,
    path: "/",
    maxAge: maxAgeSeconds,
  } as const;
}

function resolvePublicApiBaseUrl(request: FastifyRequest) {
  if (env.PUBLIC_API_BASE_URL) {
    const trimmed = env.PUBLIC_API_BASE_URL.replace(/\/+$/, "");
    return trimmed.endsWith("/v1") ? trimmed.slice(0, -3) : trimmed;
  }

  const host = request.headers.host || `localhost:${env.PORT}`;
  const protocol = env.COOKIE_SECURE ? "https" : "http";
  return `${protocol}://${host}`;
}

function bearerTokenFromHeader(request: FastifyRequest) {
  const header = request.headers.authorization;
  if (!header || typeof header !== "string") return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function accessTokenFromRequest(request: FastifyRequest) {
  const bearer = bearerTokenFromHeader(request);
  if (bearer) return bearer;
  const cookies = request.cookies as Record<string, string | undefined>;
  return cookies[env.ACCESS_TOKEN_COOKIE_NAME] || null;
}

function shouldRequireStepUpForUserRoles(userRoles: string[]) {
  return userRoles.some((role) => role === "host" || role === "admin");
}

type BuildAuthResponseOptions = {
  stepUpRequired?: boolean;
  stepUpVerifiedAt?: number;
};

function buildAuthResponse(
  fastify: FastifyInstance,
  user: any,
  options: BuildAuthResponseOptions = {},
) {
  const accessPayload: Record<string, unknown> = {
    userId: user.id,
    email: user.email,
    roles: user.roles || ["guest"],
    typ: "access",
    stepUpRequired: options.stepUpRequired === true,
  };
  if (typeof options.stepUpVerifiedAt === "number") {
    accessPayload.stepUpVerifiedAt = options.stepUpVerifiedAt;
  }

  const accessToken = (fastify as any).jwt.sign(
    accessPayload,
    {
      expiresIn: `${env.ACCESS_TOKEN_TTL_SECONDS}s`,
    },
  );

  const refreshToken = (fastify as any).jwt.sign(
    { userId: user.id, typ: "refresh" },
    {
      expiresIn: `${env.REFRESH_TOKEN_TTL_SECONDS}s`,
    },
  );

  return {
    accessToken,
    token: accessToken,
    refreshToken,
    expiresIn: env.ACCESS_TOKEN_TTL_SECONDS,
    user,
  };
}

function attachAuthCookies(reply: FastifyReply, auth: ReturnType<typeof buildAuthResponse>) {
  reply
    .setCookie(env.ACCESS_TOKEN_COOKIE_NAME, auth.accessToken, cookieOptions(env.ACCESS_TOKEN_TTL_SECONDS))
    .setCookie(env.REFRESH_TOKEN_COOKIE_NAME, auth.refreshToken, cookieOptions(env.REFRESH_TOKEN_TTL_SECONDS));
}

export function createAuthController(fastify: FastifyInstance) {
  function resolveAuthenticatedUser(request: FastifyRequest) {
    const accessToken = accessTokenFromRequest(request);
    if (!accessToken) return null;

    let payload: any;
    try {
      payload = verifyTokenWithRotation(fastify, accessToken);
    } catch {
      return null;
    }

    if (payload?.typ !== "access" || !payload?.userId) return null;
    const userRecord = findUserById(payload.userId);
    if (!userRecord) return null;

    return { payload, userRecord };
  }

  function authUserResponse(record: any) {
    return {
      id: record.id,
      email: record.email,
      firstName: record.firstName,
      lastName: record.lastName,
      displayName: `${record.firstName} ${record.lastName}`,
      roles: record.roles,
      createdAt: record.createdAt,
    };
  }

  function stepUpRequiredForRecord(record: any) {
    return (
      isWebAuthnMfaEnabled() &&
      userNeedsPrivilegedStepUp(record) &&
      shouldRequireStepUpForUserRoles(record.roles || [])
    );
  }

  function requirePrivilegedAuthUser(request: FastifyRequest, reply: FastifyReply) {
    const auth = resolveAuthenticatedUser(request);
    if (!auth) {
      reply.status(401).send({ error: "unauthorized" });
      return null;
    }

    if (!shouldRequireStepUpForUserRoles(auth.userRecord.roles || [])) {
      reply.status(403).send({ error: "forbidden" });
      return null;
    }

    return auth;
  }

  return {
    async signup(request: FastifyRequest, reply: FastifyReply, body: RegisterBody) {
      const email = body.email.toLowerCase();
      if (findUserByEmail(email)) {
        return reply.status(409).send({ error: "user already exists" });
      }

      const passwordHash = await hashPassword(body.password);
      const record = createUser({
        email,
        firstName: body.firstName,
        lastName: body.lastName,
        roles: ["guest"],
        passwordHash,
      });

      const user = authUserResponse(record);
      const stepUpRequired = stepUpRequiredForRecord(record);

      const auth = buildAuthResponse(fastify, user, {
        stepUpRequired,
      });
      attachAuthCookies(reply, auth);

      const lifecycleEmails = (fastify as any).lifecycleEmails;
      if (lifecycleEmails?.enrollTrial) {
        lifecycleEmails.enrollTrial({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          enrolledAt: user.createdAt,
        });
      }

      void appendSecurityAuditEvent({
        eventType: "auth_signup_created",
        severity: "info",
        actorUserId: user.id,
        actorEmail: user.email,
        ip: request.ip,
        traceId: request.id,
      });

      return reply.status(201).send({ message: "registered", ...auth });
    },

    async login(request: FastifyRequest, reply: FastifyReply, body: LoginBody) {
      const email = body.email.toLowerCase();
      const nowMs = Date.now();
      const key = throttleKey(email, request.ip);
      const lockedForMs = getActiveLockoutMs(key, nowMs);
      if (lockedForMs > 0) {
        const retryAt = new Date(nowMs + lockedForMs).toISOString();
        request.log.warn(
          { email, ip: request.ip, retryAt },
          "[SECURITY ALERT] login blocked by temporary lockout",
        );
        void appendSecurityAuditEvent({
          eventType: "auth_login_locked",
          severity: "warn",
          actorEmail: email,
          ip: request.ip,
          traceId: request.id,
          details: { retryAt },
        });
        return reply.status(429).send({ error: "account temporarily locked", retryAt });
      }

      const record = findUserByEmail(email);

      if (!record) {
        const next = registerFailedAttempt(key, nowMs);
        const retryAt =
          next.lockedUntilMs > nowMs
            ? new Date(next.lockedUntilMs).toISOString()
            : null;
        request.log.warn({ email, ip: request.ip, reason: "user_not_found" }, "[SECURITY ALERT] failed login attempt");
        void appendSecurityAuditEvent({
          eventType: "auth_login_failed",
          severity: "warn",
          actorEmail: email,
          ip: request.ip,
          traceId: request.id,
          details: { reason: "user_not_found", attempts: next.failures, retryAt },
        });
        if (retryAt) return reply.status(429).send({ error: "account temporarily locked", retryAt });
        return reply.status(401).send({ error: "invalid credentials" });
      }

      const verified = await verifyPassword(record.passwordHash, body.password);
      if (!verified) {
        const next = registerFailedAttempt(key, nowMs);
        const retryAt =
          next.lockedUntilMs > nowMs
            ? new Date(next.lockedUntilMs).toISOString()
            : null;
        request.log.warn(
          { email, ip: request.ip, reason: "password_mismatch" },
          "[SECURITY ALERT] failed login attempt",
        );
        void appendSecurityAuditEvent({
          eventType: "auth_login_failed",
          severity: "warn",
          actorUserId: record.id,
          actorEmail: email,
          ip: request.ip,
          traceId: request.id,
          details: { reason: "password_mismatch", attempts: next.failures, retryAt },
        });
        if (retryAt) return reply.status(429).send({ error: "account temporarily locked", retryAt });
        return reply.status(401).send({ error: "invalid credentials" });
      }

      clearFailedAttempts(key);

      const user = authUserResponse(record);
      const stepUpRequired = stepUpRequiredForRecord(record);
      const enrolled = hasWebAuthnCredentials(record.id);
      const auth = buildAuthResponse(fastify, user, {
        stepUpRequired,
      });
      attachAuthCookies(reply, auth);

      const country = resolveRequestCountry(request);
      const prior = lastLoginByEmail.get(email);
      if (
        prior &&
        prior.country &&
        country &&
        prior.country !== country &&
        nowMs - prior.atMs <= impossibleTravelWindowMs()
      ) {
        request.log.warn(
          {
            email,
            ip: request.ip,
            priorCountry: prior.country,
            currentCountry: country,
            priorIp: prior.ip,
          },
          "[SECURITY ALERT] impossible travel pattern detected",
        );
        void appendSecurityAuditEvent({
          eventType: "auth_impossible_travel_suspected",
          severity: "critical",
          actorUserId: user.id,
          actorEmail: user.email,
          ip: request.ip,
          traceId: request.id,
          details: {
            priorCountry: prior.country,
            currentCountry: country,
            priorIp: prior.ip,
          },
        });
      }

      lastLoginByEmail.set(email, {
        atMs: nowMs,
        ip: request.ip || "unknown",
        country,
      });

      void appendSecurityAuditEvent({
        eventType: "auth_login_success",
        severity: "info",
        actorUserId: user.id,
        actorEmail: user.email,
        ip: request.ip,
        traceId: request.id,
        details: {
          stepUpRequired,
          webauthnEnrolled: enrolled,
        },
      });

      return reply.send({
        message: "logged in",
        ...auth,
        mfa: {
          required: stepUpRequired,
          enrolled,
          methods: enrolled ? ["webauthn"] : [],
        },
      });
    },

    async refresh(request: FastifyRequest, reply: FastifyReply, providedToken?: string) {
      const cookieToken = (request.cookies as Record<string, string | undefined>)[env.REFRESH_TOKEN_COOKIE_NAME];
      const token = providedToken || cookieToken;

      if (!token) {
        return reply.status(401).send({ error: "refresh token required" });
      }

      let decoded: any;
      try {
        decoded = verifyTokenWithRotation(fastify, token);
      } catch {
        return reply.status(401).send({ error: "invalid refresh token" });
      }

      if (decoded?.typ !== "refresh" || !decoded?.userId) {
        return reply.status(401).send({ error: "invalid refresh token" });
      }

      const record = findUserById(decoded.userId);
      if (!record) {
        return reply.status(401).send({ error: "invalid refresh token" });
      }

      const user = authUserResponse(record);
      const auth = buildAuthResponse(fastify, user, {
        stepUpRequired: stepUpRequiredForRecord(record),
      });
      attachAuthCookies(reply, auth);

      return reply.send({ message: "refreshed", ...auth });
    },

    async logout(reply: FastifyReply) {
      reply
        .clearCookie(env.ACCESS_TOKEN_COOKIE_NAME, { path: "/", domain: env.COOKIE_DOMAIN || undefined })
        .clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, { path: "/", domain: env.COOKIE_DOMAIN || undefined });
      return reply.send({ message: "logged out" });
    },

    async me(request: FastifyRequest, reply: FastifyReply) {
      const auth = resolveAuthenticatedUser(request);
      if (!auth) {
        return reply.status(401).send({ error: "unauthorized" });
      }
      const { payload, userRecord: record } = auth;

      return reply.send({
        id: record.id,
        email: record.email,
        firstName: record.firstName,
        lastName: record.lastName,
        roles: record.roles,
        displayName: `${record.firstName} ${record.lastName}`,
        mfa: {
          required: payload.stepUpRequired === true,
          verified: isStepUpSatisfied(payload),
          enrolled: hasWebAuthnCredentials(record.id),
        },
      });
    },

    async forgotPassword(request: FastifyRequest, reply: FastifyReply, body: ForgotPasswordBody) {
      const email = body.email.toLowerCase();
      const user = findUserByEmail(email);

      if (!user) {
        void appendSecurityAuditEvent({
          eventType: "auth_forgot_password_unknown_email",
          severity: "warn",
          actorEmail: email,
          ip: request.ip,
          traceId: request.id,
        });
        return reply.status(404).send({ message: "No user found with that email." });
      }

      const reset = createPasswordResetToken(user.id);
      if (!reset) {
        return reply.status(500).send({ message: "Failed to create reset token" });
      }

      const baseUrl = resolvePublicApiBaseUrl(request);
      const resetURL = `${baseUrl}/v1/auth/reset-password/${reset.resetToken}`;

      try {
        await new Email(
          {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          resetURL,
        ).sendPasswordReset();

        request.log.info({ email, resetExpiresAt: reset.expiresAt }, "password reset email sent");
        void appendSecurityAuditEvent({
          eventType: "auth_forgot_password_sent",
          severity: "info",
          actorUserId: user.id,
          actorEmail: user.email,
          ip: request.ip,
          traceId: request.id,
        });

        return reply.send({
          status: "success",
          message: "Token sent to email!",
        });
      } catch (error) {
        clearPasswordResetToken(user.id);
        request.log.error({ email, err: error }, "failed to send password reset email");
        void appendSecurityAuditEvent({
          eventType: "auth_forgot_password_send_failed",
          severity: "warn",
          actorUserId: user.id,
          actorEmail: user.email,
          ip: request.ip,
          traceId: request.id,
        });

        return reply.status(500).send({
          status: "error",
          message: "Error sending email. Try again later.",
        });
      }
    },

    async resetPassword(request: FastifyRequest, reply: FastifyReply, token: string, body: ResetPasswordBody) {
      const user = findUserByPasswordResetToken(token);
      if (!user) {
        return reply.status(400).send({ message: "Token is invalid or has expired." });
      }

      const passwordHash = await hashPassword(body.password);
      const updated = updateUserPassword(user.id, passwordHash);

      if (!updated) {
        return reply.status(500).send({ message: "Unable to update password" });
      }

      const authUser = authUserResponse(updated);
      const auth = buildAuthResponse(fastify, authUser, {
        stepUpRequired: stepUpRequiredForRecord(updated),
      });
      attachAuthCookies(reply, auth);

      void appendSecurityAuditEvent({
        eventType: "auth_password_reset_success",
        severity: "info",
        actorUserId: authUser.id,
        actorEmail: authUser.email,
        ip: request.ip,
        traceId: request.id,
      });

      return reply.send({
        status: "success",
        message: "Password reset successful",
        ...auth,
      });
    },

    async mfaStepUpStatus(request: FastifyRequest, reply: FastifyReply) {
      const auth = resolveAuthenticatedUser(request);
      if (!auth) return reply.status(401).send({ error: "unauthorized" });

      const roles = auth.userRecord.roles || [];
      const privileged = shouldRequireStepUpForUserRoles(roles);
      const requiresStepUp = auth.payload.stepUpRequired === true && privileged;
      const verifiedAt = Number(auth.payload.stepUpVerifiedAt || 0);
      const nowSeconds = Math.floor(Date.now() / 1000);
      const remainingSeconds =
        verifiedAt > 0 ? Math.max(0, env.MFA_STEP_UP_TTL_SECONDS - (nowSeconds - verifiedAt)) : 0;

      return reply.send({
        enabled: isWebAuthnMfaEnabled(),
        required: requiresStepUp,
        verified: isStepUpSatisfied(auth.payload),
        enrolled: hasWebAuthnCredentials(auth.userRecord.id),
        stepUpTtlSeconds: env.MFA_STEP_UP_TTL_SECONDS,
        stepUpRemainingSeconds: remainingSeconds,
      });
    },

    async webauthnRegistrationOptions(request: FastifyRequest, reply: FastifyReply) {
      if (!isWebAuthnMfaEnabled()) {
        return reply.status(404).send({ error: "webauthn mfa is disabled" });
      }

      const auth = requirePrivilegedAuthUser(request, reply);
      if (!auth) return;

      let options: any;
      try {
        options = await createRegistrationOptionsForUser(auth.userRecord);
      } catch (err) {
        request.log.warn({ err, userId: auth.userRecord.id }, "failed to create WebAuthn registration options");
        return reply.status(500).send({ error: "unable to create webauthn registration challenge" });
      }
      void appendSecurityAuditEvent({
        eventType: "auth_mfa_webauthn_registration_challenge_created",
        severity: "info",
        actorUserId: auth.userRecord.id,
        actorEmail: auth.userRecord.email,
        ip: request.ip,
        traceId: request.id,
      });

      return reply.send({ options });
    },

    async webauthnRegistrationVerify(
      request: FastifyRequest,
      reply: FastifyReply,
      response: any,
    ) {
      if (!isWebAuthnMfaEnabled()) {
        return reply.status(404).send({ error: "webauthn mfa is disabled" });
      }

      const auth = requirePrivilegedAuthUser(request, reply);
      if (!auth) return;

      let verification: Awaited<ReturnType<typeof verifyRegistrationForUser>>;
      try {
        verification = await verifyRegistrationForUser(auth.userRecord, response);
      } catch (err) {
        request.log.warn({ err, userId: auth.userRecord.id }, "WebAuthn registration verification threw");
        return reply.status(400).send({ error: "invalid webauthn registration response" });
      }
      if (!verification.verified) {
        void appendSecurityAuditEvent({
          eventType: "auth_mfa_webauthn_registration_failed",
          severity: "warn",
          actorUserId: auth.userRecord.id,
          actorEmail: auth.userRecord.email,
          ip: request.ip,
          traceId: request.id,
          details: { reason: verification.reason },
        });
        return reply.status(400).send({ error: verification.reason });
      }

      void appendSecurityAuditEvent({
        eventType: "auth_mfa_webauthn_registration_verified",
        severity: "info",
        actorUserId: auth.userRecord.id,
        actorEmail: auth.userRecord.email,
        ip: request.ip,
        traceId: request.id,
        details: { credentialId: verification.credentialId },
      });

      return reply.send({
        verified: true,
        credentialId: verification.credentialId,
      });
    },

    async webauthnAuthenticationOptions(request: FastifyRequest, reply: FastifyReply) {
      if (!isWebAuthnMfaEnabled()) {
        return reply.status(404).send({ error: "webauthn mfa is disabled" });
      }

      const auth = requirePrivilegedAuthUser(request, reply);
      if (!auth) return;

      let options: Awaited<ReturnType<typeof createAuthenticationOptionsForUser>>;
      try {
        options = await createAuthenticationOptionsForUser(auth.userRecord);
      } catch (err) {
        request.log.warn({ err, userId: auth.userRecord.id }, "failed to create WebAuthn auth options");
        return reply.status(500).send({ error: "unable to create webauthn authentication challenge" });
      }
      if (!options) {
        return reply.status(409).send({
          error: "webauthn credentials are not enrolled",
          code: "webauthn_not_enrolled",
        });
      }

      void appendSecurityAuditEvent({
        eventType: "auth_mfa_webauthn_auth_challenge_created",
        severity: "info",
        actorUserId: auth.userRecord.id,
        actorEmail: auth.userRecord.email,
        ip: request.ip,
        traceId: request.id,
      });

      return reply.send({ options });
    },

    async webauthnAuthenticationVerify(
      request: FastifyRequest,
      reply: FastifyReply,
      response: any,
    ) {
      if (!isWebAuthnMfaEnabled()) {
        return reply.status(404).send({ error: "webauthn mfa is disabled" });
      }

      const auth = requirePrivilegedAuthUser(request, reply);
      if (!auth) return;

      let verification: Awaited<ReturnType<typeof verifyAuthenticationForUser>>;
      try {
        verification = await verifyAuthenticationForUser(auth.userRecord, response);
      } catch (err) {
        request.log.warn({ err, userId: auth.userRecord.id }, "WebAuthn step-up verification threw");
        return reply.status(400).send({ error: "invalid webauthn authentication response" });
      }
      if (!verification.verified) {
        void appendSecurityAuditEvent({
          eventType: "auth_mfa_webauthn_step_up_failed",
          severity: "warn",
          actorUserId: auth.userRecord.id,
          actorEmail: auth.userRecord.email,
          ip: request.ip,
          traceId: request.id,
          details: { reason: verification.reason },
        });
        return reply.status(400).send({ error: verification.reason });
      }

      const nowSeconds = Math.floor(Date.now() / 1000);
      const user = authUserResponse(auth.userRecord);
      const authTokens = buildAuthResponse(fastify, user, {
        stepUpRequired: stepUpRequiredForRecord(auth.userRecord),
        stepUpVerifiedAt: nowSeconds,
      });
      attachAuthCookies(reply, authTokens);

      void appendSecurityAuditEvent({
        eventType: "auth_mfa_webauthn_step_up_verified",
        severity: "info",
        actorUserId: auth.userRecord.id,
        actorEmail: auth.userRecord.email,
        ip: request.ip,
        traceId: request.id,
        details: { credentialId: verification.credentialId },
      });

      return reply.send({
        message: "step-up verified",
        ...authTokens,
        mfa: {
          required: true,
          verified: true,
          enrolled: true,
        },
      });
    },

    async requireRoles(request: FastifyRequest, reply: FastifyReply, allowedRoles: string[]) {
      const accessToken = accessTokenFromRequest(request);
      if (!accessToken) {
        return reply.status(401).send({ error: "unauthorized" });
      }

      let payload: any;
      try {
        payload = verifyTokenWithRotation(fastify, accessToken);
      } catch {
        return reply.status(401).send({ error: "unauthorized" });
      }

      if (payload?.typ !== "access" || !payload?.userId) {
        return reply.status(401).send({ error: "unauthorized" });
      }

      const record = findUserById(payload.userId);
      if (!record) {
        return reply.status(401).send({ error: "unauthorized" });
      }

      if (!userHasAnyRole(record, allowedRoles)) {
        return reply.status(403).send({ error: "forbidden" });
      }

      if (
        shouldRequireStepUpForUserRoles(record.roles || []) &&
        payload.stepUpRequired === true &&
        !isStepUpSatisfied(payload)
      ) {
        return reply.status(401).send({ error: "step-up required", code: "step_up_required" });
      }

      return null;
    },
  };
}
