import { ItemCategory, ItemStatus } from "@prisma/client";

import {
  getDefaultStaffUser,
  getItems,
} from "@/app/actions/inventory";
import { InventoryDashboard } from "@/components/inventory/InventoryDashboard";
import type { InventoryItem, InventoryStats } from "@/components/inventory/types";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
  }>;
};

function parseStatus(value?: string): ItemStatus | undefined {
  if (
    value === ItemStatus.AVAILABLE ||
    value === ItemStatus.RENTED ||
    value === ItemStatus.MAINTENANCE
  ) {
    return value;
  }
  return undefined;
}

function parseCategory(value?: string): ItemCategory | undefined {
  if (value === ItemCategory.GAME || value === ItemCategory.HARDWARE) {
    return value;
  }
  return undefined;
}

function toInventoryItem(
  item: Awaited<ReturnType<typeof getItems>>[number],
): InventoryItem {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    status: item.status,
    updatedAt: item.updatedAt.toISOString(),
  };
}

function computeStats(items: InventoryItem[]): InventoryStats {
  return {
    total: items.length,
    available: items.filter((item) => item.status === ItemStatus.AVAILABLE)
      .length,
    rented: items.filter((item) => item.status === ItemStatus.RENTED).length,
    maintenance: items.filter((item) => item.status === ItemStatus.MAINTENANCE)
      .length,
  };
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || undefined;
  const status = parseStatus(params.status);
  const category = parseCategory(params.category);

  const [filteredItems, allItems, staffUser] = await Promise.all([
    getItems({ query, status, category }),
    getItems(),
    getDefaultStaffUser(),
  ]);

  if (!staffUser) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Staff user not found
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Run the database seed to create demo staff accounts before using the
          dashboard.
        </p>
      </div>
    );
  }

  const serializedFiltered = filteredItems.map(toInventoryItem);
  const serializedAll = allItems.map(toInventoryItem);

  return (
    <InventoryDashboard
      items={serializedFiltered}
      stats={computeStats(serializedAll)}
      staffUserId={staffUser.id}
    />
  );
}
