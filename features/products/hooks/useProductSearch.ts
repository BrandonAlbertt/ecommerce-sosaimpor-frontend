"use client";

// ============================================================
// HOOK PARA BUSQUEDA DE PRODUCTOS
// ============================================================
// Funcionalidad: barra de busqueda y sugerencias.
// Sirve para manejar texto escrito, sugerencias y busqueda enviada.
// Devuelve: productSearch, results y submittedSearch.
//

import { useCallback, useMemo, useState } from "react";

import type { ProductSearchModel } from "@/features/products/types/productSearch.types";

import { useProductRaiz } from "./useProductRaiz";

const suggestionLimit = 4;
const searchResultLimit = 12;

type UseProductSearchOptions = {
  onSearchSubmit?: (search: string) => void;
};

export function useProductSearch({
  onSearchSubmit,
}: UseProductSearchOptions = {}) {
  const [searchValue, setSearchValue] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const cleanSearch = searchValue.trim();

  const suggestions = useProductRaiz(
    {
      search: cleanSearch,
      page: 1,
      limit: suggestionLimit,
    },
    {
      enabled: cleanSearch.length > 0,
    },
  );

  const results = useProductRaiz(
    {
      search: submittedSearch,
      page: 1,
      limit: searchResultLimit,
    },
    {
      enabled: submittedSearch.length > 0,
    },
  );

  const handleValueChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const requestSearchResults = useCallback(
    () => {
      if (!cleanSearch) {
        return;
      }

      setSubmittedSearch(cleanSearch);
      onSearchSubmit?.(cleanSearch);
    },
    [cleanSearch, onSearchSubmit],
  );

  // este usa a useMemo y sa una estrutura de datos que se llama ProductSearchModel, para crear un objeto productSearch
  // que contiene datos de la busqueda, este recibe datos del input de busqueda y los resultados de las sugerencias.
  const productSearch = useMemo<ProductSearchModel>(
    () => ({
      value: searchValue,
      suggestions: suggestions.products,
      suggestionsPagination: suggestions.pagination,
      isLoading: suggestions.isLoading,
      error: suggestions.error,
      onValueChange: handleValueChange,
      onSubmit: requestSearchResults,
      onShowMore: requestSearchResults,
    }),
    [
      handleValueChange,
      requestSearchResults,
      searchValue,
      suggestions.error,
      suggestions.isLoading,
      suggestions.pagination,
      suggestions.products,
    ],
  );

  return {
    productSearch,
    results,
    submittedSearch,
  };
}
