import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import cookie from "@fastify/cookie";
import { env } from "../lib/env";

const securityFortress: FastifyPluginAsync = async (fastify) => {
  const allowedOrigins = env.ALLOWED_ORIGINS
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowedMethods = env.ALLOWED_METHODS
    .split(",")
    .map((method) => method.trim().toUpperCase())
    .filter(Boolean);

  await fastify.register(cors, {
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: allowedMethods,
    credentials: true,
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false,
    global: true,
    hidePoweredBy: true,
  });

  await fastify.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW,
    allowList: env.RATE_LIMIT_ALLOWLIST
      ? env.RATE_LIMIT_ALLOWLIST.split(",").map((ip) => ip.trim())
      : [],
  });

  await fastify.register(cookie);
};

export default fp(securityFortress, {
  name: "security-fortress",
});
