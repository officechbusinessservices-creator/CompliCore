import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import dotenv from "dotenv";
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

dotenv.config();

export async function buildServer() {
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

  await fastify.register(cors, { origin: true });
  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });
  await fastify.register(rateLimit, {
    max: Number(process.env.RATE_LIMIT_MAX || 120),
    timeWindow: process.env.RATE_LIMIT_WINDOW || "1 minute",
  });
  await fastify.register(jwt, { secret: process.env.JWT_SECRET || "dev-secret" });

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
        return reply.status(403).send({ error: "forbidden" });
      }
    } catch (err) {
      return reply.status(401).send({ error: "unauthorized" });
    }
  });

  await fastify.register(authRoutes, { prefix: "/api" });
  await fastify.register(usersRoutes, { prefix: "/api" });
  await fastify.register(bookingsRoutes, { prefix: "/api" });
  await fastify.register(listingsRoutes, { prefix: "/api" });
  await fastify.register(paymentsRoutes, { prefix: "/api" });
  await fastify.register(messagesRoutes, { prefix: "/api" });
  await fastify.register(propertiesRoutes, { prefix: "/api" });
  await fastify.register(reviewsRoutes, { prefix: "/api" });
  await fastify.register(analyticsRoutes, { prefix: "/api" });
  await fastify.register(aiRoutes, { prefix: "/api" });
  await fastify.register(pmsRoutes, { prefix: "/api" });
  await fastify.register(pmsConnectorRoutes, { prefix: "/api" });
  await fastify.register(moduleRoutes, { prefix: "/api" });

  await fastify.register(authRoutes, { prefix: "/v1" });
  await fastify.register(usersRoutes, { prefix: "/v1" });
  await fastify.register(bookingsRoutes, { prefix: "/v1" });
  await fastify.register(listingsRoutes, { prefix: "/v1" });
  await fastify.register(paymentsRoutes, { prefix: "/v1" });
  await fastify.register(messagesRoutes, { prefix: "/v1" });
  await fastify.register(propertiesRoutes, { prefix: "/v1" });
  await fastify.register(reviewsRoutes, { prefix: "/v1" });
  await fastify.register(analyticsRoutes, { prefix: "/v1" });
  await fastify.register(aiRoutes, { prefix: "/v1" });
  await fastify.register(pmsRoutes, { prefix: "/v1" });
  await fastify.register(pmsConnectorRoutes, { prefix: "/v1" });
  await fastify.register(moduleRoutes, { prefix: "/v1" });

  return fastify;
}
