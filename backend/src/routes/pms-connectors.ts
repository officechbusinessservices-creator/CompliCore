import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { env } from "../lib/env";
import { appendSecurityAuditEvent } from "../lib/security-audit";
import { prisma } from "../lib/prisma";

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

type NormalizedListingInput = {
  externalId?: string;
  title: string;
  address?: string;
  pricePerNight?: number;
  status: "active" | "draft" | "paused";
};

type NormalizedBookingInput = {
  externalId?: string;
  externalListingId?: string;
  confirmationCode: string;
  guestName: string;
  property?: string;
  checkIn?: string;
  checkOut?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

type NormalizedWebhookPayload = {
  event: string;
  listings: NormalizedListingInput[];
  bookings: NormalizedBookingInput[];
};

type SyncSummary = {
  listings: { created: number; updated: number };
  bookings: { created: number; updated: number };
  ignored: number;
};

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

function pickFirstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function toInt(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.round(parsed);
  }
  return undefined;
}

function toDateOnly(value: unknown) {
  if (!value) return undefined;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim();
  }
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

function normalizeGuestName(raw: any) {
  return pickFirstString(
    raw?.guestName,
    raw?.guest_name,
    raw?.guest?.fullName,
    raw?.guest?.name,
    `${raw?.guest?.firstName || ""} ${raw?.guest?.lastName || ""}`.trim(),
    raw?.primaryGuest?.name,
    raw?.customer?.name,
  );
}

function normalizeListingStatus(value: unknown): "active" | "draft" | "paused" {
  const status = String(value || "").toLowerCase();
  if (status.includes("active") || status.includes("publish") || status.includes("live")) return "active";
  if (status.includes("pause") || status.includes("inactive") || status.includes("archive")) return "paused";
  return "draft";
}

function normalizeBookingStatus(value: unknown): "pending" | "confirmed" | "cancelled" | "completed" {
  const status = String(value || "").toLowerCase();
  if (status.includes("cancel")) return "cancelled";
  if (status.includes("complete") || status.includes("checkout") || status.includes("checked_out")) return "completed";
  if (status.includes("confirm") || status.includes("book") || status.includes("paid")) return "confirmed";
  return "pending";
}

function buildConfirmationCode(providerId: string, externalId?: string, fallbackSeed?: string) {
  const seed = externalId || crypto.createHash("sha1").update(fallbackSeed || String(Date.now())).digest("hex").slice(0, 16);
  const raw = `${providerId}-${seed}`
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const trimmed = raw.slice(0, 64);
  return trimmed.length >= 3 ? trimmed : `BK-${Date.now()}`.slice(0, 64);
}

function normalizeListingInput(raw: any): NormalizedListingInput | null {
  const title = pickFirstString(raw?.title, raw?.name, raw?.listingName, raw?.propertyName, raw?.nickname);
  if (!title) return null;

  const address = pickFirstString(
    raw?.address?.full,
    raw?.address?.display,
    raw?.address,
    [raw?.address1, raw?.city, raw?.state].filter(Boolean).join(", "),
  );

  const pricePerNight = toInt(
    raw?.nightlyRate ??
    raw?.nightly_rate ??
    raw?.baseRate ??
    raw?.pricePerNight ??
    raw?.price_per_night ??
    raw?.rate,
  );

  return {
    externalId: pickFirstString(raw?.id, raw?._id, raw?.listingId, raw?.listing_id, raw?.propertyId, raw?.property_id),
    title,
    address,
    pricePerNight,
    status: normalizeListingStatus(raw?.status ?? raw?.state),
  };
}

function normalizeBookingInput(providerId: string, raw: any, event: string): NormalizedBookingInput | null {
  const externalId = pickFirstString(raw?.id, raw?._id, raw?.reservationId, raw?.reservation_id, raw?.bookingId, raw?.booking_id);
  const extractedGuestName = normalizeGuestName(raw);
  const guestName = extractedGuestName || "Guest";
  const property = pickFirstString(
    raw?.propertyName,
    raw?.property_name,
    raw?.listingName,
    raw?.listing?.title,
    raw?.unitName,
    raw?.property,
  );
  const checkIn = toDateOnly(raw?.checkIn ?? raw?.check_in ?? raw?.arrivalDate ?? raw?.arrival_date ?? raw?.startDate ?? raw?.start_date);
  const checkOut = toDateOnly(raw?.checkOut ?? raw?.check_out ?? raw?.departureDate ?? raw?.departure_date ?? raw?.endDate ?? raw?.end_date);

  if (!externalId && !property && !checkIn && !checkOut && !extractedGuestName) return null;

  return {
    externalId,
    externalListingId: pickFirstString(
      raw?.listingId,
      raw?.listing_id,
      raw?.propertyId,
      raw?.property_id,
      raw?.unitId,
      raw?.unit_id,
    ),
    confirmationCode: buildConfirmationCode(providerId, externalId, `${guestName}:${property}:${checkIn}:${checkOut}`),
    guestName,
    property,
    checkIn,
    checkOut,
    status: normalizeBookingStatus(raw?.status ?? raw?.reservationStatus ?? raw?.bookingStatus ?? event),
  };
}

