// ============================================================
// BASE DEL CLIENTE HTTP DEL FRONTEND
// ============================================================
// Este archivo es la primera pieza que habla con el backend.
//
// Flujo sencillo:
// 1. Un archivo de API, por ejemplo productsApi.ts, pide una ruta.
// 2. Este cliente arma la URL completa del backend.
// 3. fetch hace la peticion real.
// 4. Este cliente devuelve el JSON que respondio la API.

// Un query param es un dato que viaja en la URL.
// Ejemplo: /api/productos?search=faro&page=1
type QueryValue = boolean | number | string | null | undefined;

// Si la API responde un error, normalmente manda un message.
type ApiErrorResponse = {
  message?: string;
};

// Opciones que puede recibir una peticion GET.
type GetOptions = {
  // params contiene filtros que se agregan a la URL.
  params?: Record<string, QueryValue>;
  // signal permite cancelar la peticion si el usuario cambia de pantalla o filtro.
  signal?: AbortSignal;
};

// URL usada en desarrollo cuando no existe NEXT_PUBLIC_API_URL.
// Con el backend actual apunta al puerto documentado por la API.
const defaultApiUrl = "http://localhost:3003";

// >>> FUNCION IMPORTANTE: LIMPIA LA URL BASE <<<
// Evita terminar con dos barras al juntar baseURL + ruta.
// Ejemplo: http://localhost:3003/ + /api/productos
function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

// >>> FUNCION IMPORTANTE: AGREGA FILTROS A LA URL <<<
// Recibe datos como { search: "faro", page: 1 }
// y los transforma en ?search=faro&page=1.
function appendQueryParams(url: URL, params?: Record<string, QueryValue>) {
  if (!params) {
    return;
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    url.searchParams.set(key, String(value));
  });
}

// >>> FUNCION IMPORTANTE: HACE LA PETICION GET <<<
// T es el tipo de dato que esperamos recibir como respuesta.
// Ejemplo para productos: ProductListResponse.
async function get<T>(path: string, options: GetOptions = {}) {
  // Aqui se une la URL del backend con la ruta pedida por productsApi.ts.
  const url = new URL(path, `${axiosClient.baseURL}/`);
  appendQueryParams(url, options.params);

  // fetch es quien sale del frontend y consulta al backend.
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    signal: options.signal,
  });

  // Si la API falla, lanzamos un error entendible para que el hook lo muestre.
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ApiErrorResponse | null;
    throw new Error(errorBody?.message ?? `La API respondio con estado ${response.status}.`);
  }

  // Si todo salio bien, devolvemos el JSON al archivo que llamo este cliente.
  return (await response.json()) as T;
}

// >>> OBJETO IMPORTANTE: CLIENTE COMPARTIDO <<<
// productsApi.ts usa axiosClient.get(...) para consultar rutas del backend.
// Mantiene el nombre existente del proyecto sin agregar Axios como dependencia.
export const axiosClient = {
  // NEXT_PUBLIC_API_URL debe apuntar al backend desplegado en produccion.
  baseURL: trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL ?? defaultApiUrl),
  get,
};
