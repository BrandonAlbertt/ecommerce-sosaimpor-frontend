# Guia de la barra de busqueda de productos

Esta guia explica la barra de busqueda actual del frontend: que componente la muestra, que hook consulta la API, como aparecen sugerencias mientras se escribe y como se abre el detalle al hacer clic.

## Flujo rapido

```txt
Home
-> ProductPageContainer
   -> useProductSearch()
      -> useProducts()
         -> productsApi.ts
            -> GET /api/productos?search=texto&page=1&limit=4
   -> ProductSearch
      -> sugerencias
         -> clic en producto
            -> /productos/[slug]
               -> ProductDetailContainer
```

## Archivos que participan

| Archivo | Funcion |
| --- | --- |
| `app/page.tsx` | Carga el Home con `ProductPageContainer`. |
| `components/compartidos/productos/ProductPageContainer.tsx` | Crea la logica de busqueda con `useProductSearch`. |
| `features/products/hooks/useProductSearch.ts` | Guarda el texto escrito y arma el modelo de la barra. |
| `features/products/hooks/useProducts.ts` | Consulta productos y devuelve `products`, `pagination`, `isLoading` y `error`. |
| `features/products/api/productsApi.ts` | Consulta `GET /api/productos` con el query `search`. |
| `components/compartidos/layout/ProductSearch.tsx` | Dibuja input, boton y lista de sugerencias. |
| `components/escritorio/layout/DesktopHeader.tsx` | Muestra `ProductSearch` en escritorio por prop. |
| `components/movil/layout/MobileHeader.tsx` | Muestra `ProductSearch` en movil desde un contexto. |
| `components/movil/layout/MobileHeaderSearchContext.tsx` | Lleva el modelo de busqueda desde la pagina hasta el header movil. |
| `app/productos/[slug]/page.tsx` | Ruta del detalle cuando se hace clic en una sugerencia. |

## Como funciona al escribir

`ProductPageContainer` llama:

```tsx
const { productSearch, results, submittedSearch } = useProductSearch();
```

`useProductSearch` guarda dos textos:

| Variable | Uso |
| --- | --- |
| `searchValue` | Texto que el usuario esta escribiendo ahora. |
| `submittedSearch` | Texto enviado con el boton `Buscar` o `Mostrar mas coincidencias`. |

Cada vez que cambia `searchValue`, el hook llama `useProducts` para sugerencias:

```tsx
useProducts(
  { search: cleanSearch, page: 1, limit: 4 },
  { enabled: cleanSearch.length > 0 },
);
```

Por eso la barra busca **desde la primera letra no vacia**. Si el usuario escribe rapido, `useProducts` cancela la peticion anterior con `AbortController` y conserva la consulta nueva.

## Que muestra `ProductSearch`

`ProductSearch` recibe un `model` y usa sus datos para pintar:

- el texto del input;
- estado `Buscando coincidencias...`;
- error de API;
- mensaje cuando no hay productos;
- hasta 4 sugerencias;
- boton `Mostrar mas coincidencias` cuando hay mas resultados.

Cada sugerencia usa un `Link`:

```tsx
href={`/productos/${product.slug}`}
```

Al hacer clic, Next.js abre la pagina de detalle:

```txt
/productos/slug-del-producto
```

## Datos y funciones del modelo

Tipo usado por la barra:

```ts
ProductSearchModel
```

| Campo | Tipo resumido | Para que sirve |
| --- | --- | --- |
| `value` | `string` | Valor actual del input. |
| `suggestions` | `ProductApiItem[]` | Productos sugeridos desde la API. |
| `suggestionsPagination` | paginacion o `null` | Indica total y si hay mas pagina. |
| `isLoading` | `boolean` | Indica que las sugerencias estan cargando. |
| `error` | `string` o `null` | Mensaje si la consulta falla. |
| `onValueChange(value)` | funcion | Actualiza `searchValue` al escribir. |
| `onSubmit()` | funcion | Guarda el texto como busqueda enviada. |
| `onShowMore()` | funcion | Usa el mismo envio que el boton Buscar. |

Props de `ProductSearch`:

| Prop | Uso |
| --- | --- |
| `model` | Datos y acciones de busqueda. |
| `variant` | `"desktop"` por defecto o `"mobile"` para cambiar tamano y textos. |

## Escritorio y movil

En escritorio el modelo viaja por props:

```txt
ProductPageContainer
-> DesktopHeader productSearch={productSearch}
-> ProductSearch model={productSearch}
```

En movil el header vive en `app/layout.tsx`, fuera de la pagina. Por eso el modelo viaja por contexto:

```txt
ProductPageContainer
-> setProductSearch(productSearch)
-> MobileHeaderSearchContext
-> MobileHeader
-> ProductSearch model={productSearch} variant="mobile"
```

## Boton Buscar y estado actual

El boton `Buscar` y `Mostrar mas coincidencias` guardan el texto en `submittedSearch`. Ese texto dispara otra consulta:

```tsx
useProducts(
  { search: submittedSearch, page: 1, limit: 12 },
  { enabled: submittedSearch.length > 0 },
);
```

Hoy `ProductPageContainer` recibe esos `results` y los registra en consola cuando llegan. La grilla visible todavia usa:

```tsx
<ProductGrid products={catalogProducts} />
```

Por eso actualmente:

- sugerencias al escribir: si funcionan con datos de API;
- clic en sugerencia: si redirige al detalle por `slug`;
- boton Buscar: si consulta resultados, pero aun no reemplaza la grilla visible.

## Regla para seguir programando

Si quieres cambiar como se consulta la API, revisa `useProductSearch` y `useProducts`.

Si quieres cambiar la UI del input o las sugerencias, revisa `ProductSearch`.

Si quieres mostrar los resultados enviados en la grilla, conecta `results.products` con la grilla que hoy recibe `catalogProducts`.
