"use client";

// ============================================================
// HOOK PARA DETALLE DE PRODUCTO
// ============================================================
// Funcionalidad: cargar un producto por slug desde la API publica.
// No usa context ni provider. Solo recibe slug, consulta y devuelve estado.
//
// Flujo:
// 1. app/productos/[slug]/page.tsx recibe el slug.
// 2. ProductDetailContainer llama a useProductDetail(slug).
// 3. Este hook llama a GET /api/productos/:slug.
// 4. La pantalla recibe product, isLoading y error.

import { useEffect, useState } from "react";

import { getProductBySlug } from "../api/productsApi";
import type { ProductApiItem } from "../types/product.types";

type ProductDetailState = {
  product: ProductApiItem | null;
  error: string | null;
  isLoading: boolean;
};

const initialState: ProductDetailState = {
  product: null,
  error: null,
  isLoading: true,
};

export function useProductDetail(slug: string) {
  const [state, setState] = useState<ProductDetailState>(initialState);

  useEffect(() => {
    if (!slug) {
      return;
    }

    const controller = new AbortController();

    getProductBySlug(slug, controller.signal)
      .then((response) => {
        setState({
          product: response.data,
          error: null,
          isLoading: false,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          product: null,
          error: error instanceof Error ? error.message : "No se pudo cargar el producto.",
          isLoading: false,
        });
      });

    return () => controller.abort();
  }, [slug]);

  if (!slug) {
    return {
      product: null,
      error: "Producto no encontrado.",
      isLoading: false,
    };
  }

  return state;
}
