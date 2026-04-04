import { FastifyInstance } from "fastify";
import { z } from "zod";
import { formatZodError } from "../lib/validation";
import { createAuthController } from "../controllers/auth-controller";

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only include letters, numbers, and underscore");

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  username: usernameSchema.optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10, "refreshToken is required").optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const webauthnVerificationSchema = z.object({
  response: z.any(),
});

export default async function authRoutes(fastify: FastifyInstance) {
  const authController = createAuthController(fastify);

  fastify.post(
    "/auth/register",
    {
      config: {
        rateLimit: { max: 20, timeWindow: "1 minute" },
      },
    },
    async (request, reply) => {
      const parsed = registerSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          type: "urn:problem:validation",
          title: "Request validation failed",
          status: 400,
          detail: "Invalid register payload",
          errors: formatZodError(parsed.error),
          instance: request.url,
          traceId: request.id,
        });
      }

      return authController.signup(request, reply, parsed.data);
    },
  );

  fastify.post(
    "/auth/login",
    {
      config: {
        rateLimit: { max: 12, timeWindow: "1 minute" },
      },
    },
    async (request, reply) => {
      const parsed = loginSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          type: "urn:problem:validation",
          title: "Request validation failed",
          status: 400,
          detail: "Invalid login payload",
          errors: formatZodError(parsed.error),
          instance: request.url,
          traceId: request.id,
        });
      }

      return authController.login(request, reply, parsed.data);
    },
  );

  fastify.post("/auth/refresh", async (request, reply) => {
    const parsed = refreshSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid refresh payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }
    return authController.refresh(request, reply, parsed.data.refreshToken);
  });

  fastify.post("/auth/logout", async (_request, reply) => {
    return authController.logout(reply);
  });

  fastify.get("/auth/mfa/step-up/status", async (request, reply) => {
    return authController.mfaStepUpStatus(request, reply);
  });

  fastify.post(
    "/auth/mfa/webauthn/register/options",
    {
      config: {
        rateLimit: { max: 20, timeWindow: "1 minute" },
      },
    },
    async (request, reply) => {
      return authController.webauthnRegistrationOptions(request, reply);
    },
  );

  fastify.post(
    "/auth/mfa/webauthn/register/verify",
    {
      config: {
        rateLimit: { max: 20, timeWindow: "1 minute" },
      },
    },
    async (request, reply) => {
      const parsed = webauthnVerificationSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          type: "urn:problem:validation",
          title: "Request validation failed",
          status: 400,
          detail: "Invalid WebAuthn registration verify payload",
          errors: formatZodError(parsed.error),
          instance: request.url,
          traceId: request.id,
        });
      }
      return authController.webauthnRegistrationVerify(request, reply, parsed.data.response);
    },
  );

  fastify.post(
    "/auth/mfa/webauthn/auth/options",
    {
      config: {
        rateLimit: { max: 30, timeWindow: "1 minute" },
      },
    },
    async (request, reply) => {
      return authController.webauthnAuthenticationOptions(request, reply);
    },
  );

  fastify.post(
    "/auth/mfa/webauthn/auth/verify",
    {
      config: {
        rateLimit: { max: 30, timeWindow: "1 minute" },
      },
    },
    async (request, reply) => {
      const parsed = webauthnVerificationSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          type: "urn:problem:validation",
          title: "Request validation failed",
          status: 400,
          detail: "Invalid WebAuthn authentication verify payload",
          errors: formatZodError(parsed.error),
          instance: request.url,
          traceId: request.id,
        });
      }
      return authController.webauthnAuthenticationVerify(request, reply, parsed.data.response);
    },
  );

  fastify.post(
    "/auth/forgot-password",
    {
      config: {
        rateLimit: { max: 8, timeWindow: "1 minute" },
      },
    },
    async (request, reply) => {
      const parsed = forgotPasswordSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          type: "urn:problem:validation",
          title: "Request validation failed",
          status: 400,
          detail: "Invalid forgot-password payload",
          errors: formatZodError(parsed.error),
          instance: request.url,
          traceId: request.id,
        });
      }

      return authController.forgotPassword(request, reply, parsed.data);
    },
  );

  fastify.post("/auth/reset-password/:token", async (request, reply) => {
    const parsed = resetPasswordSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid reset-password payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const token = (request.params as { token?: string }).token;
    if (!token) {
      return reply.status(400).send({ error: "reset token is required" });
    }

    return authController.resetPassword(request, reply, token, parsed.data);
  });

  // Backward compatible dev endpoint
  fastify.get("/auth/me", async (request, reply) => {
    return authController.me(request, reply);
  });

  fastify.get("/auth/admin/ping", async (request, reply) => {
    const guard = await authController.requireRoles(request, reply, ["admin"]);
    if (guard) return guard;

    return reply.send({ ok: true, scope: "admin" });
  });
}
