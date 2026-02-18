"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const env_1 = require("./lib/env");
const socket_1 = require("./realtime/socket");
async function start() {
    const fastify = await (0, server_1.buildServer)();
    await (0, socket_1.setupRealtime)(fastify);
    const port = env_1.env.PORT;
    await fastify.listen({ port, host: "0.0.0.0" });
    fastify.log.info(`server listening on ${port}`);
    let shuttingDown = false;
    const gracefulShutdown = async (signal) => {
        if (shuttingDown)
            return;
        shuttingDown = true;
        fastify.log.info({ signal }, "signal received, shutting down gracefully");
        try {
            await fastify.close();
            fastify.log.info("process terminated cleanly");
            process.exit(0);
        }
        catch (err) {
            fastify.log.error({ err }, "graceful shutdown failed");
            process.exit(1);
        }
    };
    process.on("SIGTERM", () => {
        void gracefulShutdown("SIGTERM");
    });
    process.on("SIGINT", () => {
        void gracefulShutdown("SIGINT");
    });
}
start().catch((err) => {
    console.error(err);
    process.exit(1);
});
