import { FastifyInstance } from "fastify";
import { runUserProfilePhotoUpload } from "../utils/upload";
import { getOrDefault, getRedis } from "../lib/redis";
import { verifyRequestWithRotation } from "../lib/jwt-rotation";

type DevUserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  roles: string[];
  photo?: string;
  createdAt: string;
};

const devUsers = new Map<string, DevUserProfile>();

function getOrCreateDevUser(userId: string): DevUserProfile {
  const existing = devUsers.get(userId);
  if (existing) return existing;

  const created: DevUserProfile = {
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

export default async function usersRoutes(fastify: FastifyInstance) {
  fastify.get("/users/me", async (request, reply) => {
    try {
      const req = request as any;
      await verifyRequestWithRotation(req);
      const userId = req.user?.userId || "dev-user-id";

      return await getOrDefault(`user:profile:${userId}`, async () => getOrCreateDevUser(userId), 120);
    } catch (err) {
      return reply.status(401).send({ error: "unauthorized" });
    }
  });

  fastify.patch("/users/me", async (request, reply) => {
    try {
      const req = request as any;
      await verifyRequestWithRotation(req);
      const userId = req.user?.userId || "dev-user-id";
      const existing = getOrCreateDevUser(userId);

      let uploadedPhotoUrl: string | undefined;
      const contentType = String(request.headers["content-type"] || "");
      if (contentType.includes("multipart/form-data")) {
        const file = await runUserProfilePhotoUpload(request, reply);
        uploadedPhotoUrl = file?.path || file?.secure_url;
      }

      const body = (request.body || {}) as Record<string, unknown>;
      const updated: DevUserProfile = {
        ...existing,
        firstName: (body.firstName as string) || existing.firstName,
        lastName: (body.lastName as string) || existing.lastName,
        displayName: (body.displayName as string) || existing.displayName,
        photo: uploadedPhotoUrl || existing.photo,
      };

      devUsers.set(userId, updated);
      const redis = getRedis();
      if (redis) {
        await redis.del(`user:profile:${userId}`);
      }

      return updated;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "unknown error";
      if (message.includes("Not an image") || message.includes("Cloudinary is not configured")) {
        return reply.status(400).send({ error: message });
      }
      return reply.status(401).send({ error: "unauthorized" });
    }
  });
}
