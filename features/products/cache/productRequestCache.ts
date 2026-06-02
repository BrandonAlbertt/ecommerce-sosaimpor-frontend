// ============================================================
// CACHE SIMPLE EN MEMORIA PARA REQUESTS PUBLICOS
// ============================================================
// No usa Provider, Context, Redux, Zustand, localStorage ni sessionStorage.
// Vive solo mientras la pestaña/proceso mantenga este modulo cargado.

type CacheEntry<T> = {
  createdAt: number;
  expiresAt: number;
  promise?: Promise<T>;
  value?: T;
};

const maxCacheEntries = 150;
const memoryCache = new Map<string, CacheEntry<unknown>>();

export const productCacheTimes = {
  config: 7 * 24 * 60 * 60 * 1000,
  detail: 2 * 60 * 1000,
  featuredCategories: 24 * 60 * 60 * 1000,
  filterOptions: 24 * 60 * 60 * 1000,
  productList: 3 * 60 * 1000,
  relatedProducts: 5 * 60 * 1000,
  suggestions: 3 * 60 * 1000,
};

function createAbortError() {
  return new DOMException("La peticion fue cancelada.", "AbortError");
}

function withAbortSignal<T>(promise: Promise<T>, signal?: AbortSignal) {
  if (!signal) {
    return promise;
  }

  if (signal.aborted) {
    return Promise.reject(createAbortError());
  }

  return new Promise<T>((resolve, reject) => {
    const abortRequest = () => reject(createAbortError());

    signal.addEventListener("abort", abortRequest, { once: true });

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => signal.removeEventListener("abort", abortRequest));
  });
}

function trimMemoryCache() {
  const now = Date.now();

  // Primero limpiamos respuestas vencidas. No quitamos promesas en curso
  // porque son las que deduplican requests iguales mientras la API responde.
  memoryCache.forEach((entry, cacheKey) => {
    if (!entry.promise && entry.expiresAt <= now) {
      memoryCache.delete(cacheKey);
    }
  });

  if (memoryCache.size <= maxCacheEntries) {
    return;
  }

  // Si aun sobra cache, removemos las respuestas mas antiguas.
  // Las promesas en curso se conservan para no lanzar requests duplicados.
  const removableEntries = [...memoryCache.entries()]
    .filter(([, entry]) => !entry.promise)
    .sort(([, firstEntry], [, secondEntry]) => firstEntry.createdAt - secondEntry.createdAt);

  for (const [cacheKey] of removableEntries) {
    if (memoryCache.size <= maxCacheEntries) {
      return;
    }

    memoryCache.delete(cacheKey);
  }
}

export function getCachedRequest<T>(
  cacheKey: string,
  ttlMs: number,
  request: () => Promise<T>,
  signal?: AbortSignal,
) {
  const now = Date.now();
  trimMemoryCache();

  const cachedEntry = memoryCache.get(cacheKey) as CacheEntry<T> | undefined;

  if (cachedEntry && cachedEntry.expiresAt > now) {
    if (cachedEntry.value !== undefined) {
      return withAbortSignal(Promise.resolve(cachedEntry.value), signal);
    }

    if (cachedEntry.promise) {
      return withAbortSignal(cachedEntry.promise, signal);
    }
  }

  const requestPromise = request()
    .then((response) => {
      memoryCache.set(cacheKey, {
        createdAt: Date.now(),
        expiresAt: Date.now() + ttlMs,
        value: response,
      });

      return response;
    })
    .catch((error) => {
      memoryCache.delete(cacheKey);
      throw error;
    });

  memoryCache.set(cacheKey, {
    createdAt: now,
    expiresAt: now + ttlMs,
    promise: requestPromise,
  });

  trimMemoryCache();

  return withAbortSignal(requestPromise, signal);
}
