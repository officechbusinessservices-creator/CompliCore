"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = propertiesRoutes;
const db_1 = require("../db");
async function propertiesRoutes(fastify) {
    fastify.get("/properties", async (request) => {
        const q = request.query;
        try {
            const res = await (0, db_1.query)("SELECT id, title, description, property_type, room_type, bedrooms, beds, bathrooms, max_guests, amenities, status, created_at FROM properties ORDER BY created_at DESC LIMIT 50");
            return { data: res.rows, pagination: { cursor: null, hasMore: false, limit: 50 }, totalCount: res.rowCount };
        }
        catch (err) {
            return {
                data: [
                    {
                        id: "demo-property",
                        title: "Modern Downtown Loft",
                        description: "A beautiful loft in the city center.",
                        propertyType: "loft",
                        roomType: "entire_place",
                        bedrooms: 1,
                        beds: 1,
                        bathrooms: 1,
                        maxGuests: 2,
                        amenities: ["wifi", "kitchen"],
                        status: "listed",
                        createdAt: new Date().toISOString(),
                    },
                ],
                pagination: { cursor: null, hasMore: false, limit: 20 },
                totalCount: 1,
            };
        }
    });
    fastify.post("/properties", async (request, reply) => {
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["host", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        const body = request.body;
        try {
            const res = await (0, db_1.query)(`INSERT INTO properties (host_id, address_id, title, description, property_type, room_type, bedrooms, beds, bathrooms, max_guests, amenities, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         RETURNING id, title, description, property_type, room_type, bedrooms, beds, bathrooms, max_guests, amenities, status, created_at`, [
                body.hostId || "00000000-0000-0000-0000-000000000000",
                body.addressId || "00000000-0000-0000-0000-000000000000",
                body.title,
                body.description,
                body.propertyType,
                body.roomType || "entire_place",
                body.bedrooms || 1,
                body.beds || 1,
                body.bathrooms || 1,
                body.maxGuests || 2,
                body.amenities || [],
                body.status || "draft",
            ]);
            return res.rows[0];
        }
        catch (err) {
            return {
                id: "demo-property",
                title: body.title,
                description: body.description,
                propertyType: body.propertyType,
                roomType: body.roomType || "entire_place",
                bedrooms: body.bedrooms || 1,
                beds: body.beds || 1,
                bathrooms: body.bathrooms || 1,
                maxGuests: body.maxGuests || 2,
                amenities: body.amenities || [],
                status: body.status || "draft",
                createdAt: new Date().toISOString(),
            };
        }
    });
    fastify.get("/properties/:propertyId", async (request, reply) => {
        const { propertyId } = request.params;
        try {
            const res = await (0, db_1.query)("SELECT id, title, description, property_type, room_type, bedrooms, beds, bathrooms, max_guests, amenities, status, created_at FROM properties WHERE id = $1", [propertyId]);
            if (res.rows.length === 0)
                return reply.status(404).send({ error: "not found" });
            return res.rows[0];
        }
        catch (err) {
            return {
                id: propertyId,
                title: "Modern Downtown Loft",
                description: "A beautiful loft in the city center.",
                propertyType: "loft",
                roomType: "entire_place",
                bedrooms: 1,
                beds: 1,
                bathrooms: 1,
                maxGuests: 2,
                amenities: ["wifi", "kitchen"],
                status: "listed",
                createdAt: new Date().toISOString(),
            };
        }
    });
    fastify.patch("/properties/:propertyId", async (request, reply) => {
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["host", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        const { propertyId } = request.params;
        const body = request.body;
        return {
            id: propertyId,
            title: body.title || "Modern Downtown Loft",
            description: body.description,
            amenities: body.amenities || ["wifi"],
            status: body.status || "listed",
        };
    });
    fastify.delete("/properties/:propertyId", async (request, reply) => {
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["host", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        return reply.status(204).send();
    });
    fastify.get("/properties/:propertyId/availability", async (request) => {
        const { propertyId } = request.params;
        const q = request.query;
        return {
            propertyId,
            dates: [
                { date: q.startDate || new Date().toISOString().slice(0, 10), status: "available", price: 150, minNights: 2 },
            ],
        };
    });
    fastify.patch("/properties/:propertyId/availability", async (request, reply) => {
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["host", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        return { updated: true };
    });
    fastify.get("/properties/:propertyId/pricing", async () => {
        return {
            basePrice: 150,
            currency: "USD",
            rules: [],
        };
    });
    fastify.post("/properties/:propertyId/quote", async () => {
        return {
            available: true,
            pricing: {
                nightlyRate: 150,
                nights: 2,
                subtotal: 300,
                cleaningFee: 40,
                serviceFee: 20,
                taxes: 30,
                total: 390,
                currency: "USD",
            },
        };
    });
}
