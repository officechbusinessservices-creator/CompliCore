"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
/**
 * Ensures every request has a traceable request id and echoes it back in the response.
 * - Honors inbound X-Request-Id when present (and valid length)
 * - Otherwise generates a UUIDv4
 */
const requestContext = async (fastify) => {
    fastify.addHook("onRequest", async (request, reply) => {
        const inbound = request.headers["x-request-id"];
        const requestId = typeof inbound === "string" && inbound.length <= 128 ? inbound : (0, crypto_1.randomUUID)();
        // Mutate request id for downstream handlers and log correlation
        request.id = requestId;
        reply.header("x-request-id", requestId);
    });
};
exports.default = requestContext;
