import { buildServer } from "./server";

async function start() {
  const fastify = await buildServer();
  const port = Number(process.env.PORT || 4000);
  await fastify.listen({ port, host: "0.0.0.0" });
  fastify.log.info(`server listening on ${port}`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
