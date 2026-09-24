"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { createProduct, fetchCategories } from "@/lib/api/products";

function AddProductInner() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  async function handleSubmit(payload) {
    // DummyJSON's /products/add doesn't actually persist new products -
    // it just echoes back a fake new id. We still show a success state
    // and send the user back to the list so the flow feels complete.
    await createProduct(payload);
    setNotice("Product created. Note: DummyJSON doesn't persist new products, so it won't appear in the list after a refresh.");
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
          Add product
        </h1>
        <p className="mb-5 text-sm text-ink-500">
          Fill in the details below to add a new product to the catalog.
        </p>

        {notice && (
          <div className="mb-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
            {notice}
          </div>
        )}

        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          submitLabel="Create product"
        />
      </main>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <ProtectedRoute>
      <AddProductInner />
    </ProtectedRoute>
  );
}
