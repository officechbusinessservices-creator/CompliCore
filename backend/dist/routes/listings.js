"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = listingsRoutes;
const db_1 = require("../db");
async function listingsRoutes(fastify) {
    fastify.get("/listings", async (request, reply) => {
        try {
            const res = await (0, db_1.query)("SELECT id, title, address, price_per_night FROM listings ORDER BY id DESC LIMIT 50");
            return res.rows;
        }
        catch (err) {
            // dev fallback
            return [
                { id: 101, title: "Modern Downtown Loft", address: "123 Main St", price_per_night: 150 },
                { id: 102, title: "Cozy Studio", address: "45 Maple Ave", price_per_night: 85 },
            ];
        }
    });
}
