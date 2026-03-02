import { Pool } from "pg";
import { env } from "./lib/env";
import { dbQueryDuration, dbSlowQueryCounter } from "./lib/metrics";
import QueryStream from "pg-query-stream";

const sslEnabled = env.DB_SSL;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: sslEnabled ? { rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED } : undefined,
  max: env.DB_POOL_MAX,
  idleTimeoutMillis: env.DB_IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: env.DB_CONNECT_TIMEOUT_MS,
});

export async function query(text: string, params?: any[]) {
  const start = process.hrtime.bigint();
  const res = await pool.query(text, params);
  const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
  const operation = text.trim().split(" ")[0]?.toUpperCase() || "QUERY";

  dbQueryDuration.observe({ operation }, durationMs / 1000);

  if (durationMs > env.DB_SLOW_QUERY_THRESHOLD_MS) {
    dbSlowQueryCounter.inc({ operation });
    console.warn("⚠️ SLOW QUERY", {
      operation,
      durationMs: Number(durationMs.toFixed(2)),
      text,
      rows: res.rowCount,
    });
  } else {
    console.log("executed query", {
      operation,
      durationMs: Number(durationMs.toFixed(2)),
      rows: res.rowCount,
    });
  }

  return res;
}

export async function streamQuery<T = any>(text: string, params: any[] = []) {
  const client = await pool.connect();
  const operation = text.trim().split(" ")[0]?.toUpperCase() || "QUERY";
  const start = process.hrtime.bigint();
  const stream = client.query(new QueryStream(text, params));

  stream.on("end", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    dbQueryDuration.observe({ operation }, durationMs / 1000);
    if (durationMs > env.DB_SLOW_QUERY_THRESHOLD_MS) {
      dbSlowQueryCounter.inc({ operation });
      console.warn("⚠️ SLOW STREAM QUERY", {
        operation,
        durationMs: Number(durationMs.toFixed(2)),
        text,
      });
    }
    client.release();
  });

  stream.on("error", (err: Error) => {
    client.release();
    stream.destroy(err);
  });

  return stream;
}

export default pool;
