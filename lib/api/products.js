import api from "@/lib/axios";

// All product-related API calls live here, kept out of the UI components.

export async function fetchProducts({ limit, skip, sortBy, order, signal }) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  const { data } = await api.get("/products", { params, signal });
  return data;
}

export async function searchProducts({ q, limit, skip, sortBy, order, signal }) {
  const params = { q, limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  const { data } = await api.get("/products/search", { params, signal });
  return data;
}

export async function fetchProductsByCategory({
  category,
  limit,
  skip,
  sortBy,
  order,
  signal,
}) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  const { data } = await api.get(`/products/category/${category}`, {
    params,
    signal,
  });
  return data;
}

export async function fetchCategories() {
  const { data } = await api.get("/products/categories");
  // DummyJSON returns an array of { slug, name, url } objects.
  return data;
}

export async function fetchProductById(id, signal) {
  const { data } = await api.get(`/products/${id}`, { signal });
  return data;
}

export async function createProduct(payload) {
  const { data } = await api.post("/products/add", payload);
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
