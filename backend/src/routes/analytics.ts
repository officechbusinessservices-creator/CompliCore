import { FastifyInstance } from "fastify";

export default async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.get("/analytics/dashboard", async () => {
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
