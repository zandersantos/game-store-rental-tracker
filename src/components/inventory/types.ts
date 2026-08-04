import type { ItemCategory, ItemStatus } from "@prisma/client";

export type InventoryItem = {
  id: string;
  name: string;
  category: ItemCategory;
  status: ItemStatus;
  updatedAt: string;
};

export type InventoryStats = {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
};

export type InventoryFilters = {
  query?: string;
  status?: ItemStatus;
  category?: ItemCategory;
};
