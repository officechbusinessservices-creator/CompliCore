import { FastifyInstance } from "fastify";
import { query } from "../db";
import { env } from "../lib/env";
import { encryptField, decryptField } from "../lib/encryption";

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
  return env.HONEYTOKEN_IDS.split(",").map((id) => id.trim()).filter(Boolean);
}

export default async function messagesRoutes(fastify: FastifyInstance) {
  fastify.get("/messages", async (request, reply) => {
    const req = request as any;
    if (!checkExportLimit(req)) {
      return reply.status(429).send({ error: "export limit exceeded" });
    }
    try {
      const res = await query("SELECT id, booking_id, sender, body, created_at FROM messages ORDER BY created_at DESC LIMIT 50");
      const honeytokens = new Set(parseHoneytokens());
      if (res.rows.some((row: Record<string, unknown>) => honeytokens.has(String(row.id)))) {
        request.log.warn({ honeytoken: true, route: "/messages" }, "honeytoken access detected");
      }
      return res.rows.map((row: Record<string, unknown>) => ({
        ...row,
        body: row.body ? decryptField(row.body as string) : row.body,
      }));
    } catch (err) {
      return [
        { id: 1, booking_id: 1, sender: "host", body: "Welcome! Let me know if you need anything.", created_at: new Date() },
        { id: 2, booking_id: 1, sender: "guest", body: "Thanks! Where is the key?", created_at: new Date() },
      ];
    }
  });

  fastify.post("/messages", async (request, reply) => {
    const body = request.body as any;
    try {
      const res = await query(
        "INSERT INTO messages (booking_id, sender, body) VALUES ($1,$2,$3) RETURNING id, booking_id, sender, body, created_at",
        [body.booking_id, body.sender, body.body ? encryptField(body.body) : body.body]
      );
      const row = res.rows[0];
      return {
        ...row,
        body: row.body ? decryptField(row.body) : row.body,
      };
    } catch (err) {
      // echo back for dev
      return { id: Math.floor(Math.random() * 10000), booking_id: body.booking_id, sender: body.sender, body: body.body, created_at: new Date() };
    }
  });

  // OpenAPI-compatible endpoints
  fastify.get("/messages/threads", async () => {
    return [
      {
        id: "demo-thread",
        bookingId: "demo-booking",
        participants: [],
        lastMessage: { id: "demo-message", content: "Welcome!", sentAt: new Date().toISOString() },
        unreadCount: 0,
      },
    ];
  });

  fastify.get("/messages/threads/:threadId", async (request) => {
    const { threadId } = request.params as any;
    return {
      thread: { id: threadId },
      messages: [
        { id: "demo-message", content: "Welcome!", sentAt: new Date().toISOString() },
      ],
    };
  });

  fastify.post("/messages/send", async (request) => {
    const body = request.body as any;
    return {
      id: "demo-message",
      senderId: "dev-user-id",
      content: body.content,
      sentAt: new Date().toISOString(),
    };
  });
}
