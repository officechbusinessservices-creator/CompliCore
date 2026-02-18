import type { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { env } from "../lib/env";
import { verifyTokenWithRotation } from "../lib/jwt-rotation";

type JwtPayload = {
  userId: string;
  email?: string;
  roles?: string[];
  typ?: string;
};

function getCookieValue(cookieHeader: string, key: string): string | undefined {
  const chunks = cookieHeader.split(";").map((c) => c.trim());
  for (const chunk of chunks) {
    const [k, ...rest] = chunk.split("=");
    if (k === key) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export async function setupRealtime(fastify: FastifyInstance) {
  const wsOrigins = env.WS_ALLOWED_ORIGINS.split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const io = new Server(fastify.server, {
    cors: {
      origin: wsOrigins,
      credentials: true,
    },
  });

  if (env.WS_ENABLE_REDIS_ADAPTER && env.REDIS_URL) {
    const pubClient = createClient({ url: env.REDIS_URL });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));

    fastify.addHook("onClose", async () => {
      await Promise.all([pubClient.quit(), subClient.quit()]);
    });
  }

  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || "";
      const token = getCookieValue(cookieHeader, env.ACCESS_TOKEN_COOKIE_NAME);

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = verifyTokenWithRotation(fastify, token) as JwtPayload;
      if (payload?.typ !== "access" || !payload?.userId) {
        return next(new Error("Unauthorized"));
      }

      socket.data.userId = payload.userId;
      socket.data.email = payload.email;
      socket.data.roles = payload.roles || ["guest"];
      return next();
    } catch {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    fastify.log.info({ socketId: socket.id, userId: socket.data.userId }, "socket connected");

    socket.on("send_message", (data) => {
      io.emit("receive_message", {
        ...data,
        senderId: socket.data.userId,
        sentAt: new Date().toISOString(),
      });
    });

    socket.on("disconnect", (reason) => {
      fastify.log.info({ socketId: socket.id, userId: socket.data.userId, reason }, "socket disconnected");
    });
  });

  fastify.addHook("onClose", async () => {
    io.removeAllListeners();
    io.close();
  });

  return io;
}
