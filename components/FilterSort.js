"use client";

import { ArrowDownAZ, ArrowUpAZ, Filter } from "lucide-react";

const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
  { value: "title", label: "Title" },
];

export default function FilterSort({
  categories,
  category,
  onCategoryChange,
  sortBy,
  onSortByChange,
  order,
  onOrderChange,
  searchActive,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={searchActive}
          title={
            searchActive
              ? "Category filter is off while searching"
              : "Filter by category"
          }
          className="rounded-lg border border-ink-200 bg-white py-2 pl-8 pr-7 text-sm text-ink-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => onOrderChange(order === "asc" ? "desc" : "asc")}
        disabled={!sortBy}
        title="Toggle sort direction"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {order === "asc" ? (
          <ArrowDownAZ className="h-4 w-4" />
        ) : (
          <ArrowUpAZ className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
