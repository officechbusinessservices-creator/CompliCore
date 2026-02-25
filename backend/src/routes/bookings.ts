import { FastifyInstance } from "fastify";
import { once } from "events";
import { z } from "zod";
import { query, streamQuery } from "../db";
import { env } from "../lib/env";
import { formatZodError } from "../lib/validation";
import { decryptField, encryptField, isFieldEncryptionEnabled } from "../lib/encryption";
import { appendSecurityAuditEvent } from "../lib/security-audit";

const listSchema = z.object({
  confirmationCode: z.string().min(3).max(64).optional(),
  stream: z.enum(["true", "false"]).optional(),
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

const standardBookingRoles = ["guest", "host", "admin"];
const accessBookingRoles = ["host", "admin"];
const demoFallbackEnabled = env.ENABLE_DEMO_FALLBACK && env.NODE_ENV !== "production";

type DemoBooking = {
  id: number;
  confirmation_code: string;
  guest_name: string;
  property: string;
  check_in: string;
  check_out: string;
  access_code: string;
  wifi_name: string;
  wifi_password: string;
  status: string;
};

function buildDemoBookings(): DemoBooking[] {
  return [
    {
      id: 1,
      confirmation_code: "HX4K9M2",
      guest_name: "Alex Johnson",
      property: "Modern Downtown Loft",
      check_in: "3:00 PM",
      check_out: "11:00 AM",
      access_code: "4829",
      wifi_name: "LoftGuest",
      wifi_password: "Welcome2024",
      status: "confirmed",
    },
    {
      id: 2,
      confirmation_code: "1234",
      guest_name: "Test Guest",
      property: "Cozy Studio",
      check_in: "4:00 PM",
      check_out: "10:00 AM",
      access_code: "0000",
      wifi_name: "StudioGuest",
      wifi_password: "password",
      status: "pending",
    },
  ];
}

function toPublicBooking(row: any) {
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

function toAccessDetails(row: any) {
  return {
    id: row.id,
    confirmation_code: row.confirmation_code,
    access_code: revealCredential(row.access_code),
    wifi_name: revealCredential(row.wifi_name),
    wifi_password: revealCredential(row.wifi_password),
  };
}

function protectCredential(value?: string | null) {
  if (!value) return value;
  if (!isFieldEncryptionEnabled()) return value;
  try {
    return encryptField(value);
  } catch {
    return value;
  }
}

function revealCredential(value?: string | null) {
  if (!value) return value;
  if (!isFieldEncryptionEnabled()) return value;
  try {
    return decryptField(value);
  } catch {
    return value;
  }
}

function sendUnavailable(reply: any) {
  return reply.status(503).send({ error: "service unavailable" });
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

    const q = parse.data;

    try {
      if (q.confirmationCode) {
        const res = await query(
          "SELECT id, confirmation_code, guest_name, property, check_in, check_out, status FROM bookings WHERE confirmation_code = $1 LIMIT 1",
          [q.confirmationCode],
        );

        if (res.rows.length === 0) return reply.status(404).send({ error: "not found" });
        return toPublicBooking(res.rows[0]);
      }

      if (q.stream === "true") {
        reply.header("Content-Type", "application/json; charset=utf-8");
        const stream = await streamQuery(
          "SELECT id, confirmation_code, guest_name, property, check_in, check_out, status FROM bookings ORDER BY id DESC",
        );

        reply.raw.write("[");
        let first = true;

        stream.on("data", (row: any) => {
          if (!first) reply.raw.write(",");
          reply.raw.write(JSON.stringify(toPublicBooking(row)));
          first = false;
        });

        stream.on("end", () => {
          reply.raw.write("]");
          reply.raw.end();
        });

        stream.on("error", () => {
          if (!reply.raw.writableEnded) {
            reply.raw.write("]");
            reply.raw.end();
          }
        });

        await once(stream, "end");
        return reply;
      }

      const res = await query(
        "SELECT id, confirmation_code, guest_name, property, check_in, check_out, status FROM bookings ORDER BY id DESC LIMIT 50",
      );
      return res.rows.map(toPublicBooking);
    } catch (err) {
      if (!demoFallbackEnabled) {
        request.log.error({ err }, "bookings query failed and demo fallback is disabled");
        return sendUnavailable(reply);
      }

      const demo = buildDemoBookings();
      if (q.confirmationCode) {
        const found = demo.find((d) => d.confirmation_code === q.confirmationCode);
        if (!found) return reply.status(404).send({ error: "not found" });
        return toPublicBooking(found);
      }
      return demo.map(toPublicBooking);
    }
  });

  fastify.get("/bookings/:bookingId", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, standardBookingRoles);
    if (!hasAccess) return;

    const { bookingId } = request.params as any;
    try {
      const res = await query(
        "SELECT id, confirmation_code, guest_name, property, check_in, check_out, status FROM bookings WHERE id = $1",
        [bookingId],
      );

      if (res.rows.length === 0) return reply.status(404).send({ error: "not found" });
      return toPublicBooking(res.rows[0]);
    } catch (err) {
      if (!demoFallbackEnabled) {
        request.log.error({ err }, "booking lookup failed and demo fallback is disabled");
        return sendUnavailable(reply);
      }

      const found = buildDemoBookings().find((d) => String(d.id) === String(bookingId));
      if (!found) return reply.status(404).send({ error: "not found" });
      return toPublicBooking(found);
    }
  });

  fastify.get("/bookings/:bookingId/access", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, accessBookingRoles);
    if (!hasAccess) return;

    const { bookingId } = request.params as any;
    const principal = (request as any).user || {};
    try {
      const res = await query(
        "SELECT id, confirmation_code, access_code, wifi_name, wifi_password FROM bookings WHERE id = $1",
        [bookingId],
      );

      if (res.rows.length === 0) return reply.status(404).send({ error: "not found" });
      void appendSecurityAuditEvent({
        eventType: "booking_access_credentials_read",
        severity: "warn",
        actorUserId: principal.userId,
        actorEmail: principal.email,
        ip: (request as any).ip,
        traceId: (request as any).id,
        details: {
          bookingId: String(bookingId),
          roles: principal.roles || [],
        },
      });
      return toAccessDetails(res.rows[0]);
    } catch (err) {
      if (!demoFallbackEnabled) {
        request.log.error({ err }, "booking access lookup failed and demo fallback is disabled");
        return sendUnavailable(reply);
      }

      const found = buildDemoBookings().find((d) => String(d.id) === String(bookingId));
      if (!found) return reply.status(404).send({ error: "not found" });
      return toAccessDetails(found);
    }
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
    try {
      const res = await query(
        `INSERT INTO bookings (confirmation_code, listing_id, guest_name, property, check_in, check_out, access_code, wifi_name, wifi_password, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING id, confirmation_code, listing_id, guest_name, property, check_in, check_out, access_code, wifi_name, wifi_password, status`,
        [
          body.confirmation_code,
          body.listing_id,
          body.guest_name,
          body.property,
          body.check_in,
          body.check_out,
          protectCredential(body.access_code),
          protectCredential(body.wifi_name),
          protectCredential(body.wifi_password),
          body.status || "pending",
        ],
      );
      const created = res.rows[0];
      return reply.status(201).send({
        ...created,
        access_code: revealCredential(created.access_code),
        wifi_name: revealCredential(created.wifi_name),
        wifi_password: revealCredential(created.wifi_password),
      });
    } catch (err) {
      if (!demoFallbackEnabled) {
        request.log.error({ err }, "booking create failed and demo fallback is disabled");
        return sendUnavailable(reply);
      }

      return reply.status(201).send({
        id: Math.floor(Math.random() * 100000),
        confirmation_code: body.confirmation_code || "DEMO123",
        listing_id: body.listing_id,
        guest_name: body.guest_name,
        property: body.property,
        check_in: body.check_in,
        check_out: body.check_out,
        access_code: body.access_code,
        wifi_name: body.wifi_name,
        wifi_password: body.wifi_password,
        status: body.status || "pending",
      });
    }
  });

  fastify.post("/bookings/:bookingId/cancel", async (request, reply) => {
    const hasAccess = await requireRoles(fastify, request as any, reply, standardBookingRoles);
    if (!hasAccess) return;

    const { bookingId } = request.params as any;
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

    const body = parsed.data;
    return {
      booking: {
        id: bookingId,
        status: "cancelled",
      },
      refund: {
        amount: 50,
        currency: "USD",
        policy: body.reason || "standard",
      },
    };
  });
}
