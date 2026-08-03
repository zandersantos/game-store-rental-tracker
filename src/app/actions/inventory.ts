"use server";

import { revalidatePath } from "next/cache";
import {
  ItemCategory,
  ItemStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getItems(filters?: {
  category?: ItemCategory;
  status?: ItemStatus;
  query?: string;
}) {
  const where: Prisma.ItemWhereInput = {};

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.query) {
    where.name = {
      contains: filters.query,
      mode: "insensitive",
    };
  }

  return prisma.item.findMany({
    where,
    orderBy: { name: "asc" },
  });
}

export async function getItemById(id: string) {
  return prisma.item.findUnique({
    where: { id },
    include: {
      statusLogs: {
        orderBy: { createdAt: "desc" },
        include: {
          changedBy: true,
        },
      },
    },
  });
}

export async function updateItemStatus(
  itemId: string,
  newStatus: ItemStatus,
  userId: string,
  note?: string,
) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) {
    throw new Error(`Item not found: ${itemId}`);
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedItem = await tx.item.update({
      where: { id: itemId },
      data: { status: newStatus },
    });

    const statusLog = await tx.statusLog.create({
      data: {
        itemId,
        previousStatus: item.status,
        newStatus,
        changedById: userId,
        note,
      },
    });

    return { item: updatedItem, statusLog };
  });

  revalidatePath("/");
  revalidatePath("/inventory");

  return result;
}
