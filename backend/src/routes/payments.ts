import { FastifyInstance } from "fastify";

export default async function paymentsRoutes(fastify: FastifyInstance) {
  fastify.get("/payments/methods", async () => {
    return [
      { id: "card_1", type: "card", last4: "4242", brand: "visa", expiryMonth: 12, expiryYear: 2030, isDefault: true },
    ];
  });

  fastify.post("/payments/checkout", async (request) => {
    const body = request.body as any;
    return {
      success: true,
      booking: { id: body.bookingId, status: "confirmed" },
      payment: { id: "pay_demo", amount: 250, currency: "USD", status: "succeeded" },
    };
  });

  // backward-compatible demo endpoint
  fastify.post("/payments/create", async (request) => {
    const body = request.body as any;
    return { paymentIntentId: `pi_${Math.random().toString(36).slice(2, 10)}`, amount: body.amount || 0, currency: body.currency || "usd" };
  });
}
