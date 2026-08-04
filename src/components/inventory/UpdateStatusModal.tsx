"use client";

import { ItemStatus } from "@prisma/client";
import { AlertTriangle, Check, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { updateItemStatus } from "@/app/actions/inventory";

import { StatusBadge } from "./StatusBadge";
import type { InventoryItem } from "./types";

const STATUS_OPTIONS: Array<{ value: ItemStatus; label: string }> = [
  { value: ItemStatus.AVAILABLE, label: "Available — ready to rent" },
  { value: ItemStatus.RENTED, label: "Rented — checked out to customer" },
  { value: ItemStatus.MAINTENANCE, label: "Maintenance — out of circulation" },
];

type UpdateStatusModalProps = {
  item: InventoryItem | null;
  staffUserId: string;
  onClose: () => void;
};

type UpdateStatusFormProps = {
  item: InventoryItem;
  staffUserId: string;
  onClose: () => void;
};

function UpdateStatusForm({ item, staffUserId, onClose }: UpdateStatusFormProps) {
  const router = useRouter();
  const [newStatus, setNewStatus] = useState(item.status);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (newStatus === item.status && !note.trim()) {
      setError("Select a different status or add a note.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updateItemStatus(
        item.id,
        newStatus,
        staffUserId,
        note.trim() || undefined,
      );
      router.refresh();
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to update status. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex items-start justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Update Status
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {item.name}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close dialog"
          className="rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4 px-6 py-5">
        <div>
          <span className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Current status
          </span>
          <StatusBadge status={item.status} />
        </div>

        <div>
          <label
            htmlFor="new-status"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            New status
          </label>
          <select
            id="new-status"
            value={newStatus}
            onChange={(event) =>
              setNewStatus(event.target.value as ItemStatus)
            }
            disabled={isSubmitting}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="status-note"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Note <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <textarea
            id="status-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            disabled={isSubmitting}
            rows={3}
            placeholder="e.g. Checked out to regular, returned with minor wear…"
            className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Updating…
            </>
          ) : (
            <>
              <Check className="h-4 w-4" aria-hidden />
              Confirm Update
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export function UpdateStatusModal({
  item,
  staffUserId,
  onClose,
}: UpdateStatusModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (item) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [item]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-50 m-auto w-full max-w-md rounded-xl border border-zinc-200 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:border-zinc-700 dark:bg-zinc-950"
    >
      {item && (
        <UpdateStatusForm
          key={item.id}
          item={item}
          staffUserId={staffUserId}
          onClose={onClose}
        />
      )}
    </dialog>
  );
}
