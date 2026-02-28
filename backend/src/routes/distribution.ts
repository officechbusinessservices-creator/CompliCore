import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { z } from "zod";
import { env } from "../lib/env";
import { appendSecurityAuditEvent } from "../lib/security-audit";
import { formatZodError } from "../lib/validation";

// ─── In-memory store (demo; production: replace with DB) ───────────────────

type ConnectionStatus = "pending" | "active" | "error" | "disconnected";
type MappingStatus = "created" | "validated" | "active" | "drifted";

interface ChannelConnection {
  id: string;
  provider: "channex" | "channelrush" | string;
  environment: "sandbox" | "production";
  credentialsRef: string;
  status: ConnectionStatus;
  createdAt: string;
}

interface PropertyMapping {
  id: string;
  connectionId: string;
  propertyId: string;
  externalPropertyId: string;
  externalGroupId?: string;
  roomTypeMappings: RoomTypeMapping[];
  ratePlanMappings: RatePlanMapping[];
  status: MappingStatus;
  createdAt: string;
  lastValidatedAt?: string;
}

interface RoomTypeMapping {
  internalRoomTypeId: string;
  externalRoomTypeId: string;
  label?: string;
}

interface RatePlanMapping {
  internalRatePlanId: string;
  externalRatePlanId: string;
  label?: string;
}

interface AriPushRecord {
  id: string;
  propertyId: string;
  connectionId: string;
  type: "availability" | "rates" | "restrictions";
  dateFrom: string;
  dateTo: string;
  status: "queued" | "sent" | "acked" | "failed";
  sentAt?: string;
  ackedAt?: string;
  errorMessage?: string;
  createdAt: string;
}

interface BookingRevision {
  id: string;
  connectionId: string;
  channelCode: string;
  externalReservationId: string;
  externalRevisionId: string;
  revisionType: "new" | "modified" | "cancelled";
  propertyId?: string;
  roomTypeId?: string;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  amount?: number;
  currency?: string;
  paymentCollect?: string;
  status: "received" | "applied" | "acked" | "failed";
  receivedAt: string;
  appliedAt?: string;
  ackedAt?: string;
}

interface PropertySyncStatus {
  propertyId: string;
  lastAriPush?: string;
  lastAriAck?: string;
  lastReservationReceived?: string;
  lastReservationAcked?: string;
  lastContentPublish?: string;
  lastReconciliationRun?: string;
  outstandingErrors: string[];
  ariPushLagP95Ms?: number;
  reservationIngestLagP95Ms?: number;
}

// Mutable in-memory stores
const connections: ChannelConnection[] = [
  {
    id: "conn_demo_channex",
    provider: "channex",
    environment: "sandbox",
    credentialsRef: "secrets/channex/sandbox",
    status: "active",
    createdAt: "2026-01-15T09:00:00Z",
  },
];

const propertyMappings: PropertyMapping[] = [
  {
    id: "map_demo_1",
    connectionId: "conn_demo_channex",
    propertyId: "demo-property",
    externalPropertyId: "716305c4-561a-4561-a187-7f5b8aeb5920",
    externalGroupId: "group_abc123",
    roomTypeMappings: [
      { internalRoomTypeId: "rt_main", externalRoomTypeId: "994d1375-dbbd-4072-8724-b2ab32ce781b", label: "Main Unit" },
    ],
    ratePlanMappings: [
      { internalRatePlanId: "rp_bar", externalRatePlanId: "bab451e7-9ab1-4cc4-aa16-107bf7bbabb2", label: "Best Available Rate" },
    ],
    status: "active",
    createdAt: "2026-01-15T09:30:00Z",
    lastValidatedAt: "2026-02-28T08:00:00Z",
  },
];

const ariPushRecords: AriPushRecord[] = [
  {
    id: "ari_001",
    propertyId: "demo-property",
    connectionId: "conn_demo_channex",
    type: "availability",
    dateFrom: "2026-03-01",
    dateTo: "2026-03-31",
    status: "acked",
    sentAt: "2026-02-28T07:55:00Z",
    ackedAt: "2026-02-28T07:55:12Z",
    createdAt: "2026-02-28T07:54:50Z",
  },
  {
    id: "ari_002",
    propertyId: "demo-property",
    connectionId: "conn_demo_channex",
    type: "rates",
    dateFrom: "2026-03-01",
    dateTo: "2026-03-31",
    status: "acked",
    sentAt: "2026-02-28T07:55:05Z",
    ackedAt: "2026-02-28T07:55:18Z",
    createdAt: "2026-02-28T07:54:55Z",
  },
];

