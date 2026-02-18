"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reviewsRoutes;
async function reviewsRoutes(fastify) {
    fastify.post("/reviews", async (request, reply) => {
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["guest", "host", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        const body = request.body;
        return {
            id: "demo-review",
            bookingId: body.bookingId,
            overallRating: body.overallRating,
            categoryRatings: body.categoryRatings || {},
            comment: body.comment,
            createdAt: new Date().toISOString(),
        };
    });
    fastify.get("/properties/:propertyId/reviews", async (request, reply) => {
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
