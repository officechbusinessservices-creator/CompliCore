"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = paymentsRoutes;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const validation_1 = require("../lib/validation");
const prisma = new client_1.PrismaClient();
const checkoutSchema = zod_1.z.object({
    bookingId: zod_1.z.string().min(1),
    amount: zod_1.z.number().positive().optional(),
    currency: zod_1.z.string().min(3).max(10).optional(),
    paymentMethodId: zod_1.z.string().min(1).optional(),
});
const createPaymentIntentSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.string().min(3).max(10),
});
const subscribeSchema = zod_1.z.object({
    planId: zod_1.z.string().min(1),
});
const cancelSubSchema = zod_1.z.object({
    subscriptionId: zod_1.z.string().min(1),
});
async function paymentsRoutes(fastify) {
    fastify.get("/payouts", async (request, reply) => {
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["host", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        try {
            const payouts = await prisma.payout.findMany({ orderBy: { date: "desc" } });
            return payouts;
        }
        catch (err) {
            return [
                {
                    id: "payout-1",
                    date: "2026-02-01",
                    amount: 2847.5,
                    status: "completed",
                    method: "bank_transfer",
                    bookings: [
                        { id: "b1", propertyName: "Modern Downtown Loft", guestName: "Alex J.", checkIn: "2026-01-20", checkOut: "2026-01-24", grossAmount: 856, platformFee: 85.6, netAmount: 770.4 },
                    ],
                },
            ];
        }
    });
    fastify.get("/payments/methods", async (request, reply) => {
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["guest", "host", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        return [
            { id: "card_1", type: "card", last4: "4242", brand: "visa", expiryMonth: 12, expiryYear: 2030, isDefault: true },
        ];
    });
    fastify.post("/payments/checkout", async (request, reply) => {
        // Idempotency-Key supported via global plugin
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["guest", "host", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        const parsed = checkoutSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                type: "urn:problem:validation",
                title: "Request validation failed",
                status: 400,
                detail: "Invalid checkout payload",
                errors: (0, validation_1.formatZodError)(parsed.error),
                instance: request.url,
                traceId: request.id,
            });
        }
        const body = parsed.data;
        return {
            success: true,
            booking: { id: body.bookingId, status: "confirmed" },
            payment: { id: "pay_demo", amount: 250, currency: "USD", status: "succeeded" },
        };
    });
    // backward-compatible demo endpoint
    fastify.post("/payments/create", async (request, reply) => {
        // Idempotency-Key supported via global plugin
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["guest", "host", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        const parsed = createPaymentIntentSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                type: "urn:problem:validation",
                title: "Request validation failed",
                status: 400,
                detail: "Invalid payment intent payload",
                errors: (0, validation_1.formatZodError)(parsed.error),
                instance: request.url,
                traceId: request.id,
            });
        }
        const body = parsed.data;
        return { paymentIntentId: `pi_${Math.random().toString(36).slice(2, 10)}`, amount: body.amount || 0, currency: body.currency || "usd" };
    });
    fastify.get("/billing/plans", async () => {
        try {
            const plans = await prisma.billingPlan.findMany({ orderBy: { id: "asc" } });
            return plans.map((p) => ({
                id: p.code,
                name: p.name,
                pricePerProperty: p.price_per_property || undefined,
                priceFlat: p.price_flat || undefined,
                commissionRate: p.commission_rate || undefined,
                interval: p.interval || undefined,
                description: p.description || undefined,
            }));
        }
        catch (err) {
            return [
                { id: "host_club", name: "Host Club", pricePerProperty: 18, interval: "month", description: "Up to 10 properties" },
                { id: "enterprise", name: "Enterprise", priceFlat: 888, interval: "month", description: "10+ properties" },
                { id: "corporate_sme", name: "Corporate SME", commissionRate: 0.08, description: "8% commission per booking" },
                { id: "ai_powerup", name: "AI Power-Up", priceFlat: 28, interval: "month" },
            ];
        }
    });
    fastify.post("/billing/subscribe", async (request, reply) => {
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["host", "enterprise", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        const parsed = subscribeSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                type: "urn:problem:validation",
                title: "Request validation failed",
                status: 400,
                detail: "Invalid subscription payload",
                errors: (0, validation_1.formatZodError)(parsed.error),
                instance: request.url,
                traceId: request.id,
            });
        }
        const body = parsed.data;
        try {
            const plan = await prisma.billingPlan.findFirst({ where: { code: body.planId } });
            if (!plan)
                return reply.status(404).send({ error: "plan not found" });
            const subscription = await prisma.subscription.create({
                data: {
                    plan_id: plan.id,
                    status: "active",
                },
            });
            return {
                subscriptionId: `sub_${subscription.id}`,
                planId: body.planId,
                status: subscription.status,
                startedAt: subscription.started_at,
            };
        }
        catch (err) {
            return {
                subscriptionId: `sub_${Math.random().toString(36).slice(2, 10)}`,
                planId: body.planId,
                status: "active",
                startedAt: new Date().toISOString(),
            };
        }
    });
    fastify.post("/billing/cancel", async (request, reply) => {
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["host", "enterprise", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        const parsed = cancelSubSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                type: "urn:problem:validation",
                title: "Request validation failed",
                status: 400,
                detail: "Invalid cancel payload",
                errors: (0, validation_1.formatZodError)(parsed.error),
                instance: request.url,
                traceId: request.id,
            });
        }
        const body = parsed.data;
        try {
            const subId = body.subscriptionId ? Number(String(body.subscriptionId).replace("sub_", "")) : null;
            if (!subId)
                return reply.status(400).send({ error: "subscriptionId required" });
            const updated = await prisma.subscription.update({
                where: { id: subId },
                data: { status: "canceled", canceled_at: new Date() },
            });
            return {
                subscriptionId: `sub_${updated.id}`,
                status: updated.status,
                canceledAt: updated.canceled_at,
            };
        }
        catch (err) {
            return {
                subscriptionId: "sub_demo",
                status: "canceled",
                canceledAt: new Date().toISOString(),
            };
        }
    });
    fastify.get("/billing/subscriptions", async (request, reply) => {
        const req = request;
        const guard = fastify.requireRole;
        if (guard) {
            const res = await guard(req, reply, ["host", "enterprise", "admin"]);
            if (reply.sent)
                return;
            if (res)
                return res;
        }
        try {
            const subs = await prisma.subscription.findMany({ include: { plan: true }, orderBy: { started_at: "desc" } });
            return subs.map((s) => ({
                id: `sub_${s.id}`,
                status: s.status,
                startedAt: s.started_at,
                canceledAt: s.canceled_at,
                plan: {
                    id: s.plan.code,
                    name: s.plan.name,
                    interval: s.plan.interval,
                },
            }));
        }
        catch (err) {
            return [];
        }
    });
}
