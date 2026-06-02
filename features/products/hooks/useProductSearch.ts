"use client";

// ============================================================
// HOOK PARA BUSQUEDA DE PRODUCTOS
// ============================================================
// Funcionalidad: barra de busqueda y sugerencias.
// Sirve para manejar texto escrito, sugerencias y busqueda enviada.
// Devuelve: productSearch, results y submittedSearch.
//

import { useCallback, useEffect, useMemo, useState } from "react";

import type { ProductSearchModel } from "@/features/products/types/productSearch.types";

import { useProductRaiz } from "./useProductRaiz";

const suggestionLimit = 4;
const minimumSearchLength = 3;
const searchDebounceMs = 350;

type UseProductSearchOptions = {
  onSearchSubmit?: (search: string) => void;
};

export function useProductSearch({
  onSearchSubmit,
}: UseProductSearchOptions = {}) {
  const [searchValue, setSearchValue] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const cleanSearch = searchValue.trim();
  const canRequestSuggestions =
    cleanSearch.length >= minimumSearchLength &&
    debouncedSearch === cleanSearch;

  useEffect(() => {
    if (cleanSearch.length < minimumSearchLength) {
      return;
    }

    // Espera una pausa corta para no consultar al backend por cada tecla.
    const debounceId = window.setTimeout(() => {
      setDebouncedSearch(cleanSearch);
    }, searchDebounceMs);

    return () => window.clearTimeout(debounceId);
  }, [cleanSearch]);

  const suggestions = useProductRaiz(
    {
      search: debouncedSearch,
      page: 1,
      limit: suggestionLimit,
    },
    {
      enabled: canRequestSuggestions,
    },
  );

  const handleValueChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const requestSearchResults = useCallback(
    () => {
      if (cleanSearch.length < minimumSearchLength) {
        return;
      }

      setSubmittedSearch(cleanSearch);
      onSearchSubmit?.(cleanSearch);
      setSearchValue("");
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
    submittedSearch,
  };
}
