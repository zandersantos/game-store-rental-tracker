import "dotenv/config";
import { PrismaClient, ItemCategory, ItemStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to your .env file before seeding.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SEED_ITEMS: Array<{
    id: string;
    name: string;
    category: ItemCategory;
    status: ItemStatus;
    imageUrl: string | null;
}> = [
  {
    id: "a1000001-0000-4000-8000-000000000001",
    name: "Catan (5th Edition)",
    category: ItemCategory.GAME,
    status: ItemStatus.AVAILABLE,
    imageUrl: null,
  },
  {
    id: "a1000001-0000-4000-8000-000000000002",
    name: "Wingspan",
    category: ItemCategory.GAME,
    status: ItemStatus.RENTED,
    imageUrl: null,
  },
  {
    id: "a1000001-0000-4000-8000-000000000003",
    name: "D&D Player's Handbook (2024)",
    category: ItemCategory.GAME,
    status: ItemStatus.AVAILABLE,
    imageUrl: null,
  },
  {
    id: "a1000001-0000-4000-8000-000000000004",
    name: "Pathfinder 2e Core Rulebook",
    category: ItemCategory.GAME,
    status: ItemStatus.MAINTENANCE,
    imageUrl: null,
  },
  {
    id: "a1000001-0000-4000-8000-000000000005",
    name: "Nintendo Switch OLED",
    category: ItemCategory.HARDWARE,
    status: ItemStatus.AVAILABLE,
    imageUrl: null,
  },
  {
    id: "a1000001-0000-4000-8000-000000000006",
    name: "PlayStation 5 Slim",
    category: ItemCategory.HARDWARE,
    status: ItemStatus.RENTED,
    imageUrl: null,
  },
] as const;

type SeedItem = (typeof SEED_ITEMS)[number];

function initialStatusLog(
  item: SeedItem,
  adminId: string,
  staffId: string,
): {
  itemId: string;
  previousStatus: ItemStatus;
  newStatus: ItemStatus;
  changedById: string;
  note: string;
} {
  switch (item.status) {
    case ItemStatus.AVAILABLE:
      return {
        itemId: item.id,
        previousStatus: ItemStatus.AVAILABLE,
        newStatus: ItemStatus.AVAILABLE,
        changedById: adminId,
        note: "Initial inventory entry — item added to rental catalog.",
      };
    case ItemStatus.RENTED:
      return {
        itemId: item.id,
        previousStatus: ItemStatus.AVAILABLE,
        newStatus: ItemStatus.RENTED,
        changedById: staffId,
        note: "Checked out to a regular — weekend in-store demo rental.",
      };
    case ItemStatus.MAINTENANCE:
      return {
        itemId: item.id,
        previousStatus: ItemStatus.AVAILABLE,
        newStatus: ItemStatus.MAINTENANCE,
        changedById: staffId,
        note: "Sent to maintenance — worn binding and loose pages reported.",
      };
    default: {
      const _exhaustive: never = item.status;
      throw new Error(`Unhandled item status: ${_exhaustive}`);
    }
  }
}

async function main() {
  console.log("Seeding Game Store Rental Tracker database...\n");

  const admin = await prisma.user.upsert({
    where: { email: "admin@gamestore.com" },
    update: { name: "Alex Admin" },
    create: {
      email: "admin@gamestore.com",
      name: "Alex Admin",
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@gamestore.com" },
    update: { name: "Sam Staff" },
    create: {
      email: "staff@gamestore.com",
      name: "Sam Staff",
    },
  });

  console.log(`Users: ${admin.name} (${admin.email}), ${staff.name} (${staff.email})`);

  const items = [];
  for (const item of SEED_ITEMS) {
    const upserted = await prisma.item.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        category: item.category,
        status: item.status,
        imageUrl: item.imageUrl,
      },
      create: item,
    });
    items.push(upserted);
  }

  console.log(`Items: ${items.length} games and hardware units seeded`);

  let logsCreated = 0;
  for (const item of SEED_ITEMS) {
    const logData = initialStatusLog(item, admin.id, staff.id);

    const existingLog = await prisma.statusLog.findFirst({
      where: {
        itemId: item.id,
        note: logData.note,
      },
    });

    if (!existingLog) {
      await prisma.statusLog.create({ data: logData });
      logsCreated += 1;
    }
  }

  console.log(`Status logs: ${logsCreated} new entries (${SEED_ITEMS.length - logsCreated} already present)`);
  console.log("\nSeed completed successfully.");
}

main()
  .catch((error) => {
    console.error("\nSeed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
