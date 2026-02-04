import { FastifyInstance } from "fastify";
import { query } from "../db";

export default async function listingsRoutes(fastify: FastifyInstance) {
  fastify.get("/listings", async (request, reply) => {
    try {
      const res = await query("SELECT id, title, address, price_per_night FROM listings ORDER BY id DESC LIMIT 50");
      return res.rows;
    } catch (err) {
      // dev fallback
      return [
        { id: 101, title: "Modern Downtown Loft", address: "123 Main St", price_per_night: 150 },
        { id: 102, title: "Cozy Studio", address: "45 Maple Ave", price_per_night: 85 },
      ];
    }
  });
}
