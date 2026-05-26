// ============================================================
// API DE PRODUCTOS DEL FRONTEND
// ============================================================
// Este archivo es el puente entre los hooks y la API del backend.
//
// Flujo sencillo:
// 1. Un hook llama a getProducts o getProductFilterOptions.
// 2. Este archivo decide que ruta usar.
// 3. axiosClient arma la URL completa y hace la peticion.
// 4. El hook recibe productos, filtros o errores para la pantalla.

// Cliente base que sabe hablar con el backend.
import { axiosClient } from "@/lib/axiosClient";

// Tipos que describen los datos que esta ruta envia y recibe.
import type {
  ProductFilterOptionsResponse,
  ProductListParams,
  ProductListResponse,
} from "../types/product.types";

// Todas las rutas publicas de productos parten de esta ruta.
// Listar, buscar y filtrar productos usan GET /api/productos.
//
// Esta parte NO cambia la ruta base.
// Lo que cambia son los datos agregados despues del signo ?.
//
// Ruta base:
// GET /api/productos
//
// Con paginacion:
// GET /api/productos?page=1&limit=12
//
// Con barra de busqueda:
// GET /api/productos?search=faro&page=1&limit=12
//
// Con un filtro:
// GET /api/productos?marca=Toyota&page=1&limit=12
//
// Con varios filtros juntos:
// GET /api/productos?categoria_id=1&marca=Toyota&search=faro&page=1&limit=12
const productsPath = "/api/productos";

// >>> FUNCION IMPORTANTE: CONVIERTE FILTROS EN TEXTO DE URL <<<
// AQUI SE AGREGA page y limit para paginar.
// AQUI SE AGREGA search para la barra de busqueda.
// AQUI SE AGREGA marca, categoria_id u otros filtros.
// AQUI TAMBIEN SE PUEDEN MEZCLAR BUSQUEDA + VARIOS FILTROS.
//
// Ejemplo:
// { search: "faro", marca: "Toyota", page: 1 }
// se vuelve:
// search=faro&marca=Toyota&page=1
export function createProductsQueryString(params: ProductListParams = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    query.set(key, String(value));
  });

  return query.toString();
}

// >>> FUNCION IMPORTANTE: PIDE PRODUCTOS <<<
// Sirve para catalogo, barra de busqueda y sugerencias.
// Todos esos casos usan la misma ruta; cambian los filtros y el limit.
//
// Ejemplos de lo que puede recibir:
// getProducts({ page: 1, limit: 12 })
//   -> listado paginado.
//
// getProducts({ search: "faro", page: 1, limit: 12 })
//   -> barra de busqueda.
//
// getProducts({ marca: "Toyota", page: 1, limit: 12 })
//   -> filtro por un tipo de dato.
//
// getProducts({ categoria_id: 1, marca: "Toyota", search: "faro", page: 1, limit: 12 })
//   -> busqueda y varios filtros juntos.
export function getProducts(params: ProductListParams = {}, signal?: AbortSignal) {
  return getProductsByQueryString(createProductsQueryString(params), signal);
}

// Esta version recibe el texto de filtros ya armado.
// El hook base useProductRaiz la usa para repetir la consulta solo cuando cambian los filtros.
export function getProductsByQueryString(queryString: string, signal?: AbortSignal) {
  // >>> AQUI SE PEGA EL TEXTO FINAL A LA RUTA <<<
  //
  // productsPath vale:
  // /api/productos
  //
  // queryString puede valer:
  // page=1&limit=12
  // search=faro&page=1&limit=12
  // marca=Toyota&page=1&limit=12
  // categoria_id=1&marca=Toyota&search=faro&page=1&limit=12
  //
  // Entonces path queda como la URL que necesita el backend.
  // Si hay filtros, se agregan despues de ?.
  // Si no hay filtros, se consulta /api/productos directamente.
  const path = queryString ? `${productsPath}?${queryString}` : productsPath;

  return axiosClient.get<ProductListResponse>(path, {
    signal,
  });
}

// >>> FUNCION IMPORTANTE: PIDE OPCIONES PARA LOS FILTROS <<<
// Esta ruta trae categorias, marcas, modelos, anios, precios y disponibilidad.
// Sirve para llenar select, checkbox o rangos del formulario de filtros.
export function getProductFilterOptions(signal?: AbortSignal) {
  return axiosClient.get<ProductFilterOptionsResponse>(`${productsPath}/filtros-opciones`, {
    signal,
  });
}
