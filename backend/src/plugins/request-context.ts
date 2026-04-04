import type { FastifyPluginAsync } from "fastify";
import { randomUUID } from "crypto";

/**
 * Ensures every request has a traceable request id and echoes it back in the response.
 * - Honors inbound X-Request-Id when present (and valid length)
 * - Otherwise generates a UUIDv4
 */
const requestContext: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", async (request, reply) => {
    const inbound = request.headers["x-request-id"];
    const requestId = typeof inbound === "string" && inbound.length <= 128 ? inbound : randomUUID();
    // Mutate request id for downstream handlers and log correlation
    (request as any).id = requestId;
    reply.header("x-request-id", requestId);
  });
};

export default requestContext;