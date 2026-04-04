import type { FastifyPluginAsync } from "fastify";

/**
 * Structured logging with request correlation.
 * Emits: level, msg, requestId, method, url, statusCode, durationMs.
 */
const logging: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", async (request) => {
    (request as any).startTime = performance.now();
  });

  fastify.addHook("onResponse", async (request, reply) => {
    const durationMs = ((performance.now() - ((request as any).startTime || 0)) || 0).toFixed(2);
    request.log.info(
      {
        requestId: request.id,
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        durationMs,
      },
      "request completed",
    );
  });
};

export default logging;