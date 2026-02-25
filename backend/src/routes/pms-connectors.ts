import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { env } from "../lib/env";
import { appendSecurityAuditEvent } from "../lib/security-audit";

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

function extractWebhookSignature(headers: Record<string, unknown>) {
  const rawHeader =
    headers["x-pms-signature"] ||
    headers["x-complicore-signature"] ||
    headers["x-signature"];

  if (typeof rawHeader !== "string") return null;
  const normalized = rawHeader.trim().replace(/^sha256=/i, "");
  return normalized || null;
}

function computeWebhookHmac(secret: string, payload: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function secureCompare(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function canonicalPayload(body: unknown) {
  if (typeof body === "string") return body;
  return JSON.stringify(body ?? {});
}

export default async function pmsConnectorRoutes(fastify: FastifyInstance) {
  fastify.get("/pms/connectors", async () => ({ data: connectors }));

  fastify.post("/pms/connectors/:providerId/connect", async (request) => {
    const { providerId } = request.params as any;
    return { status: "connected", providerId };
  });

  fastify.post("/pms/connectors/:providerId/webhook", async (request, reply) => {
    const { providerId } = request.params as any;
    const body = request.body as any;
    const signatureSecret = env.PMS_WEBHOOK_SECRET.trim();
    const signature = extractWebhookSignature(request.headers as Record<string, unknown>);
    const payload = canonicalPayload(body);

    if (signatureSecret) {
      const expectedSignature = computeWebhookHmac(signatureSecret, payload);
      if (!signature || !secureCompare(signature, expectedSignature)) {
        request.log.warn({ providerId, ip: request.ip }, "webhook rejected due to signature verification failure");
        void appendSecurityAuditEvent({
          eventType: "pms_webhook_rejected_invalid_signature",
          severity: "critical",
          ip: request.ip,
          traceId: request.id,
          details: { providerId },
        });
        return reply.status(401).send({ error: "invalid webhook signature" });
      }
    }

    void appendSecurityAuditEvent({
      eventType: "pms_webhook_received",
      severity: "info",
      ip: request.ip,
      traceId: request.id,
      details: {
        providerId,
        event: body?.event || "unknown",
      },
    });

    return { status: "received", providerId, event: body?.event || "unknown" };
  });

  fastify.post("/pms/connectors/:providerId/sync", async (request) => {
    const { providerId } = request.params as any;
    return { status: "queued", providerId, jobId: `job_${Date.now()}` };
  });
}
