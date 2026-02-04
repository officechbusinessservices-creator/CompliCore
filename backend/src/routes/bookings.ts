import { FastifyInstance } from "fastify";
import { query } from "../db";

export default async function bookingsRoutes(fastify: FastifyInstance) {
  fastify.get("/bookings", async (request, reply) => {
    const q = request.query as any;
    try {
      if (q.confirmationCode) {
        const res = await query(
          "SELECT id, confirmation_code, guest_name, property, check_in, check_out, access_code, wifi_name, wifi_password, status FROM bookings WHERE confirmation_code = $1 LIMIT 1",
          [q.confirmationCode]
        );
        if (res.rows.length === 0) return reply.status(404).send({ error: "not found" });
        return res.rows[0];
      }

      const res = await query(
        "SELECT id, confirmation_code, guest_name, property, check_in, check_out, status FROM bookings ORDER BY id DESC LIMIT 50"
      );
      return res.rows;
    } catch (err) {
      // If DB is not available, fall back to demo data so kiosk still works in dev
      const demo = [
        {
          id: 1,
          confirmation_code: "HX4K9M2",
          guest_name: "Alex Johnson",
          property: "Modern Downtown Loft",
          check_in: "3:00 PM",
          check_out: "11:00 AM",
          access_code: "4829",
          wifi_name: "LoftGuest",
          wifi_password: "Welcome2024",
          status: "confirmed",
        },
        {
          id: 2,
          confirmation_code: "1234",
          guest_name: "Test Guest",
          property: "Cozy Studio",
          check_in: "4:00 PM",
          check_out: "10:00 AM",
          access_code: "0000",
          wifi_name: "StudioGuest",
          wifi_password: "password",
          status: "pending",
        },
      ];
      if (q.confirmationCode) {
        const found = demo.find((d) => d.confirmation_code === q.confirmationCode);
        if (!found) return reply.status(404).send({ error: "not found" });
        return found;
      }
      return demo;
    }
  });

  fastify.post("/bookings", async (request, reply) => {
    const req = request as any;
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(req, reply, ["guest", "host", "admin"]);
      if (reply.sent) return;
      if (res) return res;
    }
    const body = request.body as any;
    try {
      const res = await query(
        `INSERT INTO bookings (confirmation_code, listing_id, guest_name, property, check_in, check_out, access_code, wifi_name, wifi_password, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING id, confirmation_code, listing_id, guest_name, property, check_in, check_out, access_code, wifi_name, wifi_password, status`,
        [
          body.confirmation_code,
          body.listing_id,
          body.guest_name,
          body.property,
          body.check_in,
          body.check_out,
          body.access_code,
          body.wifi_name,
          body.wifi_password,
          body.status || "pending",
        ]
      );
      return res.rows[0];
    } catch (err) {
      return {
        id: Math.floor(Math.random() * 100000),
        confirmation_code: body.confirmation_code || "DEMO123",
        listing_id: body.listing_id,
        guest_name: body.guest_name,
        property: body.property,
        check_in: body.check_in,
        check_out: body.check_out,
        access_code: body.access_code,
        wifi_name: body.wifi_name,
        wifi_password: body.wifi_password,
        status: body.status || "pending",
      };
    }
  });

  fastify.get("/bookings/:bookingId", async (request, reply) => {
    const { bookingId } = request.params as any;
    try {
      const res = await query(
        "SELECT id, confirmation_code, guest_name, property, check_in, check_out, status FROM bookings WHERE id = $1",
        [bookingId]
      );
      if (res.rows.length === 0) return reply.status(404).send({ error: "not found" });
      return res.rows[0];
    } catch (err) {
      return {
        id: bookingId,
        confirmation_code: "HX4K9M2",
        guest_name: "Alex Johnson",
        property: "Modern Downtown Loft",
        check_in: "2026-03-01",
        check_out: "2026-03-05",
        status: "confirmed",
      };
    }
  });

  fastify.post("/bookings/:bookingId/cancel", async (request) => {
    const { bookingId } = request.params as any;
    const body = request.body as any;
    return {
      booking: {
        id: bookingId,
        status: "cancelled",
      },
      refund: {
        amount: 50,
        currency: "USD",
        policy: body?.reason || "standard",
      },
    };
  });
}
