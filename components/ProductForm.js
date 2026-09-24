"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";

const CATEGORY_FALLBACKS = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "smartphones",
];

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  else if (values.title.trim().length < 3)
    errors.title = "Title must be at least 3 characters.";

  if (!values.category.trim()) errors.category = "Category is required.";

  if (values.price === "" || Number(values.price) <= 0)
    errors.price = "Enter a price greater than 0.";

  if (values.stock === "" || Number(values.stock) < 0)
    errors.stock = "Enter a stock value of 0 or more.";

  if (
    values.rating !== "" &&
    (Number(values.rating) < 0 || Number(values.rating) > 5)
  )
    errors.rating = "Rating must be between 0 and 5.";

  if (!values.description.trim())
    errors.description = "Description is required.";
  else if (values.description.trim().length < 10)
    errors.description = "Description must be at least 10 characters.";

  return errors;
}

export default function ProductForm({
  initialValues,
  categories = [],
  onSubmit,
  submitLabel = "Save product",
}) {
  const [values, setValues] = useState({
    title: initialValues?.title || "",
    category: initialValues?.category || "",
    price: initialValues?.price ?? "",
    stock: initialValues?.stock ?? "",
    rating: initialValues?.rating ?? "",
    brand: initialValues?.brand || "",
    description: initialValues?.description || "",
    thumbnail: initialValues?.thumbnail || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const categoryOptions = categories.length
    ? categories.map((c) => c.slug)
    : CATEGORY_FALLBACKS;

  function handleChange(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Guard against double submits (e.g. someone hammering the button).
    if (submitting) return;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit({
        title: values.title.trim(),
        category: values.category,
        price: Number(values.price),
        stock: Number(values.stock),
        rating: values.rating === "" ? 0 : Number(values.rating),
        brand: values.brand.trim(),
        description: values.description.trim(),
        thumbnail:
          values.thumbnail.trim() ||
          "https://cdn.dummyjson.com/products/images/placeholder.png",
      });
    } catch (err) {
      setSubmitError(err?.message || "Could not save the product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-ink-200 bg-white p-5 shadow-card sm:p-6"
    >
      {submitError && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink-700">
            Title
          </label>
          <input
            type="text"
            value={values.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="e.g. Wireless Mechanical Keyboard"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">
            Category
          </label>
          <select
            value={values.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm capitalize focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Select a category</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">
            Brand
          </label>
          <input
            type="text"
            value={values.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="e.g. Logitech"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">
            Price (USD)
          </label>
          <input
            type="number"
            step="0.01"
            value={values.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="49.99"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">
            Stock
          </label>
          <input
            type="number"
            value={values.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="100"
          />
          {errors.stock && (
            <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">
            Rating (0–5)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={values.rating}
            onChange={(e) => handleChange("rating", e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="4.5"
          />
          {errors.rating && (
            <p className="mt-1 text-xs text-red-600">{errors.rating}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-700">
            Thumbnail URL
          </label>
          <input
            type="text"
            value={values.thumbnail}
            onChange={(e) => handleChange("thumbnail", e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="https://..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-ink-700">
            Description
          </label>
          <textarea
            rows={4}
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Short description of the product..."
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end border-t border-ink-100 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-card transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
