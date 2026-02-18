"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usersRoutes;
const upload_1 = require("../utils/upload");
const redis_1 = require("../lib/redis");
const jwt_rotation_1 = require("../lib/jwt-rotation");
const devUsers = new Map();
function getOrCreateDevUser(userId) {
    const existing = devUsers.get(userId);
    if (existing)
        return existing;
    const created = {
        id: userId,
        email: "dev@local",
        firstName: "Dev",
        lastName: "User",
        displayName: "Dev User",
        roles: ["guest"],
        createdAt: new Date().toISOString(),
    };
    devUsers.set(userId, created);
    return created;
}
async function usersRoutes(fastify) {
    fastify.get("/users/me", async (request, reply) => {
        try {
            const req = request;
            await (0, jwt_rotation_1.verifyRequestWithRotation)(req);
            const userId = req.user?.userId || "dev-user-id";
            return await (0, redis_1.getOrDefault)(`user:profile:${userId}`, async () => getOrCreateDevUser(userId), 120);
        }
        catch (err) {
            return reply.status(401).send({ error: "unauthorized" });
        }
    });
    fastify.patch("/users/me", async (request, reply) => {
        try {
            const req = request;
            await (0, jwt_rotation_1.verifyRequestWithRotation)(req);
            const userId = req.user?.userId || "dev-user-id";
            const existing = getOrCreateDevUser(userId);
            let uploadedPhotoUrl;
            const contentType = String(request.headers["content-type"] || "");
            if (contentType.includes("multipart/form-data")) {
                const file = await (0, upload_1.runUserProfilePhotoUpload)(request, reply);
                uploadedPhotoUrl = file?.path || file?.secure_url;
            }
            const body = (request.body || {});
            const updated = {
                ...existing,
                firstName: body.firstName || existing.firstName,
                lastName: body.lastName || existing.lastName,
                displayName: body.displayName || existing.displayName,
                photo: uploadedPhotoUrl || existing.photo,
            };
            devUsers.set(userId, updated);
            const redis = (0, redis_1.getRedis)();
            if (redis) {
                await redis.del(`user:profile:${userId}`);
            }
            return updated;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "unknown error";
            if (message.includes("Not an image") || message.includes("Cloudinary is not configured")) {
                return reply.status(400).send({ error: message });
            }
            return reply.status(401).send({ error: "unauthorized" });
        }
    });
}
