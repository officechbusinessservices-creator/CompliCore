import { FastifyInstance } from "fastify";

type Connector = {
  id: string;
  name: string;
  authType: "oauth" | "apiKey";
  status: "disabled" | "configured" | "connected";
  docsUrl: string;
};

const connectors: Connector[] = [
  { id: "guesty", name: "Guesty", authType: "oauth", status: "configured", docsUrl: "https://developers.guesty.com/" },
  { id: "hostaway", name: "Hostaway", authType: "apiKey", status: "configured", docsUrl: "https://api.hostaway.com/documentation" },
  { id: "beds24", name: "Beds24", authType: "apiKey", status: "configured", docsUrl: "https://wiki.beds24.com/index.php/API" },
];

export default async function pmsConnectorRoutes(fastify: FastifyInstance) {
  fastify.get("/pms/connectors", async () => ({ data: connectors }));

  fastify.post("/pms/connectors/:providerId/connect", async (request) => {
    const { providerId } = request.params as any;
    return { status: "connected", providerId };
  });

  fastify.post("/pms/connectors/:providerId/webhook", async (request) => {
    const { providerId } = request.params as any;
    const body = request.body as any;
    return { status: "received", providerId, event: body?.event || "unknown" };
  });

  fastify.post("/pms/connectors/:providerId/sync", async (request) => {
    const { providerId } = request.params as any;
    return { status: "queued", providerId, jobId: `job_${Date.now()}` };
  });
}
