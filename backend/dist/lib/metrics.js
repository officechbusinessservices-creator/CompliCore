"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbSlowQueryCounter = exports.dbQueryDuration = exports.httpRequestDuration = exports.httpRequestCounter = exports.register = void 0;
const prom_client_1 = require("prom-client");
exports.register = new prom_client_1.Registry();
(0, prom_client_1.collectDefaultMetrics)({ register: exports.register, prefix: "complicore_" });
exports.httpRequestCounter = new prom_client_1.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
    registers: [exports.register],
});
exports.httpRequestDuration = new prom_client_1.Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
    registers: [exports.register],
});
exports.dbQueryDuration = new prom_client_1.Histogram({
    name: "db_query_duration_seconds",
    help: "Database query duration in seconds",
    labelNames: ["operation"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
    registers: [exports.register],
});
exports.dbSlowQueryCounter = new prom_client_1.Counter({
    name: "db_slow_queries_total",
    help: "Total number of DB queries exceeding the slow threshold",
    labelNames: ["operation"],
    registers: [exports.register],
});
