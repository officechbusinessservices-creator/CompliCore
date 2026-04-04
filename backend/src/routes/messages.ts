import { FastifyInstance } from "fastify";
import { z } from "zod";
import { env } from "../lib/env";
import { encryptField, decryptField } from "../lib/encryption";
import { prisma } from "../lib/prisma";
import { formatZodError } from "../lib/validation";

const exportWindowMs = 60 * 1000;
const exportTracker = new Map<string, { count: number; resetAt: number }>();

function getTrackerKey(request: any) {
  return request.user?.userId || request.ip || "anonymous";
}

function checkExportLimit(request: any) {
  const key = getTrackerKey(request);
  const now = Date.now();
  const existing = exportTracker.get(key);
  if (!existing || existing.resetAt < now) {
    exportTracker.set(key, { count: 1, resetAt: now + exportWindowMs });
    return true;
  }
  existing.count += 1;
  return existing.count <= env.DATA_EXPORT_LIMIT_PER_MINUTE;
}

function parseHoneytokens() {
  return env.HONEYTOKEN_IDS.split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

const createMessageSchema = z.object({
  booking_id: z.number().int().positive().optional().nullable(),
  sender: z.string().min(1).max(50),
  body: z.string().min(1).max(4000),
});

export default async function messagesRoutes(fastify: FastifyInstance) {
  // -------------------------------------------------------------------------
  // GET /messages — list last 50 messages (most-recent first)
  // -------------------------------------------------------------------------
  fastify.get("/messages", async (request, reply) => {
    if (!checkExportLimit(request)) {
      return reply.status(429).send({ error: "export limit exceeded" });
    }

    const messages = await prisma.message.findMany({
      orderBy: { created_at: "desc" },
      take: 50,
    });

    const honeytokens = new Set(parseHoneytokens());
    if (messages.some((m) => honeytokens.has(String(m.id)))) {
      request.log.warn({ honeytoken: true, route: "/messages" }, "honeytoken access detected");
    }

    return messages.map((m) => ({
      ...m,
      body: m.body ? decryptField(m.body) : m.body,
    }));
  });

  // -------------------------------------------------------------------------
  // POST /messages — create a new message
  // -------------------------------------------------------------------------
  fastify.post("/messages", async (request, reply) => {
    const parsed = createMessageSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid message payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const { booking_id, sender, body } = parsed.data;

    const message = await prisma.message.create({
      data: {
        booking_id: booking_id ?? null,
        sender,
        body: body ? encryptField(body) : body,
      },
    });

    return {
      ...message,
      body: message.body ? decryptField(message.body) : message.body,
    };
  });

  // -------------------------------------------------------------------------
  // GET /messages/threads — grouped by booking_id
  // -------------------------------------------------------------------------
  fastify.get("/messages/threads", async () => {
    const messages = await prisma.message.findMany({
      orderBy: { created_at: "desc" },
      take: 200,
    });

    const threadMap = new Map<string, typeof messages[number]>();
    for (const msg of messages) {
      const key = msg.booking_id == null ? "unassigned" : String(msg.booking_id);
      if (!threadMap.has(key)) {
        threadMap.set(key, msg);
      }
    }

    return Array.from(threadMap.entries()).map(([threadId, last]) => ({
      id: threadId,
      bookingId: last.booking_id,
      lastMessage: {
        id: String(last.id),
        content: last.body ? decryptField(last.body) : last.body,
        sentAt: last.created_at.toISOString(),
      },
      unreadCount: 0,
    }));
  });

  // -------------------------------------------------------------------------
  // GET /messages/threads/:threadId — messages in one thread
  // -------------------------------------------------------------------------
  fastify.get("/messages/threads/:threadId", async (request) => {
    const { threadId } = request.params as any;
    const bookingId = threadId === "unassigned" ? null : parseInt(threadId, 10);

    const messages = await prisma.message.findMany({
      where: bookingId != null && !isNaN(bookingId)
        ? { booking_id: bookingId }
        : { booking_id: null },
      orderBy: { created_at: "asc" },
    });

    return {
      thread: { id: threadId },
      messages: messages.map((m) => ({
        id: String(m.id),
        content: m.body ? decryptField(m.body) : m.body,
        sender: m.sender,
        sentAt: m.created_at.toISOString(),
      })),
    };
  });

  // -------------------------------------------------------------------------
  // POST /messages/send — send to a thread (alias for POST /messages)
  // -------------------------------------------------------------------------
  fastify.post("/messages/send", async (request, reply) => {
    const body = request.body as any;
    const parsed = createMessageSchema.safeParse({
      booking_id: typeof body.booking_id === "number" ? body.booking_id : undefined,
      sender: body.senderId || body.sender || "host",
      body: body.content || body.body || "",
    });

    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid message payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const { booking_id, sender, body: msgBody } = parsed.data;

    const message = await prisma.message.create({
      data: {
        booking_id: booking_id ?? null,
        sender,
        body: msgBody ? encryptField(msgBody) : msgBody,
      },
    });

    return {
      id: String(message.id),
      senderId: message.sender,
      content: message.body ? decryptField(message.body) : message.body,
      sentAt: message.created_at.toISOString(),
    };
  });
}
