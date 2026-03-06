import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import Stripe from "stripe";
import { env } from "../lib/env";
import { formatZodError } from "../lib/validation";

const prisma = new PrismaClient();

// Lazy Stripe client — only initialised when STRIPE_SECRET_KEY is configured
let _stripe: Stripe | null = null;
function getStripe(): Stripe | null {
  if (!env.STRIPE_SECRET_KEY) return null;
  if (!_stripe) {
    _stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      // biome-ignore lint/suspicious/noExplicitAny: version string tied to installed stripe package
      apiVersion: "2026-02-25.clover" as any,
    });
  }
  return _stripe;
}

const checkoutSchema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().min(3).max(10).default("usd"),
  paymentMethodId: z.string().min(1).optional(),
});

const createPaymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().min(3).max(10),
});

const subscribeSchema = z.object({
  planId: z.string().min(1),
});

const cancelSubSchema = z.object({
  subscriptionId: z.string().min(1),
});

const defaultBillingPlans = [
  { id: "host_club", name: "Host Club", pricePerProperty: 18, interval: "month", description: "Up to 10 properties" },
  { id: "host_club_ai", name: "Host Club + AI", pricePerProperty: 46, interval: "month", description: "AI pricing and screening for growth operators" },
  { id: "portfolio_pro", name: "Portfolio Pro", priceFlat: 399, interval: "month", description: "Includes 15 properties, +$25 each additional" },
  { id: "enterprise", name: "Enterprise", priceFlat: 888, interval: "month", description: "Best fit for 25+ properties and multi-entity operations" },
  { id: "corporate_sme", name: "Corporate SME", commissionRate: 0.08, description: "8% commission per booking" },
];

