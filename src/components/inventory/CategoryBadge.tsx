import type { ItemCategory } from "@prisma/client";

const CATEGORY_STYLES: Record<
  ItemCategory,
  { label: string; className: string }
> = {
  GAME: {
    label: "Game",
    className:
      "bg-violet-100 text-violet-800 ring-violet-600/20 dark:bg-violet-950 dark:text-violet-300",
  },
  HARDWARE: {
    label: "Hardware",
    className:
      "bg-sky-100 text-sky-800 ring-sky-600/20 dark:bg-sky-950 dark:text-sky-300",
  },
};

type CategoryBadgeProps = {
  category: ItemCategory;
  className?: string;
};

export function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  const { label, className: categoryClassName } = CATEGORY_STYLES[category];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${categoryClassName} ${className}`}
    >
      {label}
    </span>
  );
}
