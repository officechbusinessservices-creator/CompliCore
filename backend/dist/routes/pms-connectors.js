"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pmsConnectorRoutes;
const connectors = [
    { id: "guesty", name: "Guesty", authType: "oauth", status: "configured", docsUrl: "https://developers.guesty.com/" },
    { id: "hostaway", name: "Hostaway", authType: "apiKey", status: "configured", docsUrl: "https://api.hostaway.com/documentation" },
    { id: "beds24", name: "Beds24", authType: "apiKey", status: "configured", docsUrl: "https://wiki.beds24.com/index.php/API" },
];
async function pmsConnectorRoutes(fastify) {
    fastify.get("/pms/connectors", async () => ({ data: connectors }));
    fastify.post("/pms/connectors/:providerId/connect", async (request) => {
        const { providerId } = request.params;
        return { status: "connected", providerId };
    });
    fastify.post("/pms/connectors/:providerId/webhook", async (request) => {
        const { providerId } = request.params;
        const body = request.body;
        return { status: "received", providerId, event: body?.event || "unknown" };
    });
    fastify.post("/pms/connectors/:providerId/sync", async (request) => {
        const { providerId } = request.params;
        return { status: "queued", providerId, jobId: `job_${Date.now()}` };
    });
}
