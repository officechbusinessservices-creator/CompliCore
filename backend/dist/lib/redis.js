"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedis = getRedis;
exports.getOrDefault = getOrDefault;
const ioredis_1 = __importDefault(require("ioredis"));
let client = null;
function getRedis() {
    if (client !== null)
        return client;
    const url = process.env.REDIS_URL;
    if (!url)
        return null;
    client = new ioredis_1.default(url, {
        maxRetriesPerRequest: 2,
        enableReadyCheck: true,
    });
    return client;
}
async function getOrDefault(key, fallback, ttlSeconds = 300) {
    const redis = getRedis();
    if (!redis)
        return fallback();
    const cached = await redis.get(key);
    if (cached)
        return JSON.parse(cached);
    const value = await fallback();
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    return value;
}
