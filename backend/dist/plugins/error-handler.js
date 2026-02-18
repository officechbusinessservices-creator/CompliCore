"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = async (fastify) => {
    fastify.setErrorHandler((err, request, reply) => {
        const status = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
        const problem = {
            type: err.code ? `urn:problem:${err.code}` : "about:blank",
            title: err.name || "Internal Server Error",
            status,
            detail: err.message || "Something went wrong",
            instance: request.url,
            traceId: request.id,
        };
        if (err.validation) {
            problem.title = "Request validation failed";
            problem.errors = err.validation;
        }
        if (status >= 500) {
            request.log.error({ err, traceId: request.id }, "unhandled error");
        }
        else {
            request.log.warn({ err, traceId: request.id }, "request error");
        }
        reply.status(status).send(problem);
    });
};
exports.default = errorHandler;
