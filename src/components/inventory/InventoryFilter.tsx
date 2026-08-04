"use client";

import { ItemCategory, ItemStatus } from "@prisma/client";
import { Filter, RefreshCw, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "All statuses" },
  { value: ItemStatus.AVAILABLE, label: "Available" },
  { value: ItemStatus.RENTED, label: "Rented" },
  { value: ItemStatus.MAINTENANCE, label: "Maintenance" },
];

const CATEGORY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "All categories" },
  { value: ItemCategory.GAME, label: "Games" },
  { value: ItemCategory.HARDWARE, label: "Hardware" },
];

type SearchFieldProps = {
  committedQuery: string;
  onQueryCommit: (query: string) => void;
};

function SearchField({ committedQuery, onQueryCommit }: SearchFieldProps) {
  const [query, setQuery] = useState(committedQuery);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query !== committedQuery) {
        onQueryCommit(query);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, committedQuery, onQueryCommit]);

  return (
    <div className="relative flex-1">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by item name…"
        aria-label="Search inventory by name"
        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:bg-zinc-900 dark:focus:ring-zinc-700"
      />
    </div>
  );
}

export function InventoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const committedQuery = searchParams.get("q") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      startTransition(() => {
        const queryString = params.toString();
        router.push(queryString ? `/?${queryString}` : "/");
      });
    },
    [router, searchParams],
  );

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-center">
      <SearchField
        key={committedQuery}
        committedQuery={committedQuery}
        onQueryCommit={(query) => updateParams({ q: query })}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="hidden h-4 w-4 text-zinc-400 sm:block" aria-hidden />

        <select
          value={searchParams.get("status") ?? ""}
          onChange={(event) => updateParams({ status: event.target.value })}
          aria-label="Filter by status"
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value || "all-status"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("category") ?? ""}
          onChange={(event) => updateParams({ category: event.target.value })}
          aria-label="Filter by category"
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value || "all-category"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isPending}
          aria-label="Refresh inventory"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <RefreshCw
            className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
            aria-hidden
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </div>
  );
}
