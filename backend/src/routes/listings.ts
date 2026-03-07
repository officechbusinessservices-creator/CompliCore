import { FastifyInstance } from "fastify";
import { z } from "zod";
import { formatZodError } from "../lib/validation";
import { prisma } from "../lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { env } from "../lib/env";

// Lazy Cloudinary upload for listing photos
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const listingStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "listings",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
  }),
} as any);

const listingUpload = multer({
  storage: listingStorage,
  fileFilter: (_req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("photo");

function runListingUpload(request: any, reply: any): Promise<{ secure_url?: string; path?: string } | undefined> {
  return new Promise((resolve, reject) => {
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      return reject(new Error("Cloudinary not configured"));
    }
    listingUpload(request.raw, reply.raw, (err: unknown) => {
      if (err) return reject(err);
      resolve((request.raw as any).file);
    });
  });
}

const createSchema = z.object({
  title: z.string().min(1).max(255),
  address: z.string().max(255).optional(),
  price_per_night: z.number().int().positive().optional(),
  status: z.enum(["active", "draft", "paused"]).optional(),
});

const updateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  address: z.string().max(255).optional(),
  price_per_night: z.number().int().positive().optional(),
  status: z.enum(["active", "draft", "paused"]).optional(),
});

const hostRoles = ["host", "admin"];

async function requireRoles(fastify: FastifyInstance, request: any, reply: any, roles: string[]) {
  const guard = (fastify as any).requireRole;
  if (!guard) return true;
  const result = await guard(request, reply, roles);
  if (reply.sent) return false;
  if (result) return false;
  return true;
}

export default async function listingsRoutes(fastify: FastifyInstance) {
  fastify.get("/listings", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, hostRoles);
    if (!hasAccess) return;

    const principal = (request as any).user || {};
    const hostId = principal.userId ? parseInt(String(principal.userId), 10) : undefined;

    const listings = await prisma.listing.findMany({
      where: hostId ? { host_id: hostId } : undefined,
      orderBy: { id: "desc" },
      take: 100,
    });

    return listings;
  });

  fastify.get("/listings/:listingId", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, hostRoles);
    if (!hasAccess) return;

    const { listingId } = request.params as { listingId: string };
    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(listingId, 10) },
    });
    if (!listing) return reply.status(404).send({ error: "not found" });
    return listing;
  });

  fastify.post("/listings", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, hostRoles);
    if (!hasAccess) return;

    const parsed = createSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid listing payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const principal = (request as any).user || {};
    const hostId = principal.userId ? parseInt(String(principal.userId), 10) : undefined;

    const listing = await prisma.listing.create({
      data: {
        title: parsed.data.title,
        address: parsed.data.address,
        price_per_night: parsed.data.price_per_night,
        status: parsed.data.status || "draft",
        host_id: hostId,
      },
    });

    return reply.status(201).send(listing);
  });

  fastify.patch("/listings/:listingId", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, hostRoles);
    if (!hasAccess) return;

    const { listingId } = request.params as { listingId: string };
    const parsed = updateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid listing update payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const listing = await prisma.listing.update({
      where: { id: parseInt(listingId, 10) },
      data: parsed.data,
    });

    return listing;
  });

  fastify.delete("/listings/:listingId", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, hostRoles);
    if (!hasAccess) return;

    const { listingId } = request.params as { listingId: string };
    await prisma.listing.delete({ where: { id: parseInt(listingId, 10) } });
    return reply.status(204).send();
  });

  // -------------------------------------------------------------------------
  // POST /listings/:listingId/photo — upload listing cover photo to Cloudinary
  // -------------------------------------------------------------------------
  fastify.post("/listings/:listingId/photo", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, hostRoles);
    if (!hasAccess) return;

    const { listingId } = request.params as { listingId: string };
    const id = parseInt(listingId, 10);

    try {
      const file = await runListingUpload(request as any, reply);
      const photoUrl = file?.secure_url || file?.path;
      if (!photoUrl) {
        return reply.status(400).send({ error: "Upload failed — no URL returned" });
      }

      const listing = await prisma.listing.update({
        where: { id },
        data: { photo_url: photoUrl },
      });

      return { photo_url: listing.photo_url };
    } catch (err: any) {
      return reply.status(422).send({ error: err.message || "Upload failed" });
    }
  });
}