const bookingRevisions: BookingRevision[] = [
  {
    id: "rev_001",
    connectionId: "conn_demo_channex",
    channelCode: "ABB",
    externalReservationId: "AIRBNB-RES-7823",
    externalRevisionId: "rev_7823_001",
    revisionType: "new",
    propertyId: "demo-property",
    roomTypeId: "rt_main",
    guestName: "Jordan Lee",
    checkIn: "2026-03-10",
    checkOut: "2026-03-14",
    amount: 60000,
    currency: "USD",
    paymentCollect: "ota",
    status: "acked",
    receivedAt: "2026-02-27T18:30:00Z",
    appliedAt: "2026-02-27T18:30:08Z",
    ackedAt: "2026-02-27T18:30:08Z",
  },
  {
    id: "rev_002",
    connectionId: "conn_demo_channex",
    channelCode: "BDC",
    externalReservationId: "BDC-RES-5512",
    externalRevisionId: "rev_5512_001",
    revisionType: "new",
    propertyId: "demo-property",
    roomTypeId: "rt_main",
    guestName: "Sam Nguyen",
    checkIn: "2026-04-02",
    checkOut: "2026-04-05",
    amount: 45000,
    currency: "USD",
    paymentCollect: "hotel",
    status: "acked",
    receivedAt: "2026-02-28T11:10:00Z",
    appliedAt: "2026-02-28T11:10:06Z",
    ackedAt: "2026-02-28T11:10:06Z",
  },
];

// ─── Zod schemas ──────────────────────────────────────────────────────────

const createConnectionSchema = z.object({
  provider: z.string().min(1).max(64),
  environment: z.enum(["sandbox", "production"]).default("sandbox"),
  credentialsRef: z.string().min(1).max(255),
});

const createMappingSchema = z.object({
  propertyId: z.string().min(1).max(128),
  externalPropertyId: z.string().min(1).max(128),
  externalGroupId: z.string().min(1).max(128).optional(),
  roomTypeMappings: z
    .array(
      z.object({
        internalRoomTypeId: z.string().min(1).max(128),
        externalRoomTypeId: z.string().min(1).max(128),
        label: z.string().max(128).optional(),
      }),
    )
    .default([]),
  ratePlanMappings: z
    .array(
      z.object({
        internalRatePlanId: z.string().min(1).max(128),
        externalRatePlanId: z.string().min(1).max(128),
        label: z.string().max(128).optional(),
      }),
    )
    .default([]),
});

const ariPushSchema = z.object({
  connectionId: z.string().min(1).max(128),
  propertyId: z.string().min(1).max(128),
  type: z.enum(["availability", "rates", "restrictions"]),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD"),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD"),
  // ARI payload values (batched)
  values: z
    .array(
      z.object({
        roomTypeId: z.string().optional(),
        ratePlanId: z.string().optional(),
        date: z.string().optional(),
        availability: z.number().int().min(0).optional(),
        rate: z.number().int().min(0).optional(),
        minLos: z.number().int().min(1).optional(),
        maxLos: z.number().int().min(1).optional(),
        ctaBlocked: z.boolean().optional(),
        ctdBlocked: z.boolean().optional(),
      }),
    )
    .default([]),
});

