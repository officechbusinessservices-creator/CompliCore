import { FastifyInstance } from "fastify";
import { z } from "zod";
import { runUserProfilePhotoUpload } from "../utils/upload";
import { getRedis } from "../lib/redis";
import { verifyRequestWithRotation } from "../lib/jwt-rotation";
import { prisma } from "../lib/prisma";

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  displayName: z.string().min(1).max(200).optional(),
});

function userToProfile(user: {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdAt: Date;
}) {
  return {
    id: String(user.id),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: `${user.firstName} ${user.lastName}`.trim() || user.email,
    roles: user.roles,
    createdAt: user.createdAt.toISOString(),
  };
}

export default async function usersRoutes(fastify: FastifyInstance) {
  fastify.get("/users/me", async (request, reply) => {
    try {
      const req = request as any;
      await verifyRequestWithRotation(req);

      const userId = req.user?.userId;
      if (!userId) return reply.status(401).send({ error: "unauthorized" });

      const id = parseInt(String(userId), 10);
      if (Number.isNaN(id)) return reply.status(401).send({ error: "unauthorized" });

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return reply.status(404).send({ error: "user not found" });

      return userToProfile(user);
    } catch {
      return reply.status(401).send({ error: "unauthorized" });
    }
  });

  fastify.patch("/users/me", async (request, reply) => {
    try {
      const req = request as any;
      await verifyRequestWithRotation(req);

      const userId = req.user?.userId;
      if (!userId) return reply.status(401).send({ error: "unauthorized" });

      const id = parseInt(String(userId), 10);
      if (Number.isNaN(id)) return reply.status(401).send({ error: "unauthorized" });

      let photoUrl: string | undefined;
      const contentType = String(request.headers["content-type"] || "");
      if (contentType.includes("multipart/form-data")) {
        const file = await runUserProfilePhotoUpload(request, reply);
        photoUrl = file?.path || file?.secure_url;
      }

      const body = (request.body || {}) as Record<string, unknown>;
      const parsed = updateProfileSchema.safeParse(body);

      const updateData: Record<string, string> = {};
      if (parsed.success) {
        if (parsed.data.firstName) updateData.firstName = parsed.data.firstName;
        if (parsed.data.lastName) updateData.lastName = parsed.data.lastName;
      }

      const user = await prisma.user.update({ where: { id }, data: updateData });

      const redis = getRedis();
      if (redis) await redis.del(`user:profile:${userId}`);

      return { ...userToProfile(user), photo: photoUrl };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "unknown error";
      if (message.includes("Not an image") || message.includes("Cloudinary is not configured")) {
        return reply.status(400).send({ error: message });
      }
      return reply.status(401).send({ error: "unauthorized" });
    }
  });
}
