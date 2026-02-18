"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRealtime = setupRealtime;
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
const env_1 = require("../lib/env");
const jwt_rotation_1 = require("../lib/jwt-rotation");
function getCookieValue(cookieHeader, key) {
    const chunks = cookieHeader.split(";").map((c) => c.trim());
    for (const chunk of chunks) {
        const [k, ...rest] = chunk.split("=");
        if (k === key)
            return decodeURIComponent(rest.join("="));
    }
    return undefined;
}
async function setupRealtime(fastify) {
    const wsOrigins = env_1.env.WS_ALLOWED_ORIGINS.split(",")
        .map((o) => o.trim())
        .filter(Boolean);
    const io = new socket_io_1.Server(fastify.server, {
        cors: {
            origin: wsOrigins,
            credentials: true,
        },
    });
    if (env_1.env.WS_ENABLE_REDIS_ADAPTER && env_1.env.REDIS_URL) {
        const pubClient = (0, redis_1.createClient)({ url: env_1.env.REDIS_URL });
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]);
        io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
        fastify.addHook("onClose", async () => {
            await Promise.all([pubClient.quit(), subClient.quit()]);
        });
    }
    io.use((socket, next) => {
        try {
            const cookieHeader = socket.handshake.headers.cookie || "";
            const token = getCookieValue(cookieHeader, env_1.env.ACCESS_TOKEN_COOKIE_NAME);
            if (!token) {
                return next(new Error("Unauthorized"));
            }
            const payload = (0, jwt_rotation_1.verifyTokenWithRotation)(fastify, token);
            if (payload?.typ !== "access" || !payload?.userId) {
                return next(new Error("Unauthorized"));
            }
            socket.data.userId = payload.userId;
            socket.data.email = payload.email;
            socket.data.roles = payload.roles || ["guest"];
            return next();
        }
        catch {
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
