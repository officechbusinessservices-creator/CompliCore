import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "dev@local" },
    update: {},
    create: { name: "Dev User", email: "dev@local" },
  });

  await prisma.booking.createMany({
    skipDuplicates: true,
    data: [
      {
        confirmation_code: "HX4K9M2",
        listing_id: 101,
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
        confirmation_code: "1234",
        listing_id: 102,
        guest_name: "Test Guest",
        property: "Cozy Studio",
        check_in: "4:00 PM",
        check_out: "10:00 AM",
        access_code: "0000",
        wifi_name: "StudioGuest",
        wifi_password: "password",
        status: "pending",
      },
    ],
  });

  await prisma.listing.createMany({
    skipDuplicates: true,
    data: [
      { title: "Modern Downtown Loft", address: "123 Main St", price_per_night: 150 },
      { title: "Cozy Studio", address: "45 Maple Ave", price_per_night: 85 },
    ],
  });

  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      { booking_id: 1, sender: "host", body: "Welcome! Let me know if you need anything." },
      { booking_id: 1, sender: "guest", body: "Thanks! Where is the key?" },
    ],
  });

  await prisma.payment.createMany({
    skipDuplicates: true,
    data: [
      { booking_id: 1, amount: 250, currency: "USD", status: "succeeded" },
    ],
  });

  await prisma.billingPlan.createMany({
    skipDuplicates: true,
    data: [
      { code: "host_club", name: "Host Club", interval: "month", price_per_property: 18, description: "Up to 10 properties" },
      { code: "host_club_ai", name: "Host Club + AI", interval: "month", price_per_property: 46, description: "AI pricing and screening for growth operators" },
      { code: "portfolio_pro", name: "Portfolio Pro", interval: "month", price_flat: 399, description: "Includes 15 properties, +$25 each additional" },
      { code: "enterprise", name: "Enterprise", interval: "month", price_flat: 888, description: "Best fit for 25+ properties and multi-entity operations" },
      { code: "corporate_sme", name: "Corporate SME", commission_rate: 0.08, description: "8% commission per booking" },
    ],
  });

  await prisma.payout.createMany({
    skipDuplicates: true,
    data: [
      { amount: 2847.5, status: "completed", method: "bank_transfer" },
      { amount: 1890, status: "pending", method: "bank_transfer" },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
