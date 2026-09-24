"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FilterSort from "@/components/FilterSort";
import ProductList from "@/components/ProductList";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import ConfirmModal from "@/components/ConfirmModal";
import useDebounce from "@/lib/useDebounce";
import {
  fetchCategories,
  fetchProducts,
  fetchProductsByCategory,
  searchProducts,
  deleteProduct,
} from "@/lib/api/products";

function parseIntSafe(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

const ALLOWED_PAGE_SIZES = [10, 20, 50];

function ProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ---- URL is the single source of truth for page/search/filter/sort ----
  const urlPage = parseIntSafe(searchParams.get("page"), 1);
  const urlLimitRaw = parseIntSafe(searchParams.get("limit"), 10);
  const urlLimit = ALLOWED_PAGE_SIZES.includes(urlLimitRaw) ? urlLimitRaw : 10;
  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlSortBy = searchParams.get("sortBy") || "";
  const urlOrder = searchParams.get("order") === "desc" ? "desc" : "asc";

  const [searchInput, setSearchInput] = useState(urlQuery);
  const debouncedSearch = useDebounce(searchInput, 450);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const abortRef = useRef(null);
  const requestIdRef = useRef(0);

  function updateQuery(next, { resetPage = true } = {}) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    if (resetPage) params.set("page", "1");
    router.replace(`/products?${params.toString()}`, { scroll: false });
  }

  // Push the debounced search text into the URL (and back to page 1).
  useEffect(() => {
    if (debouncedSearch !== urlQuery) {
      updateQuery({ q: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep the input in sync if the URL changes from elsewhere (back/forward).
  useEffect(() => {
    setSearchInput(urlQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery]);

  // Load categories once.
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const loadProducts = useCallback(async () => {
    // Cancel any in-flight request before starting a new one, and tag
    // this call with an id so a slow, stale response can never
    // overwrite a newer one (guards the "type fast" race condition).
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError("");

    const skip = (urlPage - 1) * urlLimit;

    try {
      let data;
      if (urlQuery) {
        data = await searchProducts({
          q: urlQuery,
          limit: urlLimit,
          skip,
          sortBy: urlSortBy,
          order: urlOrder,
          signal: controller.signal,
        });
      } else if (urlCategory) {
        data = await fetchProductsByCategory({
          category: urlCategory,
          limit: urlLimit,
          skip,
          sortBy: urlSortBy,
          order: urlOrder,
          signal: controller.signal,
        });
      } else {
        data = await fetchProducts({
          limit: urlLimit,
          skip,
          sortBy: urlSortBy,
          order: urlOrder,
          signal: controller.signal,
        });
      }

      if (requestId !== requestIdRef.current) return; // stale, ignore

      const fetchedTotal = data.total ?? 0;
      const totalPages = Math.max(1, Math.ceil(fetchedTotal / urlLimit));

      // ?page=999 or similar out-of-range values: snap back to the
      // last valid page instead of showing a broken/empty screen.
      if (urlPage > totalPages && fetchedTotal > 0) {
        updateQuery({ page: totalPages }, { resetPage: false });
        return;
      }

      setProducts(data.products || []);
      setTotal(fetchedTotal);
    } catch (err) {
      if (err?.original?.code === "ERR_CANCELED" || err?.name === "CanceledError")
        return;
      if (requestId !== requestIdRef.current) return;
      setError(err?.message || "Could not load products.");
      setProducts([]);
      setTotal(0);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPage, urlLimit, urlQuery, urlCategory, urlSortBy, urlOrder]);

  useEffect(() => {
    loadProducts();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [loadProducts]);

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      // DummyJSON doesn't persist deletes server-side, so we remove the
      // item from local state to reflect the action in the UI.
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTotal((t) => Math.max(0, t - 1));
      setDeleteTarget(null);
    } catch (err) {
      setError(err?.message || "Could not delete the product.");
    } finally {
      setDeleting(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / urlLimit));

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex flex-col gap-3">
          <div>
            <h1 className="text-xl font-semibold text-ink-900">Products</h1>
            <p className="text-sm text-ink-500">
              Browse, search and manage the product catalog.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar value={searchInput} onChange={setSearchInput} />
            <FilterSort
              categories={categories}
              category={urlCategory}
              onCategoryChange={(v) => updateQuery({ category: v })}
              sortBy={urlSortBy}
              onSortByChange={(v) => updateQuery({ sortBy: v }, { resetPage: false })}
              order={urlOrder}
              onOrderChange={(v) => updateQuery({ order: v }, { resetPage: false })}
              searchActive={Boolean(urlQuery)}
            />
          </div>
        </div>

        {loading && <Loader label="Loading products..." />}

        {!loading && error && (
          <ErrorState message={error} onRetry={loadProducts} />
        )}

        {!loading && !error && products.length === 0 && (
          <EmptyState
            title="No products found"
            description={
              urlQuery
                ? `No results for "${urlQuery}". Try a different search.`
                : "Try changing your filters or add a new product."
            }
          />
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <ProductList products={products} onDelete={setDeleteTarget} />
            <Pagination
              page={urlPage}
              totalPages={totalPages}
              total={total}
              pageSize={urlLimit}
              onPageChange={(p) => updateQuery({ page: p }, { resetPage: false })}
              onPageSizeChange={(size) => updateQuery({ limit: size })}
            />
          </>
        )}
      </main>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete product"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<Loader label="Loading products..." />}>
        <ProductsPageInner />
      </Suspense>
    </ProtectedRoute>
  );
}
