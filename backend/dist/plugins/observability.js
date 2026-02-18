"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middie_1 = __importDefault(require("@fastify/middie"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("../lib/env");
const metrics_1 = require("../lib/metrics");
const observability = async (fastify) => {
    await fastify.register(middie_1.default);
    const morganFormat = env_1.env.NODE_ENV === "development" ? "dev" : "combined";
    fastify.use((0, morgan_1.default)(morganFormat));
    fastify.addHook("onRequest", async (request) => {
        request._metricsStart = process.hrtime.bigint();
    });
    fastify.addHook("onResponse", async (request, reply) => {
        const start = request._metricsStart ?? process.hrtime.bigint();
        const durationSeconds = Number(process.hrtime.bigint() - start) / 1000000000;
        const route = request.routeOptions?.url || request.url.split("?")[0] || "unknown";
        const labels = {
            method: request.method,
            route,
            status_code: String(reply.statusCode),
        };
        metrics_1.httpRequestCounter.inc(labels);
        metrics_1.httpRequestDuration.observe(labels, durationSeconds);
    });
    fastify.get("/metrics", async (_request, reply) => {
        reply.header("Content-Type", metrics_1.register.contentType);
        return metrics_1.register.metrics();
    });
};
exports.default = observability;
