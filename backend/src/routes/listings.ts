import { FastifyInstance } from "fastify";
import { z } from "zod";
import { formatZodError } from "../lib/validation";
import { prisma } from "../lib/prisma";

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
}
