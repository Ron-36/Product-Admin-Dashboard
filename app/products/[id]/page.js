"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  PackageX,
  Star,
  Trash2,
  Truck,
  ShieldCheck,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import ConfirmModal from "@/components/ConfirmModal";
import { fetchProductById, deleteProduct } from "@/lib/api/products";

function NotFoundBlock() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-200 bg-white py-20 text-center">
      <div className="rounded-full bg-ink-100 p-3">
        <PackageX className="h-6 w-6 text-ink-500" />
      </div>
      <p className="font-medium text-ink-800">Product not found</p>
      <p className="max-w-xs text-sm text-ink-500">
        We couldn&apos;t find a product with this id. It may have been
        removed.
      </p>
      <Link
        href="/products"
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>
    </div>
  );
}

function ProductDetailInner() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load(signal) {
    setLoading(true);
    setError("");
    setNotFound(false);
    try {
      const data = await fetchProductById(id, signal);
      setProduct(data);
      setActiveImage(0);
    } catch (err) {
      if (err?.original?.code === "ERR_CANCELED") return;
      if (err?.status === 404) {
        setNotFound(true);
      } else {
        setError(err?.message || "Could not load this product.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteProduct(id);
      router.push("/products");
    } catch (err) {
      setError(err?.message || "Could not delete the product.");
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Link
          href="/products"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        {loading && <Loader label="Loading product..." />}
        {!loading && notFound && <NotFoundBlock />}
        {!loading && !notFound && error && (
          <ErrorState message={error} onRetry={() => load()} />
        )}

        {!loading && !notFound && !error && product && (
          <>
            <div className="grid grid-cols-1 gap-8 rounded-xl border border-ink-200 bg-white p-5 shadow-card sm:p-6 md:grid-cols-2">
              <div>
                <div className="aspect-square overflow-hidden rounded-lg border border-ink-100 bg-ink-50">
                  <img
                    src={
                      product.images?.[activeImage] ||
                      product.thumbnail
                    }
                    alt={product.title}
                    className="h-full w-full object-contain"
                  />
                </div>
                {product.images?.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {product.images.map((img, i) => (
                      <button
                        key={img + i}
                        onClick={() => setActiveImage(i)}
                        className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border ${
                          i === activeImage
                            ? "border-brand-600 ring-1 ring-brand-500"
                            : "border-ink-200"
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                  {product.category}
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-ink-900">
                  {product.title}
                </h1>
                <div className="mt-2 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-sm text-ink-600">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {product.rating?.toFixed?.(2) ?? product.rating}
                  </span>
                  <span className="text-sm text-ink-400">
                    {product.reviews?.length || 0} reviews
                  </span>
                </div>

                <p className="mt-4 text-3xl font-semibold text-ink-900">
                  ${product.price}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-ink-600">
                  {product.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-ink-50 px-3 py-2">
                    <p className="text-xs text-ink-500">Brand</p>
                    <p className="font-medium text-ink-800">
                      {product.brand || "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-ink-50 px-3 py-2">
                    <p className="text-xs text-ink-500">Stock</p>
                    <p className="font-medium text-ink-800">
                      {product.stock} units
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-ink-600">
                  {product.shippingInformation && (
                    <p className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-brand-600" />
                      {product.shippingInformation}
                    </p>
                  )}
                  {product.warrantyInformation && (
                    <p className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-brand-600" />
                      {product.warrantyInformation}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex gap-2">
                  <Link
                    href={`/products/${id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-card transition hover:bg-brand-700"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => setConfirmOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {product.reviews?.length > 0 && (
              <div className="mt-6 rounded-xl border border-ink-200 bg-white p-5 shadow-card sm:p-6">
                <h2 className="mb-4 text-base font-semibold text-ink-900">
                  Customer reviews
                </h2>
                <div className="space-y-4">
                  {product.reviews.map((r, i) => (
                    <div
                      key={i}
                      className="border-b border-ink-100 pb-4 last:border-none last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ink-800">
                          {r.reviewerName}
                        </p>
                        <span className="inline-flex items-center gap-1 text-xs text-ink-500">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {r.rating}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-ink-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <ConfirmModal
        open={confirmOpen}
        title="Delete product"
        description={`Are you sure you want to delete "${product?.title}"? This can't be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <ProtectedRoute>
      <ProductDetailInner />
    </ProtectedRoute>
  );
}
