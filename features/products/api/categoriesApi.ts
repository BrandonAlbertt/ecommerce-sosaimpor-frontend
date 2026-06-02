// ============================================================
// API DE CATEGORIAS DEL FRONTEND
// ============================================================
// Este archivo concentra las rutas publicas de categorias.
// Los componentes no llaman directo al backend; usan hooks.

import { axiosClient } from "@/lib/axiosClient";

import { getCachedRequest, productCacheTimes } from "../cache/productRequestCache";
import type { FeaturedCategoryListResponse } from "../types/category.types";

const featuredCategoriesPath = "/api/categorias/destacadas";

// Pide las categorias destacadas que se muestran en la franja del catalogo.
export function getFeaturedCategories(signal?: AbortSignal) {
  return getCachedRequest(
    "categories:featured",
    productCacheTimes.featuredCategories,
    () => axiosClient.get<FeaturedCategoryListResponse>(featuredCategoriesPath),
    signal,
  );
}
