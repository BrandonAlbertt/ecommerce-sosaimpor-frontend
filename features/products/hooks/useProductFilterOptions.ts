"use client";

// ============================================================
// HOOK PARA CARGAR OPCIONES DE FILTROS
// ============================================================
// Funcionalidad: filtros de productos.
// Sirve para llenar combos/selects con datos reales del backend.
// Devuelve: options, isLoading y error.
//
// Este hook trae los valores que el backend ya conoce.
// Asi el frontend no escribe marcas, categorias o anios a mano.
//
// Flujo sencillo:
// 1. Un componente llama a useProductFilterOptions().
// 2. Este hook llama a getProductFilterOptions() de productsApi.ts.
// 3. productsApi.ts consulta /api/productos/filtros-opciones.
// 4. El componente recibe options, isLoading y error.

import { useEffect, useState } from "react";

// Esta funcion sabe que ruta del backend devuelve las opciones.
import { getProductFilterOptions } from "../api/productsApi";
import type { ProductFilterOptionsModel } from "../types/productFilterOptions.types";

// Al inicio todavia no hay opciones y la consulta esta por comenzar.
const initialState: ProductFilterOptionsModel = {
  options: null,
  error: null,
  isLoading: true,
};

// >>> HOOK IMPORTANTE: USE PRODUCT FILTER OPTIONS <<<
// Devuelve las opciones que sirven para construir el formulario de filtros.
export function useProductFilterOptions() {
  const [state, setState] = useState<ProductFilterOptionsModel>(initialState);

  useEffect(() => {
    // Permite cancelar la consulta si el componente deja de existir.
    const controller = new AbortController();

    // >>> PASO CLAVE: PEDIR OPCIONES AL ARCHIVO API <<<
    getProductFilterOptions(controller.signal)
      .then((response) => {
        // Si la API responde bien, options queda listo para usar.
        setState({
          options: response.data,
          error: null,
          isLoading: false,
        });
      })
      .catch((error: unknown) => {
        // Una consulta cancelada no se muestra como error.
        if (controller.signal.aborted) {
          return;
        }

        // Si la API falla, el componente puede mostrar este mensaje.
        setState({
          options: null,
          error: error instanceof Error ? error.message : "No se pudieron cargar los filtros.",
          isLoading: false,
        });
      });

    // Limpieza de React para no dejar una peticion vieja abierta.
    return () => controller.abort();
  }, []);

  // El componente recibe un objeto sencillo y no necesita conocer fetch.
  return state;
}

/*
============================================================
EJEMPLO TSX: SELECT DE MARCAS PARA FILTRAR
============================================================

"use client";

import { useProductFilterOptions } from "@/features/products/hooks/useProductFilterOptions";

export function BrandFilterExample() {
  const { options, isLoading, error } = useProductFilterOptions();

  if (isLoading) return <p>Cargando filtros...</p>;
  if (error) return <p>{error}</p>;

  return (
    <label>
      Marca
      <select>
        <option value="">Todas</option>
        {options?.marcas.map((marca) => (
          <option key={marca} value={marca}>
            {marca}
          </option>
        ))}
      </select>
    </label>
  );
}
*/