function normalizeGuestyPayload(body: any): NormalizedWebhookPayload {
  const event = pickFirstString(body?.event, body?.eventType, body?.type) || "unknown";
  const data = body?.data ?? body?.payload ?? body ?? {};

  const listingRaw = data?.listing ?? data?.property ?? body?.listing;
  const listingsRaw = Array.isArray(data?.listings) ? data.listings : listingRaw ? [listingRaw] : [];

  const reservationRaw =
    data?.reservation ??
    data?.booking ??
    body?.reservation ??
    body?.booking ??
    (body?.reservationId ? { reservationId: body.reservationId, ...data } : null);
  const bookingsRaw = Array.isArray(data?.reservations) ? data.reservations : reservationRaw ? [reservationRaw] : [];

  return {
    event,
    listings: listingsRaw.map(normalizeListingInput).filter(Boolean) as NormalizedListingInput[],
    bookings: bookingsRaw.map((item: any) => normalizeBookingInput("guesty", item, event)).filter(Boolean) as NormalizedBookingInput[],
  };
}

function normalizeHostawayPayload(body: any): NormalizedWebhookPayload {
  const event = pickFirstString(body?.event, body?.eventType, body?.type) || "unknown";
  const data = body?.payload ?? body?.data ?? body ?? {};

  const listingRaw = data?.listing ?? data?.property ?? body?.listing;
  const listingsRaw = Array.isArray(data?.listings) ? data.listings : listingRaw ? [listingRaw] : [];

  const reservationRaw =
    data?.reservation ??
    data?.booking ??
    data?.result ??
    body?.reservation ??
    body?.booking ??
    (body?.reservationId ? { reservationId: body.reservationId, ...data } : null);
  const bookingsRaw = Array.isArray(data?.reservations) ? data.reservations : reservationRaw ? [reservationRaw] : [];

  return {
    event,
    listings: listingsRaw.map(normalizeListingInput).filter(Boolean) as NormalizedListingInput[],
    bookings: bookingsRaw.map((item: any) => normalizeBookingInput("hostaway", item, event)).filter(Boolean) as NormalizedBookingInput[],
  };
}

async function syncNormalizedPayload(payload: NormalizedWebhookPayload, log: any): Promise<SyncSummary> {
  const summary: SyncSummary = {
    listings: { created: 0, updated: 0 },
    bookings: { created: 0, updated: 0 },
    ignored: 0,
  };

  const listingIdByExternalId = new Map<string, number>();

  for (const listing of payload.listings) {
    try {
      const existing = await prisma.listing.findFirst({
        where: listing.address
          ? { title: listing.title, address: listing.address }
          : { title: listing.title },
        select: { id: true },
      });

      let localListingId: number;
      if (existing) {
        await prisma.listing.update({
          where: { id: existing.id },
          data: {
            address: listing.address,
            price_per_night: listing.pricePerNight,
            status: listing.status,
          },
        });
        summary.listings.updated += 1;
        localListingId = existing.id;
      } else {
        const created = await prisma.listing.create({
          data: {
            title: listing.title,
            address: listing.address,
            price_per_night: listing.pricePerNight,
            status: listing.status,
          },
          select: { id: true },
        });
        summary.listings.created += 1;
        localListingId = created.id;
      }

      if (listing.externalId) {
        listingIdByExternalId.set(listing.externalId, localListingId);
      }
    } catch (err) {
      summary.ignored += 1;
      log.warn({ err, listing }, "pms listing sync skipped");
    }
  }

  for (const booking of payload.bookings) {
    try {
      let listingId: number | undefined;
      if (booking.externalListingId && listingIdByExternalId.has(booking.externalListingId)) {
        listingId = listingIdByExternalId.get(booking.externalListingId);
      } else if (booking.property) {
        const listing = await prisma.listing.findFirst({
          where: { title: booking.property },
          select: { id: true },
        });
        listingId = listing?.id;
      }

      const existing = await prisma.booking.findUnique({
        where: { confirmation_code: booking.confirmationCode },
        select: { id: true },
      });

      const baseData = {
        guest_name: booking.guestName,
        property: booking.property,
        check_in: booking.checkIn,
        check_out: booking.checkOut,
        status: booking.status,
      };

      if (existing) {
        await prisma.booking.update({
          where: { id: existing.id },
          data: {
            ...baseData,
            ...(typeof listingId === "number" ? { listing_id: listingId } : {}),
          },
        });
        summary.bookings.updated += 1;
      } else {
        await prisma.booking.create({
          data: {
            confirmation_code: booking.confirmationCode,
            ...baseData,
            ...(typeof listingId === "number" ? { listing_id: listingId } : {}),
          },
        });
        summary.bookings.created += 1;
      }
    } catch (err) {
      summary.ignored += 1;
      log.warn({ err, booking }, "pms booking sync skipped");
    }
  }

  return summary;
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

    let normalized: NormalizedWebhookPayload = {
      event: body?.event || "unknown",
      listings: [],
      bookings: [],
    };

    if (providerId === "guesty") {
      normalized = normalizeGuestyPayload(body);
    } else if (providerId === "hostaway") {
      normalized = normalizeHostawayPayload(body);
    }

    let sync: SyncSummary = {
      listings: { created: 0, updated: 0 },
      bookings: { created: 0, updated: 0 },
      ignored: 0,
    };

    if (providerId === "guesty" || providerId === "hostaway") {
      sync = await syncNormalizedPayload(normalized, request.log);
      void appendSecurityAuditEvent({
        eventType: "pms_webhook_synced",
        severity: "info",
        ip: request.ip,
        traceId: request.id,
        details: {
          providerId,
          event: normalized.event,
          sync,
        },
      });
    }

    return {
      status: "received",
      providerId,
      event: normalized.event,
      sync,
    };
  });

  fastify.post("/pms/connectors/:providerId/sync", async (request) => {
    const { providerId } = request.params as any;
    return { status: "queued", providerId, jobId: `job_${Date.now()}` };
  });
}
