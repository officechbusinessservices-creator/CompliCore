"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = query;
exports.streamQuery = streamQuery;
const pg_1 = require("pg");
const env_1 = require("./lib/env");
const metrics_1 = require("./lib/metrics");
const pg_query_stream_1 = __importDefault(require("pg-query-stream"));
const sslEnabled = env_1.env.DB_SSL;
const pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
    ssl: sslEnabled ? { rejectUnauthorized: env_1.env.DB_SSL_REJECT_UNAUTHORIZED } : undefined,
    max: env_1.env.DB_POOL_MAX,
    idleTimeoutMillis: env_1.env.DB_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: env_1.env.DB_CONNECT_TIMEOUT_MS,
});
async function query(text, params) {
    const start = process.hrtime.bigint();
    const res = await pool.query(text, params);
    const durationMs = Number(process.hrtime.bigint() - start) / 1000000;
    const operation = text.trim().split(" ")[0]?.toUpperCase() || "QUERY";
    metrics_1.dbQueryDuration.observe({ operation }, durationMs / 1000);
    if (durationMs > env_1.env.DB_SLOW_QUERY_THRESHOLD_MS) {
        metrics_1.dbSlowQueryCounter.inc({ operation });
        console.warn("⚠️ SLOW QUERY", {
            operation,
            durationMs: Number(durationMs.toFixed(2)),
            text,
            rows: res.rowCount,
        });
    }
    else {
        console.log("executed query", {
            operation,
            durationMs: Number(durationMs.toFixed(2)),
            rows: res.rowCount,
        });
    }
    return res;
}
async function streamQuery(text, params = []) {
    const client = await pool.connect();
    const operation = text.trim().split(" ")[0]?.toUpperCase() || "QUERY";
    const start = process.hrtime.bigint();
    const stream = client.query(new pg_query_stream_1.default(text, params));
    stream.on("end", () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1000000;
        metrics_1.dbQueryDuration.observe({ operation }, durationMs / 1000);
        if (durationMs > env_1.env.DB_SLOW_QUERY_THRESHOLD_MS) {
            metrics_1.dbSlowQueryCounter.inc({ operation });
            console.warn("⚠️ SLOW STREAM QUERY", {
                operation,
                durationMs: Number(durationMs.toFixed(2)),
                text,
            });
        }
        client.release();
    });
    stream.on("error", (err) => {
        client.release();
        stream.destroy(err);
    });
    return stream;
}
exports.default = pool;
