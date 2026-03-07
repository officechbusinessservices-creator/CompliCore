import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  // Demo host user (password: Demo1234)
  const passwordHash = await argon2.hash("Demo1234", {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
  });

  await prisma.user.upsert({
    where: { email: "demo@complicore.com" },
    update: {},
    create: {
      email: "demo@complicore.com",
      firstName: "Demo",
      lastName: "Host",
      passwordHash,
      roles: ["host"],
    },
  });

  // Billing plans
  const plans = [
    { code: "host_club",     name: "Host Club",       interval: "month", price_per_property: 18,  description: "Up to 10 properties" },
    { code: "host_club_ai",  name: "Host Club + AI",  interval: "month", price_per_property: 46,  description: "AI pricing and screening for growth operators" },
    { code: "portfolio_pro", name: "Portfolio Pro",   interval: "month", price_flat: 399,          description: "Includes 15 properties, +$25 each additional" },
    { code: "enterprise",    name: "Enterprise",      interval: "month", price_flat: 888,          description: "Best fit for 25+ properties and multi-entity operations" },
    { code: "corporate_sme", name: "Corporate SME",   commission_rate: 0.08,                       description: "8% commission per booking" },
  ];
  for (const plan of plans) {
    await prisma.billingPlan.upsert({ where: { code: plan.code }, update: {}, create: plan });
  }

  // Listings
  await prisma.listing.createMany({
    skipDuplicates: true,
    data: [
      { host_id: 1, title: "Ocean View Suite",   address: "1 Ocean Dr, Miami, FL",        price_per_night: 240, status: "active" },
      { host_id: 1, title: "Downtown Loft",       address: "88 Brickell Ave, Miami, FL",   price_per_night: 180, status: "active" },
      { host_id: 1, title: "Mountain Cabin",      address: "12 Pine Rd, Asheville, NC",    price_per_night: 295, status: "active" },
      { host_id: 1, title: "Cozy Studio",         address: "45 Maple Ave, Nashville, TN",  price_per_night:  95, status: "active" },
      { host_id: 1, title: "Modern Beach House",  address: "500 Collins Ave, Miami, FL",   price_per_night: 320, status: "active" },
    ],
  });

  // Bookings
  const now = new Date();
  const day = (n: number) => new Date(now.getTime() + n * 86_400_000).toISOString().slice(0, 10);

  await prisma.booking.createMany({
    skipDuplicates: true,
    data: [
      { confirmation_code: "AIR-HX4K9M", listing_id: 1, guest_name: "Alex Johnson",  property: "Ocean View Suite",   check_in: day(3),   check_out: day(8),  access_code: "4829", wifi_name: "OceanGuest",  wifi_password: "Welcome2026", status: "confirmed" },
      { confirmation_code: "AIR-7RNW12", listing_id: 2, guest_name: "Maria Garcia",   property: "Downtown Loft",      check_in: day(5),   check_out: day(7),  access_code: "1122", wifi_name: "LoftWifi",    wifi_password: "Loft2026",    status: "confirmed" },
      { confirmation_code: "VR-2PQX88",  listing_id: 3, guest_name: "James Lee",      property: "Mountain Cabin",     check_in: day(13),  check_out: day(18), access_code: "9900", wifi_name: "CabinNet",    wifi_password: "Mountain99",  status: "pending"   },
      { confirmation_code: "BCOM-9KZT3", listing_id: 4, guest_name: "Sarah Chen",     property: "Cozy Studio",        check_in: day(-2),  check_out: day(0),  access_code: "3344", wifi_name: "StudioWifi",  wifi_password: "Studio44",    status: "completed" },
      { confirmation_code: "AIR-MM5TYQ", listing_id: 5, guest_name: "Omar Khalil",    property: "Modern Beach House", check_in: day(25),  check_out: day(31), access_code: "7711", wifi_name: "BeachHouse",  wifi_password: "Beach2026",   status: "confirmed" },
      { confirmation_code: "VR-88NXP1",  listing_id: 1, guest_name: "Lisa Park",      property: "Ocean View Suite",   check_in: day(11),  check_out: day(15), access_code: "5566", wifi_name: "OceanGuest",  wifi_password: "Welcome2026", status: "confirmed" },
      { confirmation_code: "AIR-DX01KC", listing_id: 2, guest_name: "Tom Rivera",     property: "Downtown Loft",      check_in: day(34),  check_out: day(37), access_code: "2288", wifi_name: "LoftWifi",    wifi_password: "Loft2026",    status: "pending"   },
      { confirmation_code: "BCOM-WQ73R", listing_id: 3, guest_name: "Nina Patel",     property: "Mountain Cabin",     check_in: day(-5),  check_out: day(-1), access_code: "6677", wifi_name: "CabinNet",    wifi_password: "Mountain99",  status: "completed" },
    ],
  });

  // Messages
  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      { booking_id: 1, sender: "host",  body: "Welcome Alex! Your access code is 4829. Let me know if you need anything." },
      { booking_id: 1, sender: "guest", body: "Thank you! Is early check-in possible?" },
      { booking_id: 1, sender: "host",  body: "Yes, I can do 1 PM if the previous guest checks out on time." },
      { booking_id: 2, sender: "host",  body: "Hi Maria, your loft is ready. WiFi: LoftWifi / Loft2026" },
      { booking_id: 2, sender: "guest", body: "Perfect, we land at 6 PM." },
      { booking_id: 4, sender: "host",  body: "Thanks for staying Sarah! Hope you enjoyed the studio." },
      { booking_id: 4, sender: "guest", body: "Loved it! Very clean and well located. 5 stars!" },
    ],
  });

  // Payments (for completed/confirmed bookings)
  await prisma.payment.createMany({
    skipDuplicates: true,
    data: [
      { booking_id: 1, amount: 1140, currency: "USD", status: "succeeded" },
      { booking_id: 2, amount:  324, currency: "USD", status: "succeeded" },
      { booking_id: 4, amount:  171, currency: "USD", status: "succeeded" },
      { booking_id: 6, amount: 1060, currency: "USD", status: "succeeded" },
      { booking_id: 8, amount:  885, currency: "USD", status: "succeeded" },
    ],
  });

  // Payouts
  await prisma.payout.createMany({
    skipDuplicates: true,
    data: [
      { host_id: 1, amount: 2847.50, status: "completed", method: "bank_transfer", date: new Date(now.getTime() - 7 * 86_400_000) },
      { host_id: 1, amount: 1890.00, status: "pending",   method: "bank_transfer", date: new Date(now.getTime() + 7 * 86_400_000) },
      { host_id: 1, amount: 3210.00, status: "pending",   method: "bank_transfer", date: new Date(now.getTime() + 14 * 86_400_000) },
    ],
  });

  console.log("✅ Seed complete");
  console.log("   Login: demo@complicore.com / Demo1234");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
