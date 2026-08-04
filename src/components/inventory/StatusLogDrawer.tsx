"use client";

import { History, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { getItemById } from "@/app/actions/inventory";

import { StatusBadge } from "./StatusBadge";
import type { InventoryItem } from "./types";

type StatusLogEntry = {
  id: string;
  previousStatus: InventoryItem["status"];
  newStatus: InventoryItem["status"];
  note: string | null;
  createdAt: string;
  changedBy: {
    id: string;
    name: string;
    email: string;
  };
};

type ItemWithLogs = InventoryItem & {
  statusLogs: StatusLogEntry[];
};

type StatusLogDrawerProps = {
  item: InventoryItem | null;
  onClose: () => void;
};

type StatusLogContentProps = {
  item: InventoryItem;
  onClose: () => void;
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatusLogContent({ item, onClose }: StatusLogContentProps) {
  const [itemWithLogs, setItemWithLogs] = useState<ItemWithLogs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLogs() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getItemById(item.id);
        if (cancelled) return;

        if (!result) {
          setError("Item not found.");
          setItemWithLogs(null);
          return;
        }

        setItemWithLogs({
          id: result.id,
          name: result.name,
          category: result.category,
          status: result.status,
          updatedAt: result.updatedAt.toISOString(),
          statusLogs: result.statusLogs.map((log) => ({
            id: log.id,
            previousStatus: log.previousStatus,
            newStatus: log.newStatus,
            note: log.note,
            createdAt: log.createdAt.toISOString(),
            changedBy: log.changedBy,
          })),
        });
      } catch {
        if (!cancelled) {
          setError("Failed to load status history.");
          setItemWithLogs(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadLogs();

    return () => {
      cancelled = true;
    };
  }, [item.id]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-log-title"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex items-start justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-900">
              <History className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <h2
                id="status-log-title"
                className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
              >
                Status History
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                {item.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close status history"
            className="rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Loading history…
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            >
              {error}
            </p>
          )}

          {!isLoading && !error && itemWithLogs && (
            <>
              <div className="mb-4">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Current status
                </span>
                <div className="mt-1">
                  <StatusBadge status={itemWithLogs.status} />
                </div>
              </div>

              {itemWithLogs.statusLogs.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No status changes recorded yet.
                </p>
              ) : (
                <ol className="relative space-y-0 border-l border-zinc-200 dark:border-zinc-800">
                  {itemWithLogs.statusLogs.map((log, index) => (
                    <li key={log.id} className="relative pb-6 pl-6 last:pb-0">
                      <span
                        className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full ring-4 ring-white dark:ring-zinc-950 ${
                          index === 0
                            ? "bg-zinc-900 dark:bg-zinc-100"
                            : "bg-zinc-300 dark:bg-zinc-600"
                        }`}
                        aria-hidden
                      />
                      <time className="text-xs text-zinc-400">
                        {formatTimestamp(log.createdAt)}
                      </time>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <StatusBadge status={log.previousStatus} />
                        <span className="text-zinc-400" aria-hidden>
                          →
                        </span>
                        <StatusBadge status={log.newStatus} />
                      </div>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                        by {log.changedBy.name}
                      </p>
                      {log.note && (
                        <p className="mt-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                          {log.note}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export function StatusLogDrawer({ item, onClose }: StatusLogDrawerProps) {
  if (!item) return null;

  return <StatusLogContent key={item.id} item={item} onClose={onClose} />;
}
