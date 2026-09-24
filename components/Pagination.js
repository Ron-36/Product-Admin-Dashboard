"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// Builds a compact page list like: 1, 2, 3, ..., 9, 10
function buildPageList(current, total) {
  const pages = [];
  const window = 1;
  const add = (p) => pages.push(p);

  add(1);
  if (current - window > 2) add("...");
  for (
    let p = Math.max(2, current - window);
    p <= Math.min(total - 1, current + window);
    p++
  ) {
    add(p);
  }
  if (current + window < total - 1) add("...");
  if (total > 1) add(total);

  return pages;
}

export default function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pages = buildPageList(page, totalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-ink-100 px-1 py-4 sm:flex-row">
      <p className="text-sm text-ink-500">
        Showing <span className="font-medium text-ink-800">{start}</span>–
        <span className="font-medium text-ink-800">{end}</span> of{" "}
        <span className="font-medium text-ink-800">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-ink-200 text-ink-600 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-sm text-ink-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition ${
                p === page
                  ? "bg-brand-600 text-white"
                  : "text-ink-600 hover:bg-ink-50"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-ink-200 text-ink-600 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-ink-500">
        <label htmlFor="pageSize">Rows per page</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-md border border-ink-200 bg-white px-2 py-1 text-ink-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
