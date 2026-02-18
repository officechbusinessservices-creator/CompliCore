import { FastifyInstance } from "fastify";

export default async function moduleRoutes(fastify: FastifyInstance) {
  const requireOpsRole = async (request: any, reply: any) => {
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(request, reply, ["host", "admin", "enterprise", "corporate", "cleaner", "maintenance"]);
      if (reply.sent) return false;
      if (res) return false;
    }
    return true;
  };
  fastify.get("/modules/overview", async (request, reply) => {
    const ok = await requireOpsRole(request, reply);
    if (!ok) return;
    return {
    data: [
      { id: "channels", status: "ready" },
      { id: "cleaning", status: "ready" },
      { id: "maintenance", status: "ready" },
      { id: "seasonal-pricing", status: "ready" },
      { id: "marketplace", status: "ready" },
      { id: "integrations", status: "ready" },
      { id: "payouts", status: "ready" },
      { id: "taxes", status: "ready" },
    ],
    };
  });

  fastify.get("/channels", async (request, reply) => {
    const ok = await requireOpsRole(request, reply);
    if (!ok) return;
    return { data: [{ id: "airbnb", name: "Airbnb", status: "connected" }] };
  });
  fastify.get("/cleaning/tasks", async (request, reply) => {
    const ok = await requireOpsRole(request, reply);
    if (!ok) return;
    return { data: [{ id: "clean-1", property: "Loft", status: "scheduled" }] };
  });
  fastify.get("/maintenance/tasks", async (request, reply) => {
    const ok = await requireOpsRole(request, reply);
    if (!ok) return;
    return { data: [{ id: "maint-1", title: "HVAC check", status: "open" }] };
  });
  fastify.get("/pricing/seasonal", async () => ({ data: [{ id: "peak", name: "Summer Peak", adjustment: 20 }] }));
  // payouts handled in payments routes
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
  fastify.get("/bundles", async () => ({
    data: [
      {
        id: "bundle-1",
        name: "Family Reunion Package",
        description: "Bundle 2 nearby homes with shared spaces and priority support.",
        properties: [
          { id: "prop-1", title: "Modern Downtown Loft", pricing: { basePrice: 180, cleaningFee: 65 }, photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600"] },
          { id: "prop-2", title: "Cozy Studio", pricing: { basePrice: 120, cleaningFee: 45 }, photos: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600"] },
        ],
        discount: 15,
        minNights: 3,
        maxGuests: 6,
        totalBasePrice: 300,
        bundlePrice: 255,
        savings: 45,
        features: ["Shared outdoor space", "Group messaging", "Flexible check-in"],
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
      },
    ],
  }));
  fastify.get("/marketplace", async () => ({
    data: [
      { id: "ai-power-up", name: "AI Power-Up", price: 28, cadence: "monthly", status: "available" },
      { id: "dynamic-pricing", name: "Dynamic Pricing", price: 35, cadence: "monthly", status: "available" },
      { id: "insurance", name: "Host Protection", price: 15, cadence: "monthly", status: "available" },
      { id: "photography", name: "Photography", price: 199, cadence: "one-time", status: "available" },
      { id: "cleaning-services", name: "Cleaning Services", price: 20, cadence: "per-turnover", status: "available" },
    ],
  }));
  fastify.get("/integrations", async () => ({
    data: [
      { id: "airbnb", type: "ota", name: "Airbnb", status: "supported" },
      { id: "vrbo", type: "ota", name: "Vrbo", status: "supported" },
      { id: "booking", type: "ota", name: "Booking.com", status: "supported" },
      { id: "expedia", type: "ota", name: "Expedia", status: "supported" },
      { id: "concur", type: "corporate", name: "Concur", status: "supported" },
      { id: "navan", type: "corporate", name: "Navan", status: "supported" },
      { id: "cwt", type: "corporate", name: "CWT", status: "supported" },
      { id: "pricelabs", type: "pricing", name: "PriceLabs", status: "supported" },
      { id: "beyond", type: "pricing", name: "Beyond", status: "supported" },
      { id: "remotelock", type: "iot", name: "RemoteLock", status: "supported" },
      { id: "august", type: "iot", name: "August", status: "supported" },
      { id: "breezeway", type: "ops", name: "Breezeway", status: "supported" },
      { id: "turno", type: "ops", name: "Turno", status: "supported" },
    ],
  }));
}
