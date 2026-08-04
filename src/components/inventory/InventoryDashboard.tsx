"use client";

import { Suspense } from "react";

import { InventoryFilter } from "./InventoryFilter";
import { InventoryTable } from "./InventoryTable";
import type { InventoryItem, InventoryStats } from "./types";

type InventoryDashboardProps = {
  items: InventoryItem[];
  stats: InventoryStats;
  staffUserId: string;
};

function StatCard({
  label,
  value,
  accentClassName,
}: {
  label: string;
  value: number;
  accentClassName: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className={`mt-1 text-3xl font-semibold tracking-tight ${accentClassName}`}>
        {value}
      </p>
    </div>
  );
}

function FilterFallback() {
  return (
    <div className="h-[74px] animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900" />
  );
}

export function InventoryDashboard({
  items,
  stats,
  staffUserId,
}: InventoryDashboardProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Game Store Rental Tracker
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage rental inventory, checkouts, and status history.
        </p>
      </header>

      <section
        aria-label="Inventory summary"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
      >
        <StatCard
          label="Total Items"
          value={stats.total}
          accentClassName="text-zinc-900 dark:text-zinc-50"
        />
        <StatCard
          label="Available"
          value={stats.available}
          accentClassName="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Rented"
          value={stats.rented}
          accentClassName="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Maintenance"
          value={stats.maintenance}
          accentClassName="text-orange-600 dark:text-orange-400"
        />
      </section>

      <Suspense fallback={<FilterFallback />}>
        <InventoryFilter />
      </Suspense>

      <InventoryTable items={items} staffUserId={staffUserId} />
    </div>
  );
}
