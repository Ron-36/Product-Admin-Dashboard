"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import StarRating from "@/components/StarRating";

function StockBadge({ stock }) {
  const low = stock <= 10;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        low ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
      }`}
    >
      {stock} in stock
    </span>
  );
}

// Renders as a table on desktop (sm and up) and a card list on mobile.
export default function ProductList({ products, onDelete }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-ink-200 bg-white shadow-card sm:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {products.map((p) => (
              <tr key={p.id} className="transition hover:bg-brand-50/40">
                <td className="px-4 py-3">
                  <Link
                    href={`/products/${p.id}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="h-10 w-10 rounded-md border border-ink-100 object-cover"
                    />
                    <span className="line-clamp-1 font-medium text-ink-800 hover:text-brand-700">
                      {p.title}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize text-ink-600">
                  {p.category}
                </td>
                <td className="px-4 py-3 font-medium text-ink-800">
                  ${p.price}
                </td>
                <td className="px-4 py-3">
                  <StarRating rating={p.rating} />
                </td>
                <td className="px-4 py-3">
                  <StockBadge stock={p.stock} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/products/${p.id}/edit`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-500 transition hover:bg-brand-50 hover:text-brand-700"
                      aria-label={`Edit ${p.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(p)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-500 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${p.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-ink-200 bg-white p-3 shadow-card"
          >
            <div className="flex gap-3">
              <Link href={`/products/${p.id}`}>
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="h-16 w-16 rounded-lg border border-ink-100 object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${p.id}`}
                  className="line-clamp-1 font-medium text-ink-800"
                >
                  {p.title}
                </Link>
                <p className="mt-0.5 text-xs capitalize text-ink-500">
                  {p.category}
                </p>
                <div className="mt-1.5 flex items-center gap-3">
                  <span className="font-semibold text-brand-700">
                    ${p.price}
                  </span>
                  <StarRating rating={p.rating} />
                </div>
                <div className="mt-1.5">
                  <StockBadge stock={p.stock} />
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-ink-100 pt-2.5">
              <Link
                href={`/products/${p.id}/edit`}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ink-200 py-1.5 text-sm font-medium text-ink-600"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
              <button
                onClick={() => onDelete(p)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 py-1.5 text-sm font-medium text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
