import type { FastifyPluginAsync } from "fastify";
import { randomUUID } from "crypto";
import { getRedis } from "../lib/redis";

// In-memory fallback store for environments without Redis
const memoryStore = new Map<string, any>();

type Persistor = {
  get: (key: string) => Promise<any | undefined>;
  set: (key: string, value: any, ttlSeconds: number) => Promise<void>;
};

const createMemoryPersistor = (): Persistor => ({
  async get(key) {
    return memoryStore.get(key);
  },
  async set(key, value) {
    memoryStore.set(key, value);
  },
});

const createRedisPersistor = (): Persistor => {
  const redis = getRedis();
  if (!redis) return createMemoryPersistor();
  return {
    async get(key) {
      const val = await redis.get(key);
      return val ? JSON.parse(val) : undefined;
    },
    async set(key, value, ttlSeconds) {
      await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    },
  };
};

const persistor = process.env.REDIS_URL ? createRedisPersistor() : createMemoryPersistor();

/**
 * Idempotency middleware
 * - Looks for `Idempotency-Key` header
 * - Returns cached response if seen before
 * - Caches successful responses for repeat calls
 */
const idempotency: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", async (request, reply) => {
    if (request.method !== "POST") return;
    const key = request.headers["idempotency-key"];
    if (!key || typeof key !== "string") return;

    const cacheKey = `idempotency:${key}`;
    const cached = await persistor.get(cacheKey);
    if (cached) {
      reply.header("x-idempotent", "true");
      reply.status(cached.statusCode).send(cached.payload);
      return reply;
    }

    // decorate to capture response
    const originalSend = reply.send.bind(reply);
    reply.send = (payload: any) => {
      const record = { statusCode: reply.statusCode || 200, payload };
      void persistor.set(cacheKey, record, 60 * 10); // 10 minutes TTL
      return originalSend(payload);
    };
    reply.header("x-request-id", request.id || randomUUID());
  });
};

export default idempotency;
