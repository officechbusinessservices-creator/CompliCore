import Fastify, { FastifyInstance } from "fastify";
import jwt from "@fastify/jwt";
import { env } from "./lib/env";
import requestContext from "./plugins/request-context";
import securityFortress from "./plugins/security-fortress";
import observability from "./plugins/observability";
import idempotency from "./plugins/idempotency";
import errorHandler from "./plugins/error-handler";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import bookingsRoutes from "./routes/bookings";
import listingsRoutes from "./routes/listings";
import paymentsRoutes from "./routes/payments";
import messagesRoutes from "./routes/messages";
import propertiesRoutes from "./routes/properties";
import reviewsRoutes from "./routes/reviews";
import analyticsRoutes from "./routes/analytics";
import aiRoutes from "./routes/ai";
import pmsRoutes from "./routes/pms";
import pmsConnectorRoutes from "./routes/pms-connectors";
import moduleRoutes from "./routes/modules";
import economicRoutes from "./routes/economic";
import agenticMeshRoutes from "./routes/agentic-mesh";
import lifecycleEmailRoutes from "./routes/lifecycle-email";
import distributionRoutes from "./routes/distribution";
import { createLifecycleEmailAutomation } from "./lib/lifecycle-email-automation";
import { appendSecurityAuditEvent } from "./lib/security-audit";
import { isStepUpSatisfied } from "./lib/webauthn-stepup";
import { initializeFieldEncryptionKey } from "./lib/encryption";

const API_DEPRECATION_SUNSET = "Wed, 31 Dec 2026 23:59:59 GMT";

async function registerApiRoutes(fastify: FastifyInstance, prefix: "/api" | "/v1") {
  await fastify.register(authRoutes, { prefix });
  await fastify.register(usersRoutes, { prefix });
  await fastify.register(bookingsRoutes, { prefix });
  await fastify.register(listingsRoutes, { prefix });
  await fastify.register(paymentsRoutes, { prefix });
  await fastify.register(messagesRoutes, { prefix });
  await fastify.register(propertiesRoutes, { prefix });
  await fastify.register(reviewsRoutes, { prefix });
  await fastify.register(analyticsRoutes, { prefix });
  await fastify.register(aiRoutes, { prefix });
  await fastify.register(pmsRoutes, { prefix });
  await fastify.register(pmsConnectorRoutes, { prefix });
  await fastify.register(moduleRoutes, { prefix });
  await fastify.register(economicRoutes, { prefix });
  await fastify.register(agenticMeshRoutes, { prefix });
  await fastify.register(lifecycleEmailRoutes, { prefix });
  await fastify.register(distributionRoutes, { prefix });
}

export async function buildServer() {
  await initializeFieldEncryptionKey();

  const fastify = Fastify({
    logger: {
      level: "info",
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "req.body.password",
          "req.body.accessToken",
          "req.body.refreshToken",
          "req.body.token",
        ],
        remove: true,
      },
    },
  });

  await fastify.register(requestContext);
  await fastify.register(securityFortress);
  await fastify.register(observability);
  await fastify.register(idempotency);
  await fastify.register(errorHandler);
  await fastify.register(jwt, { secret: env.JWT_SECRET });

  fastify.get("/", async () => ({ status: "ok", service: "complicore-backend" }));
  fastify.get("/health", async () => ({ status: "ok" }));
  fastify.get("/health/ready", async () => ({ status: "ready" }));
  fastify.addHook("onRequest", async (request, reply) => {
    if (request.url === "/api" || request.url.startsWith("/api/")) {
      reply.header("Deprecation", "true");
      reply.header("Sunset", API_DEPRECATION_SUNSET);
    }
  });

  fastify.decorate("authenticate", async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: "unauthorized" });
    }
  });

  fastify.decorate("requireRole", async function (request: any, reply: any, roles: string[]) {
    try {
      await request.jwtVerify();
      const userRoles = request.user?.roles || ["guest"];
      if (!roles.some((r) => userRoles.includes(r))) {
        void appendSecurityAuditEvent({
          eventType: "rbac_access_denied",
          severity: "warn",
          actorUserId: request.user?.userId,
          actorEmail: request.user?.email,
          ip: request.ip,
          traceId: request.id,
          details: { requiredRoles: roles, actualRoles: userRoles },
        });
        return reply.status(403).send({ error: "forbidden" });
      }

      const routeNeedsPrivilegedStepUp = roles.some((role) => role === "host" || role === "admin");
      if (
        routeNeedsPrivilegedStepUp &&
        request.user?.stepUpRequired === true &&
        !isStepUpSatisfied(request.user)
      ) {
        void appendSecurityAuditEvent({
          eventType: "auth_step_up_required",
          severity: "warn",
          actorUserId: request.user?.userId,
          actorEmail: request.user?.email,
          ip: request.ip,
          traceId: request.id,
          details: {
            requiredRoles: roles,
            actualRoles: userRoles,
          },
        });
        return reply.status(401).send({ error: "step-up required", code: "step_up_required" });
      }
    } catch (err) {
      void appendSecurityAuditEvent({
        eventType: "rbac_unauthorized_request",
        severity: "warn",
        ip: request.ip,
        traceId: request.id,
        details: { requiredRoles: roles },
      });
      return reply.status(401).send({ error: "unauthorized" });
    }
  });

  fastify.decorate("requireStepUp", async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
      if (request.user?.stepUpRequired === true && !isStepUpSatisfied(request.user)) {
        void appendSecurityAuditEvent({
          eventType: "auth_step_up_required",
          severity: "warn",
          actorUserId: request.user?.userId,
          actorEmail: request.user?.email,
          ip: request.ip,
          traceId: request.id,
        });
        return reply.status(401).send({ error: "step-up required", code: "step_up_required" });
      }
      return null;
    } catch {
      return reply.status(401).send({ error: "unauthorized" });
    }
  });

  const lifecycleEmails = createLifecycleEmailAutomation(fastify);
  fastify.decorate("lifecycleEmails", lifecycleEmails);
  fastify.addHook("onClose", async () => {
    lifecycleEmails.stop();
  });

  await registerApiRoutes(fastify, "/api");
  await registerApiRoutes(fastify, "/v1");
  lifecycleEmails.start();

  return fastify;
}
