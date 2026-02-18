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
  updateUserPassword,
  userHasAnyRole,
  verifyPassword,
} from "../lib/secure-user-model";
import { Email } from "../utils/email";
import { verifyTokenWithRotation } from "../lib/jwt-rotation";

type RegisterBody = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "guest" | "host" | "enterprise" | "admin";
};

type LoginBody = {
  email: string;
  password: string;
  role?: "guest" | "host" | "enterprise" | "admin";
};

type ForgotPasswordBody = {
  email: string;
};

type ResetPasswordBody = {
  password: string;
};

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

function buildAuthResponse(fastify: FastifyInstance, user: any) {
  const accessToken = (fastify as any).jwt.sign(
    {
      userId: user.id,
      email: user.email,
      roles: user.roles || ["guest"],
      typ: "access",
    },
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
        roles: body.role ? [body.role] : ["guest"],
        passwordHash,
      });

      const user = {
        id: record.id,
        email: record.email,
        firstName: record.firstName,
        lastName: record.lastName,
        displayName: `${record.firstName} ${record.lastName}`,
        roles: record.roles,
        createdAt: record.createdAt,
      };

      const auth = buildAuthResponse(fastify, user);
      attachAuthCookies(reply, auth);

      return reply.status(201).send({ message: "registered", ...auth });
    },

    async login(request: FastifyRequest, reply: FastifyReply, body: LoginBody) {
      const email = body.email.toLowerCase();
      const record = findUserByEmail(email);

      if (!record) {
        request.log.warn({ email, ip: request.ip, reason: "user_not_found" }, "[SECURITY ALERT] failed login attempt");
        return reply.status(401).send({ error: "invalid credentials" });
      }

      const verified = await verifyPassword(record.passwordHash, body.password);
      if (!verified) {
        request.log.warn(
          { email, ip: request.ip, reason: "password_mismatch" },
          "[SECURITY ALERT] failed login attempt",
        );
        return reply.status(401).send({ error: "invalid credentials" });
      }

      const user = {
        id: record.id,
        email: record.email,
        firstName: record.firstName,
        lastName: record.lastName,
        displayName: `${record.firstName} ${record.lastName}`,
        roles: body.role ? [body.role] : record.roles,
        createdAt: record.createdAt,
      };

      const auth = buildAuthResponse(fastify, user);
      attachAuthCookies(reply, auth);

      return reply.send({ message: "logged in", ...auth });
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

      const user = {
        id: record.id,
        email: record.email,
        firstName: record.firstName,
        lastName: record.lastName,
        displayName: `${record.firstName} ${record.lastName}`,
        roles: record.roles,
        createdAt: record.createdAt,
      };

      const auth = buildAuthResponse(fastify, user);
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
      const accessToken = (request.cookies as Record<string, string | undefined>)[env.ACCESS_TOKEN_COOKIE_NAME];
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

      return reply.send({
        id: record.id,
        email: record.email,
        firstName: record.firstName,
        lastName: record.lastName,
        roles: record.roles,
        displayName: `${record.firstName} ${record.lastName}`,
      });
    },

    async forgotPassword(request: FastifyRequest, reply: FastifyReply, body: ForgotPasswordBody) {
      const email = body.email.toLowerCase();
      const user = findUserByEmail(email);

      if (!user) {
        return reply.status(404).send({ message: "No user found with that email." });
      }

      const reset = createPasswordResetToken(user.id);
      if (!reset) {
        return reply.status(500).send({ message: "Failed to create reset token" });
      }

      const host = request.headers.host || "localhost:4000";
      const protocol = env.COOKIE_SECURE ? "https" : "http";
      const resetURL = `${protocol}://${host}/api/v1/auth/reset-password/${reset.resetToken}`;

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

        return reply.send({
          status: "success",
          message: "Token sent to email!",
        });
      } catch (error) {
        clearPasswordResetToken(user.id);
        request.log.error({ email, err: error }, "failed to send password reset email");

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

      const authUser = {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        displayName: `${updated.firstName} ${updated.lastName}`,
        roles: updated.roles,
        createdAt: updated.createdAt,
      };

      const auth = buildAuthResponse(fastify, authUser);
      attachAuthCookies(reply, auth);

      return reply.send({
        status: "success",
        message: "Password reset successful",
        ...auth,
      });
    },

    async requireRoles(request: FastifyRequest, reply: FastifyReply, allowedRoles: string[]) {
      const accessToken = (request.cookies as Record<string, string | undefined>)[env.ACCESS_TOKEN_COOKIE_NAME];
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

      return null;
    },
  };
}
