"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Structured logging with request correlation.
 * Emits: level, msg, requestId, method, url, statusCode, durationMs.
 */
const logging = async (fastify) => {
    fastify.addHook("onRequest", async (request) => {
        request.startTime = performance.now();
    });
    fastify.addHook("onResponse", async (request, reply) => {
        const durationMs = ((performance.now() - (request.startTime || 0)) || 0).toFixed(2);
        request.log.info({
            requestId: request.id,
            method: request.method,
            url: request.url,
            statusCode: reply.statusCode,
            durationMs,
        }, "request completed");
    });
};
exports.default = logging;
