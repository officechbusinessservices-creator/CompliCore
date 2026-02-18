import { FastifyInstance } from "fastify";

function buildAuthResponse(fastify: FastifyInstance, user: any) {
  const accessToken = (fastify as any).jwt.sign({
    userId: user.id,
    email: user.email,
    roles: user.roles || ["guest"],
  });
  const refreshToken = (fastify as any).jwt.sign({ userId: user.id, type: "refresh" });
  return {
    accessToken,
    refreshToken,
    expiresIn: 3600,
    user,
    // backward-compatible field
    token: accessToken,
  };
}

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/register", async (request) => {
    const body = request.body as any;
    const user = {
      id: "dev-user-id",
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      displayName: `${body.firstName} ${body.lastName}`,
      roles: body.role ? [body.role] : ["guest"],
      createdAt: new Date().toISOString(),
    };
    return buildAuthResponse(fastify, user);
  });

  fastify.post("/auth/login", async (request) => {
    const body = request.body as any;
    const user = {
      id: "dev-user-id",
      email: body.email || "dev@local",
      firstName: "Dev",
      lastName: "User",
      displayName: "Dev User",
      roles: body.role ? [body.role] : ["guest"],
      createdAt: new Date().toISOString(),
    };
    return buildAuthResponse(fastify, user);
  });

  fastify.post("/auth/refresh", async (request) => {
    const user = {
      id: "dev-user-id",
      email: "dev@local",
      firstName: "Dev",
      lastName: "User",
      displayName: "Dev User",
      roles: ["guest"],
      createdAt: new Date().toISOString(),
    };
    return buildAuthResponse(fastify, user);
  });

  // Backward compatible dev endpoint
  fastify.get("/auth/me", async (request, reply) => {
    try {
      const req = request as any;
      await req.jwtVerify();
      return { id: "dev-user-id", email: "dev@local", firstName: "Dev", lastName: "User" };
    } catch (err) {
      return reply.status(401).send({ error: "unauthorized" });
    }
  });
}
