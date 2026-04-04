import { FastifyInstance } from "fastify";

const demoProviders = [
  { id: "guesty", name: "Guesty", status: "connected", lastSync: "2 minutes ago", properties: 12, reservations: 847 },
  { id: "hostaway", name: "Hostaway", status: "connected", lastSync: "5 minutes ago", properties: 8, reservations: 423 },
  { id: "lodgify", name: "Lodgify", status: "disconnected", lastSync: null, properties: 0, reservations: 0 },
  { id: "hostfully", name: "Hostfully", status: "error", lastSync: "1 hour ago", properties: 5, reservations: 156, error: "API authentication expired" },
  { id: "beds24", name: "Beds24", status: "connected", lastSync: "15 minutes ago", properties: 3, reservations: 89 },
];

const demoHistory = [
  { id: 1, providerId: "guesty", type: "Full Sync", status: "success", timestamp: "2026-02-03T10:30:00", duration: "45s" },
  { id: 2, providerId: "hostaway", type: "Reservations", status: "success", timestamp: "2026-02-03T10:25:00", duration: "12s" },
  { id: 3, providerId: "hostfully", type: "Properties", status: "error", timestamp: "2026-02-03T09:15:00", duration: "5s" },
];

export default async function pmsRoutes(fastify: FastifyInstance) {
  fastify.get("/pms/providers", async () => ({ data: demoProviders }));

  fastify.post("/pms/connect", async (request) => {
    const body = request.body as any;
    return { status: "connected", providerId: body.providerId };
  });

  fastify.post("/pms/sync", async (request) => {
    const body = request.body as any;
    return { status: "syncing", providerId: body.providerId || "all" };
  });

  fastify.get("/pms/status", async () => ({
    connected: demoProviders.filter((p) => p.status === "connected").length,
    lastSync: "2 minutes ago",
  }));

  fastify.get("/pms/history", async () => ({ data: demoHistory }));

  fastify.post("/pms/import", async (request) => {
    const body = request.body as any;
    return { status: "imported", source: body.source, imported: 3 };
  });
}
