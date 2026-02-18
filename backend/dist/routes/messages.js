"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = messagesRoutes;
const db_1 = require("../db");
const env_1 = require("../lib/env");
const encryption_1 = require("../lib/encryption");
const exportWindowMs = 60 * 1000;
const exportTracker = new Map();
function getTrackerKey(request) {
    return request.user?.userId || request.ip || "anonymous";
}
function checkExportLimit(request) {
    const key = getTrackerKey(request);
    const now = Date.now();
    const existing = exportTracker.get(key);
    if (!existing || existing.resetAt < now) {
        exportTracker.set(key, { count: 1, resetAt: now + exportWindowMs });
        return true;
    }
    existing.count += 1;
    return existing.count <= env_1.env.DATA_EXPORT_LIMIT_PER_MINUTE;
}
function parseHoneytokens() {
    return env_1.env.HONEYTOKEN_IDS.split(",").map((id) => id.trim()).filter(Boolean);
}
async function messagesRoutes(fastify) {
    fastify.get("/messages", async (request, reply) => {
        const req = request;
        if (!checkExportLimit(req)) {
            return reply.status(429).send({ error: "export limit exceeded" });
        }
        try {
            const res = await (0, db_1.query)("SELECT id, booking_id, sender, body, created_at FROM messages ORDER BY created_at DESC LIMIT 50");
            const honeytokens = new Set(parseHoneytokens());
            if (res.rows.some((row) => honeytokens.has(String(row.id)))) {
                request.log.warn({ honeytoken: true, route: "/messages" }, "honeytoken access detected");
            }
            return res.rows.map((row) => ({
                ...row,
                body: row.body ? (0, encryption_1.decryptField)(row.body) : row.body,
            }));
        }
        catch (err) {
            return [
                { id: 1, booking_id: 1, sender: "host", body: "Welcome! Let me know if you need anything.", created_at: new Date() },
                { id: 2, booking_id: 1, sender: "guest", body: "Thanks! Where is the key?", created_at: new Date() },
            ];
        }
    });
    fastify.post("/messages", async (request, reply) => {
        const body = request.body;
        try {
            const res = await (0, db_1.query)("INSERT INTO messages (booking_id, sender, body) VALUES ($1,$2,$3) RETURNING id, booking_id, sender, body, created_at", [body.booking_id, body.sender, body.body ? (0, encryption_1.encryptField)(body.body) : body.body]);
            const row = res.rows[0];
            return {
                ...row,
                body: row.body ? (0, encryption_1.decryptField)(row.body) : row.body,
            };
        }
        catch (err) {
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
        const { threadId } = request.params;
        return {
            thread: { id: threadId },
            messages: [
                { id: "demo-message", content: "Welcome!", sentAt: new Date().toISOString() },
            ],
        };
    });
    fastify.post("/messages/send", async (request) => {
        const body = request.body;
        return {
            id: "demo-message",
            senderId: "dev-user-id",
            content: body.content,
            sentAt: new Date().toISOString(),
        };
    });
}