export default async function paymentsRoutes(fastify: FastifyInstance) {
  // -------------------------------------------------------------------------
  // POST /payments/checkout — create Stripe PaymentIntent + persist Payment
  // -------------------------------------------------------------------------
  fastify.post("/payments/checkout", async (request, reply) => {
    const req = request as any;
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(req, reply, ["guest", "host", "admin"]);
      if (reply.sent) return;
      if (res) return res;
    }

    const parsed = checkoutSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid checkout payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const { bookingId, amount, currency } = parsed.data;
    const stripe = getStripe();

    if (stripe) {
      try {
        const intent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // convert to cents
          currency: currency.toLowerCase(),
          metadata: { bookingId },
          automatic_payment_methods: { enabled: true },
        });

        let dbPaymentId: number | null = null;
        try {
          const numericBookingId = /^\d+$/.test(bookingId) ? parseInt(bookingId, 10) : null;
          const payment = await prisma.payment.create({
            data: {
              booking_id: numericBookingId,
              amount,
              currency: currency.toLowerCase(),
              status: "pending",
              stripe_payment_intent_id: intent.id,
            },
          });
          dbPaymentId = payment.id;
        } catch (dbErr) {
          fastify.log.warn({ err: dbErr }, "Failed to persist Payment record");
        }

        return reply.status(201).send({
          success: true,
          clientSecret: intent.client_secret,
          paymentIntentId: intent.id,
          paymentId: dbPaymentId,
          booking: { id: bookingId, status: "payment_pending" },
        });
      } catch (stripeErr: any) {
        fastify.log.error({ err: stripeErr.message }, "Stripe PaymentIntent creation failed");
        return reply.status(502).send({
          type: "urn:problem:payment-gateway",
          title: "Payment gateway error",
          status: 502,
          detail: stripeErr.message,
          instance: request.url,
          traceId: request.id,
        });
      }
    }

    // Demo fallback — no Stripe key configured
    return reply.status(201).send({
      success: true,
      clientSecret: `pi_demo_secret_${Math.random().toString(36).slice(2, 10)}`,
      paymentIntentId: `pi_demo_${Math.random().toString(36).slice(2, 10)}`,
      paymentId: null,
      booking: { id: bookingId, status: "confirmed" },
      payment: { id: "pay_demo", amount, currency, status: "succeeded" },
    });
  });

  // -------------------------------------------------------------------------
  // POST /payments/create — backward-compatible standalone PaymentIntent
  // -------------------------------------------------------------------------
  fastify.post("/payments/create", async (request, reply) => {
    const req = request as any;
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(req, reply, ["guest", "host", "admin"]);
      if (reply.sent) return;
      if (res) return res;
    }

    const parsed = createPaymentIntentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid payment intent payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const { amount, currency } = parsed.data;
    const stripe = getStripe();

    if (stripe) {
      try {
        const intent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: currency.toLowerCase(),
          automatic_payment_methods: { enabled: true },
        });
        return {
          paymentIntentId: intent.id,
          clientSecret: intent.client_secret,
          amount,
          currency,
        };
      } catch (stripeErr: any) {
        fastify.log.error({ err: stripeErr.message }, "Stripe PaymentIntent creation failed");
        return reply.status(502).send({
          type: "urn:problem:payment-gateway",
          title: "Payment gateway error",
          status: 502,
          detail: stripeErr.message,
          instance: request.url,
          traceId: request.id,
        });
      }
    }

    // Demo fallback
    return {
      paymentIntentId: `pi_${Math.random().toString(36).slice(2, 10)}`,
      clientSecret: `pi_demo_secret_${Math.random().toString(36).slice(2, 10)}`,
      amount,
      currency,
    };
  });

  // -------------------------------------------------------------------------
  // POST /payments/webhook — Stripe webhook; needs raw body for sig verification
  // Registered in a sub-scope that overrides the JSON content-type parser so
  // the body arrives as a raw Buffer instead of a parsed object.
  // -------------------------------------------------------------------------
  fastify.register(async function webhookScope(scope) {
    scope.addContentTypeParser(
      "application/json",
      { parseAs: "buffer" },
      (_req: any, body: Buffer, done: (err: Error | null, body?: unknown) => void) => {
        done(null, body);
      },
    );

    scope.post("/payments/webhook", async (request: any, reply: any) => {
      const stripe = getStripe();
      if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
        return reply.status(400).send({
          type: "urn:problem:config",
          title: "Payment gateway not configured",
          status: 400,
          detail: "STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET must be set to process webhooks",
          instance: request.url,
        });
      }

      const sig = request.headers["stripe-signature"] as string | undefined;
      if (!sig) {
        return reply.status(400).send({
          type: "urn:problem:validation",
          title: "Missing stripe-signature header",
          status: 400,
          instance: request.url,
        });
      }

      const rawBody = request.body as Buffer;
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
      } catch (err: any) {
        scope.log.warn({ err: err.message }, "Stripe webhook signature verification failed");
        return reply.status(400).send({
          type: "urn:problem:webhook-signature",
          title: "Webhook signature verification failed",
          status: 400,
          detail: err.message,
          instance: request.url,
        });
      }

      switch (event.type) {
        case "payment_intent.succeeded": {
          const pi = event.data.object as Stripe.PaymentIntent;
          try {
            await prisma.payment.updateMany({
              where: { stripe_payment_intent_id: pi.id },
              data: { status: "succeeded" },
            });
            if (pi.metadata?.bookingId) {
              const numericId = parseInt(pi.metadata.bookingId, 10);
              if (!isNaN(numericId)) {
                await prisma.booking
                  .update({ where: { id: numericId }, data: { status: "confirmed" } })
                  .catch(() => {
                    /* booking may not exist in demo mode */
                  });
              }
            }
          } catch (dbErr) {
            scope.log.error({ err: dbErr, piId: pi.id }, "DB update failed after payment_intent.succeeded");
          }
          break;
        }

        case "payment_intent.payment_failed": {
          const pi = event.data.object as Stripe.PaymentIntent;
          try {
            await prisma.payment.updateMany({
              where: { stripe_payment_intent_id: pi.id },
              data: { status: "failed" },
            });
          } catch (dbErr) {
            scope.log.error({ err: dbErr, piId: pi.id }, "DB update failed after payment_intent.payment_failed");
          }
          break;
        }

        default:
          scope.log.info({ type: event.type }, "Unhandled Stripe webhook event type");
      }

      return reply.send({ received: true });
    });
  });

  // -------------------------------------------------------------------------
  // GET /payments/methods — saved payment methods (stub; extend with Stripe
  // Customer API once users have a stripe_customer_id)
  // -------------------------------------------------------------------------
  fastify.get("/payments/methods", async (request, reply) => {
    const req = request as any;
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(req, reply, ["guest", "host", "admin"]);
      if (reply.sent) return;
      if (res) return res;
    }
    return [
      { id: "card_1", type: "card", last4: "4242", brand: "visa", expiryMonth: 12, expiryYear: 2030, isDefault: true },
    ];
  });

  // -------------------------------------------------------------------------
  // GET /payouts
  // -------------------------------------------------------------------------
  fastify.get("/payouts", async (request, reply) => {
    const req = request as any;
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(req, reply, ["host", "admin"]);
      if (reply.sent) return;
      if (res) return res;
    }
    try {
      const payouts = await prisma.payout.findMany({ orderBy: { date: "desc" } });
      return payouts;
    } catch (err) {
      return [
        {
          id: "payout-1",
          date: "2026-02-01",
          amount: 2847.5,
          status: "completed",
          method: "bank_transfer",
          bookings: [
            {
              id: "b1",
              propertyName: "Modern Downtown Loft",
              guestName: "Alex J.",
              checkIn: "2026-01-20",
              checkOut: "2026-01-24",
              grossAmount: 856,
              platformFee: 85.6,
              netAmount: 770.4,
            },
          ],
        },
      ];
    }
  });

  // -------------------------------------------------------------------------
  // GET /billing/plans
  // -------------------------------------------------------------------------
  fastify.get("/billing/plans", async () => {
    try {
      const dbPlans = await prisma.billingPlan.findMany({ orderBy: { id: "asc" } });
      const normalizedDbPlans = dbPlans.map((p) => ({
        id: p.code,
        name: p.name,
        pricePerProperty: p.price_per_property || undefined,
        priceFlat: p.price_flat || undefined,
        commissionRate: p.commission_rate || undefined,
        interval: p.interval || undefined,
        description: p.description || undefined,
      }));
      const byCode = new Map<string, any>();
      for (const plan of defaultBillingPlans) byCode.set(plan.id, plan);
      for (const plan of normalizedDbPlans) byCode.set(plan.id, plan);
      return Array.from(byCode.values());
    } catch (err) {
      return defaultBillingPlans;
    }
  });

  // -------------------------------------------------------------------------
  // POST /billing/subscribe
  // -------------------------------------------------------------------------
  fastify.post("/billing/subscribe", async (request, reply) => {
    const req = request as any;
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(req, reply, ["host", "enterprise", "admin"]);
      if (reply.sent) return;
      if (res) return res;
    }
    const parsed = subscribeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid subscription payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }
    const body = parsed.data;
    try {
      const plan = await prisma.billingPlan.findFirst({ where: { code: body.planId } });
      if (!plan) {
        const isKnownDefaultPlan = defaultBillingPlans.some((p) => p.id === body.planId);
        if (!isKnownDefaultPlan) return reply.status(404).send({ error: "plan not found" });
        return {
          subscriptionId: `sub_${Math.random().toString(36).slice(2, 10)}`,
          planId: body.planId,
          status: "active",
          startedAt: new Date().toISOString(),
        };
      }
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
    } catch (err) {
      return {
        subscriptionId: `sub_${Math.random().toString(36).slice(2, 10)}`,
        planId: body.planId,
        status: "active",
        startedAt: new Date().toISOString(),
      };
    }
  });

  // -------------------------------------------------------------------------
  // POST /billing/cancel
  // -------------------------------------------------------------------------
  fastify.post("/billing/cancel", async (request, reply) => {
    const req = request as any;
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(req, reply, ["host", "enterprise", "admin"]);
      if (reply.sent) return;
      if (res) return res;
    }
    const parsed = cancelSubSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid cancel payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }
    const body = parsed.data;
    try {
      const subId = body.subscriptionId ? Number(String(body.subscriptionId).replace("sub_", "")) : null;
      if (!subId) return reply.status(400).send({ error: "subscriptionId required" });
      const updated = await prisma.subscription.update({
        where: { id: subId },
        data: { status: "canceled", canceled_at: new Date() },
      });
      return {
        subscriptionId: `sub_${updated.id}`,
        status: updated.status,
        canceledAt: updated.canceled_at,
      };
    } catch (err) {
      return {
        subscriptionId: "sub_demo",
        status: "canceled",
        canceledAt: new Date().toISOString(),
      };
    }
  });

  // -------------------------------------------------------------------------
  // GET /billing/subscriptions
  // -------------------------------------------------------------------------
  fastify.get("/billing/subscriptions", async (request, reply) => {
    const req = request as any;
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(req, reply, ["host", "enterprise", "admin"]);
      if (reply.sent) return;
      if (res) return res;
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
    } catch (err) {
      return [];
    }
  });
}
