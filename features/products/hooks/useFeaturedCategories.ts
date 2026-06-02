"use client";

// ============================================================
// HOOK PARA LISTAR CATEGORIAS DESTACADAS
// ============================================================
// Funcionalidad: cargar categorias destacadas desde la API publica.
// No usa context ni provider. Solo consulta la ruta y devuelve estado simple.
//
// Flujo:
// 1. Un componente llama a useFeaturedCategories().
// 2. El hook llama a getFeaturedCategories() en categoriesApi.ts.
// 3. categoriesApi.ts consulta GET /api/categorias/destacadas.
// 4. El componente recibe categories, isLoading y error.

import { useEffect, useState } from "react";

import { getFeaturedCategories } from "../api/categoriesApi";
import type { FeaturedCategoryApiItem } from "../types/category.types";

type FeaturedCategoriesState = {
  categories: FeaturedCategoryApiItem[];
  error: string | null;
  isLoading: boolean;
};

const initialState: FeaturedCategoriesState = {
  categories: [],
  error: null,
  isLoading: true,
};

export function useFeaturedCategories() {
  const [state, setState] = useState<FeaturedCategoriesState>(initialState);

  useEffect(() => {
    const controller = new AbortController();

    getFeaturedCategories(controller.signal)
      .then((response) => {
        setState({
          categories: response.data,
          error: null,
          isLoading: false,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          categories: [],
          error: error instanceof Error ? error.message : "No se pudieron cargar las categorias destacadas.",
          isLoading: false,
        });
      });

    return () => controller.abort();
  }, []);

  return state;
}

