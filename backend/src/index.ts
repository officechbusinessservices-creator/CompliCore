import { buildServer } from "./server";
import { env } from "./lib/env";
import { setupRealtime } from "./realtime/socket";

async function start() {
  const fastify = await buildServer();
  await setupRealtime(fastify);
  const port = env.PORT;
  await fastify.listen({ port, host: "0.0.0.0" });
  fastify.log.info(`server listening on ${port}`);

  let shuttingDown = false;
  const gracefulShutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    fastify.log.info({ signal }, "signal received, shutting down gracefully");

    try {
      await fastify.close();
      fastify.log.info("process terminated cleanly");
      process.exit(0);
    } catch (err) {
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
