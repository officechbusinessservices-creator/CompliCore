import type { FastifyPluginAsync } from "fastify";
import middie from "@fastify/middie";
import morgan from "morgan";
import { env } from "../lib/env";
import { httpRequestCounter, httpRequestDuration, register } from "../lib/metrics";

const observability: FastifyPluginAsync = async (fastify) => {
  await fastify.register(middie);

  const morganFormat = env.NODE_ENV === "development" ? "dev" : "combined";
  fastify.use(morgan(morganFormat));

  fastify.addHook("onRequest", async (request) => {
    (request as any)._metricsStart = process.hrtime.bigint();
  });

  fastify.addHook("onResponse", async (request, reply) => {
    const start = ((request as any)._metricsStart as bigint | undefined) ?? process.hrtime.bigint();
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1_000_000_000;

    const route = request.routeOptions?.url || request.url.split("?")[0] || "unknown";
    const labels = {
      method: request.method,
      route,
      status_code: String(reply.statusCode),
    };

    httpRequestCounter.inc(labels);
    httpRequestDuration.observe(labels, durationSeconds);
  });

  fastify.get("/metrics", async (_request, reply) => {
    reply.header("Content-Type", register.contentType);
    return register.metrics();
  });
};

export default observability;
