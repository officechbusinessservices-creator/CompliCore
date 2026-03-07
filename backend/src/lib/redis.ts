import Redis from "ioredis";
import { env } from "./env";

type RedisClient = Redis | null;

let client: RedisClient = null;

export function getRedis(): RedisClient {
  if (client !== null) return client;
  const url = env.REDIS_URL;
  if (!url) return null;
  client = new Redis(url, {
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
  });
  return client;
}

export async function getOrDefault<T>(key: string, fallback: () => Promise<T>, ttlSeconds = 300): Promise<T> {
  const redis = getRedis();
  if (!redis) return fallback();
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached) as T;
  const value = await fallback();
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  return value;
}
