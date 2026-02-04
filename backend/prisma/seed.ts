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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
