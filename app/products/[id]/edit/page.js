"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import {
  fetchProductById,
  updateProduct,
  fetchCategories,
} from "@/lib/api/products";

function EditProductInner() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetchProductById(id, controller.signal)
      .then(setProduct)
      .catch((err) => {
        if (err?.original?.code === "ERR_CANCELED") return;
        setError(err?.message || "Could not load this product.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  async function handleSubmit(payload) {
    // DummyJSON echoes the update back but doesn't persist it either,
    // so we merge it into local state before heading back to the list.
    await updateProduct(id, payload);
    setNotice("Product updated. Note: DummyJSON doesn't persist edits, so the change won't survive a refresh.");
    setTimeout(() => router.push("/products"), 1200);
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Link
          href="/products"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        <h1 className="mb-1 text-xl font-semibold text-ink-900">
          Edit product
        </h1>
        <p className="mb-5 text-sm text-ink-500">
          Update the details and save your changes.
        </p>

        {notice && (
          <div className="mb-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
            {notice}
          </div>
        )}

        {loading && <Loader label="Loading product..." />}
        {!loading && error && (
          <ErrorState message={error} onRetry={() => router.refresh()} />
        )}

        {!loading && !error && product && (
          <ProductForm
            initialValues={product}
            categories={categories}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
          />
        )}
      </main>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <ProtectedRoute>
      <EditProductInner />
    </ProtectedRoute>
  );
}
