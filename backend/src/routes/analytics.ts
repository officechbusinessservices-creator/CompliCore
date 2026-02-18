import { FastifyInstance } from "fastify";

export default async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.get("/analytics/dashboard", async (request, reply) => {
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(request as any, reply, ["host", "admin", "enterprise", "corporate"]);
      if (reply.sent) return;
      if (res) return res;
    }
    return {
      period: { start: new Date().toISOString().slice(0, 10), end: new Date().toISOString().slice(0, 10) },
      metrics: {
        totalBookings: 42,
        totalRevenue: 12500,
        averageDailyRate: 180,
        occupancyRate: 0.76,
        averageRating: 4.8,
      },
      bookingsBySource: [
        { source: "direct", count: 20, revenue: 6000 },
        { source: "airbnb", count: 15, revenue: 4500 },
        { source: "vrbo", count: 7, revenue: 2000 },
      ],
      upcomingBookings: [],
    };
  });
}
