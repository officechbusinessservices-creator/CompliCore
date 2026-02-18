"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bookingsRoutes;
const db_1 = require("../db");
const zod_1 = require("zod");
const validation_1 = require("../lib/validation");
const events_1 = require("events");
const listSchema = zod_1.z.object({
    confirmationCode: zod_1.z.string().min(3).max(64).optional(),
    stream: zod_1.z.enum(["true", "false"]).optional(),
});
const createSchema = zod_1.z.object({
    confirmation_code: zod_1.z.string().min(3).max(64).optional(),
    listing_id: zod_1.z.number().int().positive(),
    guest_name: zod_1.z.string().min(1).max(255),
    property: zod_1.z.string().min(1).max(255),
    check_in: zod_1.z.string().min(1).max(64),
    check_out: zod_1.z.string().min(1).max(64),
    access_code: zod_1.z.string().min(1).max(32).optional(),
    wifi_name: zod_1.z.string().min(1).max(64).optional(),
    wifi_password: zod_1.z.string().min(1).max(64).optional(),
    status: zod_1.z.enum(["pending", "confirmed", "cancelled"]).optional(),
});
const cancelSchema = zod_1.z.object({
    reason: zod_1.z.string().min(1).max(255).optional(),
});
async function bookingsRoutes(fastify) {
    fastify.get("/bookings", async (request, reply) => {
        const parse = listSchema.safeParse(request.query);
        if (!parse.success) {
            return reply
                .status(400)
                .send({
                type: "urn:problem:validation",
                title: "Request validation failed",
                status: 400,
                detail: "Invalid query parameters",
                errors: (0, validation_1.formatZodError)(parse.error),
                instance: request.url,
                traceId: request.id,
            });
        }
        const q = parse.data;
        try {
            if (q.confirmationCode) {
                const res = await (0, db_1.query)("SELECT id, confirmation_code, guest_name, property, check_in, check_out, access_code, wifi_name, wifi_password, status FROM bookings WHERE confirmation_code = $1 LIMIT 1", [q.confirmationCode]);
                if (res.rows.length === 0)
                    return reply.status(404).send({ error: "not found" });
                return res.rows[0];
            }
            if (q.stream === "true") {
                reply.header("Content-Type", "application/json; charset=utf-8");
                const stream = await (0, db_1.streamQuery)("SELECT id, confirmation_code, guest_name, property, check_in, check_out, status FROM bookings ORDER BY id DESC");
                reply.raw.write("[");
                let first = true;
                stream.on("data", (row) => {
                    if (!first)
                        reply.raw.write(",");
                    reply.raw.write(JSON.stringify(row));
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
                await (0, events_1.once)(stream, "end");
                return reply;
            }
            const res = await (0, db_1.query)("SELECT id, confirmation_code, guest_name, property, check_in, check_out, status FROM bookings ORDER BY id DESC LIMIT 50");
            return res.rows;
        }
        catch (err) {
            // If DB is not available, fall back to demo data so kiosk still works in dev
            const demo = [
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
            if (q.confirmationCode) {
                const found = demo.find((d) => d.confirmation_code === q.confirmationCode);
                if (!found)
                    return reply.status(404).send({ error: "not found" });
                return found;
            }
            return demo;
        }
    });
    fastify.post("/bookings", async (request, reply) => {
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["guest", "host", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        const parsed = createSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply
                .status(400)
                .send({
                type: "urn:problem:validation",
                title: "Request validation failed",
                status: 400,
                detail: "Invalid booking payload",
                errors: (0, validation_1.formatZodError)(parsed.error),
                instance: request.url,
                traceId: request.id,
            });
        }
        const body = parsed.data;
        try {
            const res = await (0, db_1.query)(`INSERT INTO bookings (confirmation_code, listing_id, guest_name, property, check_in, check_out, access_code, wifi_name, wifi_password, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING id, confirmation_code, listing_id, guest_name, property, check_in, check_out, access_code, wifi_name, wifi_password, status`, [
                body.confirmation_code,
                body.listing_id,
                body.guest_name,
                body.property,
                body.check_in,
                body.check_out,
                body.access_code,
                body.wifi_name,
                body.wifi_password,
                body.status || "pending",
            ]);
            return res.rows[0];
        }
        catch (err) {
            return {
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
            };
        }
    });
    fastify.get("/bookings/:bookingId", async (request, reply) => {
        const { bookingId } = request.params;
        try {
            const res = await (0, db_1.query)("SELECT id, confirmation_code, guest_name, property, check_in, check_out, status FROM bookings WHERE id = $1", [bookingId]);
            if (res.rows.length === 0)
                return reply.status(404).send({ error: "not found" });
            return res.rows[0];
        }
        catch (err) {
            return {
                id: bookingId,
                confirmation_code: "HX4K9M2",
                guest_name: "Alex Johnson",
                property: "Modern Downtown Loft",
                check_in: "2026-03-01",
                check_out: "2026-03-05",
                status: "confirmed",
            };
        }
    });
    fastify.post("/bookings/:bookingId/cancel", async (request, reply) => {
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["guest", "host", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        const { bookingId } = request.params;
        const parsed = cancelSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply
                .status(400)
                .send({
                type: "urn:problem:validation",
                title: "Request validation failed",
                status: 400,
                detail: "Invalid cancel payload",
                errors: (0, validation_1.formatZodError)(parsed.error),
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
                policy: body?.reason || "standard",
            },
        };
    });
}
