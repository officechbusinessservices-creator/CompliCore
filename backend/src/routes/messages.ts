import { FastifyInstance } from "fastify";
import { query } from "../db";

export default async function messagesRoutes(fastify: FastifyInstance) {
  fastify.get("/messages", async (request, reply) => {
    try {
      const res = await query("SELECT id, booking_id, sender, body, created_at FROM messages ORDER BY created_at DESC LIMIT 50");
      return res.rows;
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
        [body.booking_id, body.sender, body.body]
      );
      return res.rows[0];
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
