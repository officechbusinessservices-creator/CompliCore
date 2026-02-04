import { FastifyInstance } from "fastify";

export default async function moduleRoutes(fastify: FastifyInstance) {
  fastify.get("/modules/overview", async () => ({
    data: [
      { id: "channels", status: "ready" },
      { id: "cleaning", status: "ready" },
      { id: "maintenance", status: "ready" },
      { id: "seasonal-pricing", status: "ready" },
      { id: "payouts", status: "ready" },
      { id: "taxes", status: "ready" },
    ],
  }));

  fastify.get("/channels", async () => ({ data: [{ id: "airbnb", name: "Airbnb", status: "connected" }] }));
  fastify.get("/cleaning/tasks", async () => ({ data: [{ id: "clean-1", property: "Loft", status: "scheduled" }] }));
  fastify.get("/maintenance/tasks", async () => ({ data: [{ id: "maint-1", title: "HVAC check", status: "open" }] }));
  fastify.get("/pricing/seasonal", async () => ({ data: [{ id: "peak", name: "Summer Peak", adjustment: 20 }] }));
  fastify.get("/payouts", async () => ({ data: [{ id: "payout-1", amount: 1200, status: "paid" }] }));
  fastify.get("/taxes/reports", async () => ({ data: [{ id: "tax-1", year: 2025, total: 3200 }] }));
  fastify.get("/loyalty", async () => ({ data: { points: 1200, tier: "Gold" } }));
  fastify.get("/sustainability", async () => ({ data: { score: 82, carbonOffset: 12.5 } }));
  fastify.get("/tickets", async () => ({ data: [{ id: "ticket-1", title: "Noise complaint", status: "open" }] }));
  fastify.get("/insurance/policies", async () => ({ data: [{ id: "policy-1", status: "active" }] }));
  fastify.get("/forecasting", async () => ({ data: { occupancy: 78, revenue: 12450 } }));
  fastify.get("/benchmarks", async () => ({ data: { adr: 185, occ: 74 } }));
  fastify.get("/occupancy", async () => ({ data: { occupancy: 72 } }));
  fastify.get("/calendar-sync", async () => ({ data: { status: "connected" } }));
  fastify.get("/map/properties", async () => ({ data: [] }));
  fastify.get("/compare", async () => ({ data: [] }));
  fastify.get("/wishlist", async () => ({ data: [] }));
}
