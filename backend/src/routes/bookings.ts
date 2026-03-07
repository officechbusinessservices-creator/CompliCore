import { FastifyInstance } from "fastify";
import { z } from "zod";
import { formatZodError } from "../lib/validation";
import { decryptField, encryptField, isFieldEncryptionEnabled } from "../lib/encryption";
import { appendSecurityAuditEvent } from "../lib/security-audit";
import { prisma } from "../lib/prisma";
import { env } from "../lib/env";

const listSchema = z.object({
  confirmationCode: z.string().min(3).max(64).optional(),
});

const createSchema = z.object({
  confirmation_code: z.string().min(3).max(64).optional(),
  listing_id: z.number().int().positive(),
  guest_name: z.string().min(1).max(255),
  property: z.string().min(1).max(255),
  check_in: z.string().min(1).max(64),
  check_out: z.string().min(1).max(64),
  access_code: z.string().min(1).max(32).optional(),
  wifi_name: z.string().min(1).max(64).optional(),
  wifi_password: z.string().min(1).max(64).optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
});

const cancelSchema = z.object({
  reason: z.string().min(1).max(255).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

const standardBookingRoles = ["guest", "host", "admin"];
const accessBookingRoles = ["host", "admin"];

function toPublicBooking(row: {
  id: number;
  confirmation_code: string;
  guest_name: string;
  property: string | null;
  check_in: string | null;
  check_out: string | null;
  status: string;
}) {
  return {
    id: row.id,
    confirmation_code: row.confirmation_code,
    guest_name: row.guest_name,
    property: row.property,
    check_in: row.check_in,
    check_out: row.check_out,
    status: row.status,
  };
}

function protectCredential(value?: string | null) {
  if (!value) return value;
  if (!isFieldEncryptionEnabled()) return value;
  try { return encryptField(value); } catch { return value; }
}

function revealCredential(value?: string | null) {
  if (!value) return value;
  if (!isFieldEncryptionEnabled()) return value;
  try { return decryptField(value); } catch { return value; }
}

async function requireRoles(fastify: FastifyInstance, request: any, reply: any, roles: string[]) {
  const guard = (fastify as any).requireRole;
  if (!guard) return true;
  const result = await guard(request, reply, roles);
  if (reply.sent) return false;
  if (result) return false;
  return true;
}

export default async function bookingsRoutes(fastify: FastifyInstance) {
  fastify.get("/bookings", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, standardBookingRoles);
    if (!hasAccess) return;

    const parse = listSchema.safeParse(request.query);
    if (!parse.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid query parameters",
        errors: formatZodError(parse.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const { confirmationCode } = parse.data;

    if (confirmationCode) {
      const booking = await prisma.booking.findUnique({
        where: { confirmation_code: confirmationCode },
      });
      if (!booking) return reply.status(404).send({ error: "not found" });
      return toPublicBooking(booking);
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { id: "desc" },
      take: 50,
    });
    return bookings.map(toPublicBooking);
  });

  fastify.get("/bookings/:bookingId", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, standardBookingRoles);
    if (!hasAccess) return;

    const { bookingId } = request.params as { bookingId: string };
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId, 10) },
    });
    if (!booking) return reply.status(404).send({ error: "not found" });
    return toPublicBooking(booking);
  });

  fastify.get("/bookings/:bookingId/access", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, accessBookingRoles);
    if (!hasAccess) return;

    const { bookingId } = request.params as { bookingId: string };
    const principal = (request as any).user || {};
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId, 10) },
    });
    if (!booking) return reply.status(404).send({ error: "not found" });

    void appendSecurityAuditEvent({
      eventType: "booking_access_credentials_read",
      severity: "warn",
      actorUserId: principal.userId,
      actorEmail: principal.email,
      ip: (request as any).ip,
      traceId: (request as any).id,
      details: { bookingId: String(bookingId), roles: principal.roles || [] },
    });

    return {
      id: booking.id,
      confirmation_code: booking.confirmation_code,
      access_code: revealCredential(booking.access_code),
      wifi_name: revealCredential(booking.wifi_name),
      wifi_password: revealCredential(booking.wifi_password),
    };
  });

  fastify.post("/bookings", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, standardBookingRoles);
    if (!hasAccess) return;

    const parsed = createSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid booking payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const body = parsed.data;
    const confirmationCode =
      body.confirmation_code ||
      Math.random().toString(36).slice(2, 9).toUpperCase();

    const booking = await prisma.booking.create({
      data: {
        confirmation_code: confirmationCode,
        listing_id: body.listing_id,
        guest_name: body.guest_name,
        property: body.property,
        check_in: body.check_in,
        check_out: body.check_out,
        access_code: protectCredential(body.access_code) ?? undefined,
        wifi_name: protectCredential(body.wifi_name) ?? undefined,
        wifi_password: protectCredential(body.wifi_password) ?? undefined,
        status: body.status || "pending",
      },
    });

    return reply.status(201).send({
      ...booking,
      access_code: revealCredential(booking.access_code),
      wifi_name: revealCredential(booking.wifi_name),
      wifi_password: revealCredential(booking.wifi_password),
    });
  });

  fastify.patch("/bookings/:bookingId/status", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, standardBookingRoles);
    if (!hasAccess) return;

    const { bookingId } = request.params as { bookingId: string };
    const parsed = updateStatusSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid status payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const booking = await prisma.booking.update({
      where: { id: parseInt(bookingId, 10) },
      data: { status: parsed.data.status },
    });

    return toPublicBooking(booking);
  });

  fastify.post("/bookings/:bookingId/cancel", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, standardBookingRoles);
    if (!hasAccess) return;

    const { bookingId } = request.params as { bookingId: string };
    const parsed = cancelSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid cancel payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const booking = await prisma.booking.update({
      where: { id: parseInt(bookingId, 10) },
      data: { status: "cancelled" },
    });

    return {
      booking: toPublicBooking(booking),
      refund: {
        amount: 0,
        currency: "USD",
        policy: parsed.data.reason || "standard",
      },
    };
  });
}
