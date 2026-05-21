"use client";

// ============================================================
// HOOK PARA LISTAR, BUSCAR Y FILTRAR PRODUCTOS
// ============================================================
// Un hook junta logica que un componente puede reutilizar.
// Este hook evita poner la peticion API dentro de cada pantalla.
//
// Flujo sencillo:
// 1. Un componente TSX llama a useProducts({ search: "faro" }).
// 2. Este hook pide los productos a productsApi.ts.
// 3. productsApi.ts usa axiosClient.ts para hablar con el backend.
// 4. El componente recibe products, pagination, isLoading y error.

import { useEffect, useState } from "react";

// productsApi.ts sabe que ruta debe consultar.
import { createProductsQueryString, getProductsByQueryString } from "../api/productsApi";
import type {
  ProductApiItem,
  ProductListParams,
  ProductPagination,
} from "../types/product.types";

// enabled permite decidir si la peticion debe salir o esperar.
// Ejemplo: una barra de sugerencias puede esperar hasta escribir 2 letras.
type UseProductsOptions = {
  enabled?: boolean;
};

// Datos simples que el componente recibira desde este hook.
type UseProductsState = {
  products: ProductApiItem[];
  pagination: ProductPagination | null;
  error: string | null;
  isLoading: boolean;
};

// Guardamos el queryString usado para saber si el resultado corresponde
// al filtro actual o a un filtro anterior.
type ProductRequestState = UseProductsState & {
  queryString: string | null;
};

// Estado inicial antes de pedir productos.
const initialState: ProductRequestState = {
  products: [],
  pagination: null,
  error: null,
  isLoading: false,
  queryString: null,
};

// >>> HOOK IMPORTANTE: USE PRODUCTS <<<
// Recibe filtros y devuelve el estado listo para usar en una pantalla.
//
// El componente TSX decide que mandar aqui:
// useProducts({ page: 1, limit: 12 })
//   -> solo listado paginado.
//
// useProducts({ search: "faro", page: 1, limit: 12 })
//   -> agrega search para la barra de busqueda.
//
// useProducts({ marca: "Toyota", page: 1, limit: 12 })
//   -> agrega un filtro.
//
// useProducts({ categoria_id: 1, marca: "Toyota", search: "faro", page: 1, limit: 12 })
//   -> combina varios filtros con la busqueda.
export function useProducts(
  params: ProductListParams = {},
  { enabled = true }: UseProductsOptions = {},
) {
  // state guarda lo ultimo que respondio la API.
  const [state, setState] = useState<ProductRequestState>(initialState);

  // Convertimos el objeto de filtros en texto estable.
  // Si cambia este texto, significa que debemos consultar otra vez.
  //
  // Aqui el hook entrega params a productsApi.ts.
  // productsApi.ts es quien convierte esos params en:
  // ?page=1&limit=12
  // ?search=faro&page=1&limit=12
  // ?marca=Toyota&page=1&limit=12
  // ?categoria_id=1&marca=Toyota&search=faro&page=1&limit=12
  const queryString = createProductsQueryString(params);

  useEffect(() => {
    // Si enabled es false, no hacemos ninguna peticion.
    if (!enabled) {
      return;
    }

    // Permite cancelar una consulta vieja si el filtro cambia rapido.
    const controller = new AbortController();

    // >>> PASO CLAVE: PEDIR PRODUCTOS AL ARCHIVO API <<<
    getProductsByQueryString(queryString, controller.signal)
      .then((response) => {
        // Si la API responde bien, guardamos productos y paginacion.
        setState({
          products: response.data,
          pagination: response.pagination,
          error: null,
          isLoading: false,
          queryString,
        });
      })
      .catch((error: unknown) => {
        // Una cancelacion no es un error para el usuario.
        if (controller.signal.aborted) {
          return;
        }

        // Si la API falla, guardamos un mensaje que la pantalla puede mostrar.
        setState((currentState) => ({
          ...currentState,
          error: error instanceof Error ? error.message : "No se pudieron cargar los productos.",
          isLoading: false,
          queryString,
        }));
      });

    // React ejecuta esta limpieza antes de lanzar otra consulta o desmontar la pantalla.
    return () => controller.abort();
  }, [enabled, queryString]);

  // Cuando la pantalla dice "espera", devolvemos un estado vacio.
  if (!enabled) {
    return initialState;
  }

  // Si cambiaron los filtros y aun no llego la respuesta nueva,
  // la pantalla puede mostrar "cargando".
  if (state.queryString !== queryString) {
    return {
      products: [],
      pagination: null,
      error: null,
      isLoading: true,
    };
  }

  // Si ya tenemos la respuesta del filtro actual, la devolvemos.
  return state;
}

/*
============================================================
EJEMPLO TSX 1: CATALOGO CON FILTROS
============================================================

"use client";

import { useProducts } from "@/features/products/hooks/useProducts";

export function ProductsListExample() {
  const { products, pagination, isLoading, error } = useProducts({
    page: 1,
    limit: 12,
    search: "faro",
    marca: "Toyota",
  });

  if (isLoading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <p>Total: {pagination?.total ?? 0}</p>
      {products.map((product) => (
        <article key={product.id}>
          <h2>{product.nombre}</h2>
          <p>S/ {product.precio}</p>
        </article>
      ))}
    </section>
  );
}

============================================================
EJEMPLO TSX 2: SUGERENCIAS DE BARRA DE BUSQUEDA
============================================================

"use client";

import { useState } from "react";
import { useProducts } from "@/features/products/hooks/useProducts";

export function ProductSearchExample() {
  const [search, setSearch] = useState("");
  const suggestions = useProducts(
    { search, page: 1, limit: 4 },
    { enabled: search.trim().length >= 2 },
  );

  return (
    <div>
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar repuesto"
      />

      {suggestions.products.map((product) => (
        <p key={product.id}>{product.nombre}</p>
      ))}
    </div>
  );
}
*/
