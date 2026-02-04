import { FastifyInstance } from "fastify";

export default async function reviewsRoutes(fastify: FastifyInstance) {
  fastify.post("/reviews", async (request, reply) => {
    const req = request as any;
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(req, reply, ["guest", "host", "admin"]);
      if (reply.sent) return;
      if (res) return res;
    }
    const body = request.body as any;
    return {
      id: "demo-review",
      bookingId: body.bookingId,
      overallRating: body.overallRating,
      categoryRatings: body.categoryRatings || {},
      comment: body.comment,
      createdAt: new Date().toISOString(),
    };
  });

  fastify.get("/properties/:propertyId/reviews", async (request) => {
    const { propertyId } = request.params as any;
    return {
      data: [
        {
          id: "demo-review",
          bookingId: "demo-booking",
          authorId: "dev-user-id",
          overallRating: 5,
          comment: "Great stay!",
          createdAt: new Date().toISOString(),
          propertyId,
        },
      ],
      pagination: { cursor: null, hasMore: false, limit: 20 },
      averageRating: 5,
      totalCount: 1,
    };
  });
}