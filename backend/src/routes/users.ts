import { FastifyInstance } from "fastify";

export default async function usersRoutes(fastify: FastifyInstance) {
  fastify.get("/users/me", async (request, reply) => {
    try {
      const req = request as any;
      await req.jwtVerify();
      return {
        id: "dev-user-id",
        email: "dev@local",
        firstName: "Dev",
        lastName: "User",
        displayName: "Dev User",
        roles: ["guest"],
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      return reply.status(401).send({ error: "unauthorized" });
    }
  });

  fastify.patch("/users/me", async (request, reply) => {
    try {
      const req = request as any;
      await req.jwtVerify();
      const body = request.body as any;
      return {
        id: "dev-user-id",
        email: "dev@local",
        firstName: body.firstName || "Dev",
        lastName: body.lastName || "User",
        displayName: body.displayName || "Dev User",
        roles: ["guest"],
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      return reply.status(401).send({ error: "unauthorized" });
    }
  });
}