const ingestReservationSchema = z.object({
  connectionId: z.string().min(1).max(128),
  channelCode: z.string().min(1).max(16),
  externalReservationId: z.string().min(1).max(128),
  externalRevisionId: z.string().min(1).max(128),
  revisionType: z.enum(["new", "modified", "cancelled"]),
  propertyId: z.string().min(1).max(128).optional(),
  roomTypeId: z.string().min(1).max(128).optional(),
  guestName: z.string().min(1).max(255).optional(),
  checkIn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  checkOut: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  amount: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  paymentCollect: z.string().max(32).optional(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────

function generateId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

function secureCompareHex(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "hex");
  const bBuf = Buffer.from(b, "hex");
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function computeWebhookHmac(secret: string, payload: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function buildSyncStatus(propertyId: string): PropertySyncStatus {
  const pushRecords = ariPushRecords
    .filter((r) => r.propertyId === propertyId)
    .sort((a, b) => (a.sentAt ?? "").localeCompare(b.sentAt ?? ""));

  const lastAcked = pushRecords.filter((r) => r.status === "acked").slice(-1)[0];
  const lastPush = pushRecords.slice(-1)[0];

  const revisions = bookingRevisions
    .filter((r) => r.propertyId === propertyId)
    .sort((a, b) => a.receivedAt.localeCompare(b.receivedAt));

  const lastRevAcked = revisions.filter((r) => r.status === "acked").slice(-1)[0];
  const lastRevReceived = revisions.slice(-1)[0];

  const errors: string[] = [];
  const failedPushes = ariPushRecords.filter((r) => r.propertyId === propertyId && r.status === "failed");
  for (const fp of failedPushes) {
    errors.push(`ARI push ${fp.id} failed: ${fp.errorMessage ?? "unknown error"}`);
  }

  // Fake p95 lag values computed from demo data
  const ariLagMs = lastAcked && lastAcked.sentAt && lastAcked.ackedAt
    ? new Date(lastAcked.ackedAt).getTime() - new Date(lastAcked.sentAt).getTime()
    : undefined;
  const reservationLagMs = lastRevAcked && lastRevAcked.appliedAt
    ? new Date(lastRevAcked.appliedAt).getTime() - new Date(lastRevAcked.receivedAt).getTime()
    : undefined;

  return {
    propertyId,
    lastAriPush: lastPush?.sentAt,
    lastAriAck: lastAcked?.ackedAt,
    lastReservationReceived: lastRevReceived?.receivedAt,
    lastReservationAcked: lastRevAcked?.ackedAt,
    outstandingErrors: errors,
    ariPushLagP95Ms: ariLagMs,
    reservationIngestLagP95Ms: reservationLagMs,
  };
}

// ─── Route registration ────────────────────────────────────────────────────

export default async function distributionRoutes(fastify: FastifyInstance) {
  // ── Channel Connections ──────────────────────────────────────────────────

  fastify.get("/distribution/connections", async () => ({
    data: connections,
    totalCount: connections.length,
  }));

  fastify.post("/distribution/connections", async (request, reply) => {
    const parsed = createConnectionSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: formatZodError(parsed.error) });
    }
    const { provider, environment, credentialsRef } = parsed.data;

    const conn: ChannelConnection = {
      id: generateId("conn"),
      provider,
      environment,
      credentialsRef,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    connections.push(conn);

    void appendSecurityAuditEvent({
      eventType: "distribution_connection_created",
      severity: "info",
      ip: request.ip,
      traceId: request.id,
      details: { connectionId: conn.id, provider, environment },
    });

    return reply.status(201).send(conn);
  });

  fastify.delete("/distribution/connections/:connectionId", async (request, reply) => {
    const { connectionId } = request.params as { connectionId: string };
    const idx = connections.findIndex((c) => c.id === connectionId);
    if (idx === -1) return reply.status(404).send({ error: "connection not found" });

    connections.splice(idx, 1);

    void appendSecurityAuditEvent({
      eventType: "distribution_connection_deleted",
      severity: "info",
      ip: request.ip,
      traceId: request.id,
      details: { connectionId },
    });

    return reply.status(204).send();
  });

  // ── Property Mappings ───────────────────────────────────────────────────

  fastify.get("/distribution/connections/:connectionId/mappings", async (request, reply) => {
    const { connectionId } = request.params as { connectionId: string };
    const conn = connections.find((c) => c.id === connectionId);
    if (!conn) return reply.status(404).send({ error: "connection not found" });

    const maps = propertyMappings.filter((m) => m.connectionId === connectionId);
    return { data: maps, totalCount: maps.length };
  });

  fastify.post("/distribution/connections/:connectionId/mappings", async (request, reply) => {
    const { connectionId } = request.params as { connectionId: string };
    const conn = connections.find((c) => c.id === connectionId);
    if (!conn) return reply.status(404).send({ error: "connection not found" });

    const parsed = createMappingSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: formatZodError(parsed.error) });
    }
    const data = parsed.data;

    // Validate completeness: at least one room type and one rate plan mapping required
    const isComplete = data.roomTypeMappings.length > 0 && data.ratePlanMappings.length > 0;

    const mapping: PropertyMapping = {
      id: generateId("map"),
      connectionId,
      propertyId: data.propertyId,
      externalPropertyId: data.externalPropertyId,
      externalGroupId: data.externalGroupId,
      roomTypeMappings: data.roomTypeMappings,
      ratePlanMappings: data.ratePlanMappings,
      status: isComplete ? "validated" : "created",
      createdAt: new Date().toISOString(),
      lastValidatedAt: isComplete ? new Date().toISOString() : undefined,
    };
    propertyMappings.push(mapping);

    return reply.status(201).send(mapping);
  });

  fastify.delete("/distribution/connections/:connectionId/mappings/:mappingId", async (request, reply) => {
    const { connectionId, mappingId } = request.params as { connectionId: string; mappingId: string };
    const idx = propertyMappings.findIndex((m) => m.connectionId === connectionId && m.id === mappingId);
    if (idx === -1) return reply.status(404).send({ error: "mapping not found" });
    propertyMappings.splice(idx, 1);
    return reply.status(204).send();
  });

  // ── Channex Mapping Iframe Token ─────────────────────────────────────────
  // Generates a one-time token for embedding the Channex channel mapping iframe.
  // In production this would call the Channex API to get a real token.

  fastify.post("/distribution/mapping/token", async (request, reply) => {
    const body = request.body as any;
    const propertyId = body?.propertyId ?? "default";

    // Produce a pseudorandom one-time token (demo only)
    const token = crypto.randomBytes(32).toString("hex");

    void appendSecurityAuditEvent({
      eventType: "distribution_mapping_token_issued",
      severity: "info",
      ip: request.ip,
      traceId: request.id,
      details: { propertyId },
    });

    return {
      token,
      propertyId,
      // The iframe URL would embed this token for the Channex channel mapping UI.
      // Real implementation: POST to Channex /api/v1/auth/one_time_token and return the URL.
      iframeUrl: `https://channex.io/mapping?token=${token}&property=${encodeURIComponent(propertyId)}`,
      expiresIn: 300,
    };
  });

  // ── ARI Push ────────────────────────────────────────────────────────────

  fastify.post("/distribution/ari/push", async (request, reply) => {
    const parsed = ariPushSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: formatZodError(parsed.error) });
    }
    const data = parsed.data;

    const conn = connections.find((c) => c.id === data.connectionId);
    if (!conn) return reply.status(404).send({ error: "connection not found" });
    if (conn.status !== "active") {
      return reply.status(409).send({ error: "connection is not active" });
    }

    // Validate mapping exists for property
    const mapping = propertyMappings.find(
      (m) => m.connectionId === data.connectionId && m.propertyId === data.propertyId,
    );
    if (!mapping) {
      return reply.status(409).send({ error: "no active mapping for this property; complete channel mapping first" });
    }
    if (mapping.status !== "active" && mapping.status !== "validated") {
      return reply.status(409).send({ error: `mapping is in '${mapping.status}' state; activate mapping before pushing ARI` });
    }

    const now = new Date().toISOString();
    const record: AriPushRecord = {
      id: generateId("ari"),
      propertyId: data.propertyId,
      connectionId: data.connectionId,
      type: data.type,
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
      status: "sent",
      sentAt: now,
      createdAt: now,
    };
    ariPushRecords.push(record);

    // Simulate acknowledgment (in production: provider responds asynchronously)
    record.status = "acked";
    record.ackedAt = new Date(Date.now() + 120).toISOString();

    void appendSecurityAuditEvent({
      eventType: "distribution_ari_push_sent",
      severity: "info",
      ip: request.ip,
      traceId: request.id,
      details: {
        ariId: record.id,
        propertyId: data.propertyId,
        type: data.type,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        valuesCount: data.values.length,
      },
    });

    return reply.status(202).send({
      ariId: record.id,
      status: record.status,
      sentAt: record.sentAt,
      ackedAt: record.ackedAt,
    });
  });

  fastify.post("/distribution/ari/recompute", async (request, reply) => {
    const body = request.body as any;
    const propertyId = body?.propertyId;
    if (!propertyId) return reply.status(400).send({ error: "propertyId is required" });

    // In production: recompute ARI from internal ledger and enqueue push jobs
    const jobId = generateId("job");
    return reply.status(202).send({ jobId, propertyId, status: "queued", message: "ARI recompute queued; delta push will follow" });
  });

  // ── ARI Push Records ─────────────────────────────────────────────────────

  fastify.get("/distribution/ari/records", async (request) => {
    const q = request.query as any;
    let records = [...ariPushRecords].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (q.propertyId) records = records.filter((r) => r.propertyId === q.propertyId);
    if (q.status) records = records.filter((r) => r.status === q.status);
    return { data: records.slice(0, 50), totalCount: records.length };
  });

  // ── Reservation Ingest ──────────────────────────────────────────────────

  fastify.post("/distribution/reservations/ingest", async (request, reply) => {
    const parsed = ingestReservationSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: formatZodError(parsed.error) });
    }
    const data = parsed.data;

    const conn = connections.find((c) => c.id === data.connectionId);
    if (!conn) return reply.status(404).send({ error: "connection not found" });

    // Idempotency: check if this revision already exists
    const existing = bookingRevisions.find(
      (r) => r.connectionId === data.connectionId && r.externalRevisionId === data.externalRevisionId,
    );
    if (existing) {
      // Return existing record without reapplying
      return { revisionId: existing.id, status: existing.status, idempotent: true };
    }

    const now = new Date().toISOString();
    const revision: BookingRevision = {
      id: generateId("rev"),
      connectionId: data.connectionId,
      channelCode: data.channelCode,
      externalReservationId: data.externalReservationId,
      externalRevisionId: data.externalRevisionId,
      revisionType: data.revisionType,
      propertyId: data.propertyId,
      roomTypeId: data.roomTypeId,
      guestName: data.guestName,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      amount: data.amount,
      currency: data.currency,
      paymentCollect: data.paymentCollect,
      status: "received",
      receivedAt: now,
    };
    bookingRevisions.push(revision);

    // Apply to ledger atomically (demo: mark as applied immediately)
    revision.status = "applied";
    revision.appliedAt = new Date(Date.now() + 50).toISOString();

    // Enqueue ARI delta to block inventory (fire-and-forget demo)
    if (revision.propertyId && (revision.revisionType === "new" || revision.revisionType === "modified")) {
      const ariRecord: AriPushRecord = {
        id: generateId("ari"),
        propertyId: revision.propertyId,
        connectionId: data.connectionId,
        type: "availability",
        dateFrom: revision.checkIn ?? now.slice(0, 10),
        dateTo: revision.checkOut ?? now.slice(0, 10),
        status: "queued",
        createdAt: revision.appliedAt!,
      };
      ariPushRecords.push(ariRecord);
    }

    void appendSecurityAuditEvent({
      eventType: "distribution_reservation_ingested",
      severity: "info",
      ip: request.ip,
      traceId: request.id,
      details: {
        revisionId: revision.id,
        channelCode: data.channelCode,
        externalReservationId: data.externalReservationId,
        revisionType: data.revisionType,
        propertyId: data.propertyId,
      },
    });

    return reply.status(201).send({
      revisionId: revision.id,
      status: revision.status,
      receivedAt: revision.receivedAt,
      appliedAt: revision.appliedAt,
      idempotent: false,
    });
  });

  fastify.post("/distribution/reservations/:revisionId/ack", async (request, reply) => {
    const { revisionId } = request.params as { revisionId: string };
    const revision = bookingRevisions.find((r) => r.id === revisionId);
    if (!revision) return reply.status(404).send({ error: "revision not found" });

    if (revision.status !== "applied") {
      return reply.status(409).send({
        error: `cannot ack revision in '${revision.status}' state; revision must be in 'applied' state`,
      });
    }

    revision.status = "acked";
    revision.ackedAt = new Date().toISOString();

    return { revisionId: revision.id, status: revision.status, ackedAt: revision.ackedAt };
  });

  fastify.get("/distribution/reservations", async (request) => {
    const q = request.query as any;
    let revisions = [...bookingRevisions].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
    if (q.propertyId) revisions = revisions.filter((r) => r.propertyId === q.propertyId);
    if (q.channelCode) revisions = revisions.filter((r) => r.channelCode === q.channelCode);
    if (q.status) revisions = revisions.filter((r) => r.status === q.status);
    return { data: revisions.slice(0, 50), totalCount: revisions.length };
  });

  // ── Sync Status ─────────────────────────────────────────────────────────

  fastify.get("/distribution/properties/:propertyId/sync-status", async (request, reply) => {
    const { propertyId } = request.params as { propertyId: string };
    return buildSyncStatus(propertyId);
  });

  // ── Reconciliation ───────────────────────────────────────────────────────

  fastify.post("/distribution/reconcile", async (request, reply) => {
    const body = request.body as any;
    const propertyId = body?.propertyId;

    const jobId = generateId("recon");
    const propertiesScoped = propertyId ? [propertyId] : propertyMappings.map((m) => m.propertyId);

    void appendSecurityAuditEvent({
      eventType: "distribution_reconciliation_triggered",
      severity: "info",
      ip: request.ip,
      traceId: request.id,
      details: { jobId, propertiesCount: propertiesScoped.length, propertyId: propertyId ?? "all" },
    });

    return reply.status(202).send({
      jobId,
      status: "queued",
      propertiesCount: propertiesScoped.length,
      message: "Reconciliation job queued; drift detection will compare internal ledger vs channel state",
    });
  });

  // ── Channex Inbound Webhook ─────────────────────────────────────────────
  // Handles ARI change notifications and booking notifications pushed by Channex.

  fastify.post("/distribution/webhook/channex", async (request, reply) => {
    const rawBody = JSON.stringify(request.body ?? {});
    const channexWebhookSecret = env.CHANNEX_WEBHOOK_SECRET?.trim() ?? "";

    if (channexWebhookSecret) {
      const sigHeader = (request.headers["x-channex-signature"] ?? "") as string;
      const sig = sigHeader.replace(/^sha256=/i, "").trim();
      const expected = computeWebhookHmac(channexWebhookSecret, rawBody);
      if (!sig || !secureCompareHex(sig, expected)) {
        request.log.warn({ ip: request.ip }, "channex webhook signature verification failed");
        void appendSecurityAuditEvent({
          eventType: "distribution_webhook_rejected_invalid_signature",
          severity: "critical",
          ip: request.ip,
          traceId: request.id,
          details: { provider: "channex" },
        });
        return reply.status(401).send({ error: "invalid webhook signature" });
      }
    }

    const body = request.body as any;
    const eventType: string = body?.event ?? body?.type ?? "unknown";

    void appendSecurityAuditEvent({
      eventType: "distribution_webhook_received",
      severity: "info",
      ip: request.ip,
      traceId: request.id,
      details: { provider: "channex", event: eventType },
    });

    // Route to appropriate handler based on event type
    if (eventType === "booking" || eventType === "booking_revision") {
      const payload = body?.payload ?? body;
      const connectionId = connections.find((c) => c.provider === "channex")?.id ?? "conn_demo_channex";

      const parsed = ingestReservationSchema.safeParse({
        connectionId,
        channelCode: payload?.channel_code ?? "UNK",
        externalReservationId: payload?.booking_id ?? payload?.reservation_id ?? `wh_${Date.now()}`,
        externalRevisionId: payload?.unique_id ?? payload?.revision_id ?? `wh_rev_${Date.now()}`,
        revisionType: payload?.status === "cancelled" ? "cancelled" : payload?.unique_id ? "modified" : "new",
        propertyId: payload?.property_id,
        roomTypeId: payload?.room_type_id,
        guestName: payload?.guest?.name,
        checkIn: payload?.arrival_date,
        checkOut: payload?.departure_date,
        amount: payload?.amount ? Math.round(parseFloat(payload.amount) * 100) : undefined,
        currency: payload?.currency,
        paymentCollect: payload?.payment_collect,
      });

      if (parsed.success) {
        const existing = bookingRevisions.find(
          (r) => r.externalRevisionId === parsed.data.externalRevisionId,
        );
        if (!existing) {
          const now = new Date().toISOString();
          const revision: BookingRevision = {
            id: generateId("rev"),
            ...parsed.data,
            status: "applied",
            receivedAt: now,
            appliedAt: new Date(Date.now() + 50).toISOString(),
          };
          bookingRevisions.push(revision);
        }
      }
    }

    return { received: true, event: eventType };
  });
}
