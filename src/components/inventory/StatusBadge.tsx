import type { ItemStatus } from "@prisma/client";

const STATUS_STYLES: Record<
  ItemStatus,
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: "Available",
    className:
      "bg-emerald-100 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-300",
  },
  RENTED: {
    label: "Rented",
    className:
      "bg-amber-100 text-amber-800 ring-amber-600/20 dark:bg-amber-950 dark:text-amber-300",
  },
  MAINTENANCE: {
    label: "Maintenance",
    className:
      "bg-orange-100 text-orange-800 ring-orange-600/20 dark:bg-orange-950 dark:text-orange-300",
  },
};

type StatusBadgeProps = {
  status: ItemStatus;
  className?: string;
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const { label, className: statusClassName } = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusClassName} ${className}`}
    >
      {label}
    </span>
  );
}
