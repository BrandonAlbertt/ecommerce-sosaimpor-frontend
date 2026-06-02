"use client";

// ============================================================
// HOOK PARA CONTROLAR FILTROS APLICADOS
// ============================================================
// Funcionalidad: filtrado publico de productos.
// Sirve para guardar filtros, limpiar filtros, cambiar pagina y consultar la API.
// Devuelve: productos, paginacion, loading, error, filtros y acciones.
//

import { useCallback, useMemo, useState } from "react";

import type {
  ProductFilterKey,
  ProductFilterParams,
  ProductFilterValue,
  PublicProductListParams,
} from "../types/product.types";

import { useProductRaiz } from "./useProductRaiz";

type UseProductFiltersOptions = {
  enabled?: boolean;
  initialFilters?: ProductFilterParams;
  initialPage?: number;
  limit?: number;
};

const defaultPage = 1;
const defaultLimit = 12;

function removeEmptyFilters(filters: ProductFilterParams) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => (
      value !== "" &&
      value !== null &&
      value !== undefined
    )),
  ) as ProductFilterParams;
}

// HOOK PUBLICO PARA FILTRAR PRODUCTOS DESDE LA API.
// Mantiene filtros, pagina y limit separados para que sea facil depurar.
export function useProductFilters({
  enabled = true,
  initialFilters = {},
  initialPage = defaultPage,
  limit = defaultLimit,
}: UseProductFiltersOptions = {}) {
  const [filters, setFilters] = useState<ProductFilterParams>(() => removeEmptyFilters(initialFilters));
  const [page, setPage] = useState(initialPage);

  const params = useMemo<PublicProductListParams>(
    () => ({
      ...filters,
      page,
      limit,
    }),
    [filters, limit, page],
  );

  const productsState = useProductRaiz(params, { enabled });

  const updateFilter = useCallback(
    <Key extends ProductFilterKey>(key: Key, value: ProductFilterValue<Key>) => {
      setFilters((currentFilters) => {
        const nextFilters = { ...currentFilters };

        if (value === "" || value === null || value === undefined) {
          delete nextFilters[key];
        } else {
          nextFilters[key] = value as ProductFilterParams[Key];
        }

        return nextFilters;
      });

      setPage(defaultPage);
    },
    [],
  );

  const applyFilters = useCallback((nextFilters: ProductFilterParams) => {
    setFilters(removeEmptyFilters(nextFilters));
    setPage(defaultPage);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(defaultPage);
  }, []);

  const changePage = useCallback((nextPage: number) => {
    setPage(Math.max(defaultPage, nextPage));
  }, []);

  return {
    accumulatedProducts: productsState.accumulatedProducts,
    products: productsState.products,
    pagination: productsState.pagination,
    loading: productsState.isLoading,
    error: productsState.error,
    filters,
    page,
    limit,
    params,
    updateFilter,
    applyFilters,
    clearFilters,
    changePage,
  };
}
