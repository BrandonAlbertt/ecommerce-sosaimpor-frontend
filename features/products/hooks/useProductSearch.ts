"use client";

import { useCallback, useMemo, useState } from "react";

import type { ProductSearchModel } from "@/components/compartidos/layout/ProductSearch";

import { useProducts } from "./useProducts";

const suggestionLimit = 4;
const searchResultLimit = 12;

export function useProductSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const cleanSearch = searchValue.trim();

  const suggestions = useProducts(
    {
      search: cleanSearch,
      page: 1,
      limit: suggestionLimit,
    },
    {
      enabled: cleanSearch.length > 0,
    },
  );

  const results = useProducts(
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
    },
    [cleanSearch],
  );

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
