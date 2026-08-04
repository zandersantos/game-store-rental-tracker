"use client";

import { History, Pencil } from "lucide-react";
import { useState } from "react";

import { CategoryBadge } from "./CategoryBadge";
import { StatusBadge } from "./StatusBadge";
import { StatusLogDrawer } from "./StatusLogDrawer";
import type { InventoryItem } from "./types";
import { UpdateStatusModal } from "./UpdateStatusModal";

type InventoryTableProps = {
  items: InventoryItem[];
  staffUserId: string;
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function InventoryTable({ items, staffUserId }: InventoryTableProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [modalItem, setModalItem] = useState<InventoryItem | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                >
                  Item Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 sm:table-cell"
                >
                  Last Updated
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400"
                  >
                    No items match your filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <CategoryBadge category={item.category} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 sm:table-cell">
                      {formatTimestamp(item.updatedAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setModalItem(item)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          <History className="h-3.5 w-3.5" aria-hidden />
                          History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UpdateStatusModal
        item={modalItem}
        staffUserId={staffUserId}
        onClose={() => setModalItem(null)}
      />

      <StatusLogDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}
