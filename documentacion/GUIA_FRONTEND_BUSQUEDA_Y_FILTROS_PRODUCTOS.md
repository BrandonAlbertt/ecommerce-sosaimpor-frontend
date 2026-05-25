# GUIA FRONTEND DE BUSQUEDA Y FILTROS DE PRODUCTOS

## OBJETIVO

Esta guia explica como el frontend lista, busca, pagina y filtra productos usando la API publica del backend.

```mermaid
flowchart TD
  A[Componente de catalogo] --> B[Hook]
  B --> C[features/products/api/productsApi.ts]
  C --> D[lib/axiosClient.ts]
  D --> E[ecommerce-sosaimpor-api]
  E --> F[JSON]
  F --> B
  B --> A
```

## ARCHIVOS PRINCIPALES

| Archivo | Responsabilidad |
| --- | --- |
| `features/products/types/product.types.ts` | Tipos de productos, filtros, paginacion y opciones. |
| `features/products/types/productSearch.types.ts` | Modelo de busqueda usado por headers y barra. |
| `features/products/api/productsApi.ts` | Construye query strings y llama rutas de productos. |
| `features/products/hooks/useProducts.ts` | Hook para listar, buscar o filtrar productos. |
| `features/products/hooks/useProductSearch.ts` | Hook especializado para barra de busqueda y sugerencias. |
| `features/products/hooks/useProductFilterOptions.ts` | Hook para traer opciones reales de filtros. |
| `lib/axiosClient.ts` | Cliente HTTP comun. |

## RUTAS DEL BACKEND

| Caso | Ruta |
| --- | --- |
| Listado | `GET /api/productos?page=1&limit=12` |
| Busqueda | `GET /api/productos?search=faro&page=1&limit=12` |
| Filtro | `GET /api/productos?marca=Toyota&page=1&limit=12` |
| Filtros combinados | `GET /api/productos?categoria_id=1&marca=Toyota&search=faro&page=1&limit=12` |
| Opciones de filtros | `GET /api/productos/filtros-opciones` |

## FLUJO DE LISTADO

```mermaid
sequenceDiagram
  participant UI as Componente TSX
  participant Hook as useProducts
  participant API as productsApi.ts
  participant HTTP as axiosClient.ts
  participant BE as Backend

  UI->>Hook: params + options
  Hook->>API: getProducts(params)
  API->>API: createProductsQueryString(params)
  API->>HTTP: get(path, params)
  HTTP->>BE: GET /api/productos
  BE-->>HTTP: Respuesta JSON
  HTTP-->>API: Datos
  API-->>Hook: ProductListResponse
  Hook-->>UI: products, pagination, loading, error
```

## FLUJO DE OPCIONES DE FILTRO

```mermaid
flowchart LR
  A[useProductFilterOptions] --> B[productsApi.ts]
  B --> C[GET /api/productos/filtros-opciones]
  C --> D[Categorias]
  C --> E[Marcas]
  C --> F[Modelos]
  C --> G[Anios]
  C --> H[Precios]
  C --> I[Disponibilidad]
```

## GRAFICO DE RESPONSABILIDADES

```mermaid
quadrantChart
  title Responsabilidad por archivo
  x-axis UI --> Datos
  y-axis Privado --> Compartido
  quadrant-1 Contratos compartidos
  quadrant-2 Componentes visibles
  quadrant-3 Detalle interno
  quadrant-4 Integracion API
  ProductSearch: [0.25, 0.80]
  product.types: [0.82, 0.90]
  productSearch.types: [0.78, 0.85]
  useProducts: [0.62, 0.62]
  productsApi: [0.86, 0.55]
  axiosClient: [0.92, 0.35]
```

## COMO COMBINAR FILTROS

Los filtros no necesitan rutas nuevas. Se combinan como query params:

```txt
categoria_id=1
marca=Toyota
modelo=Corolla
search=faro
page=1
limit=12
```

`productsApi.ts` elimina parametros vacios y conserva solo los valores utiles antes de llamar a `axiosClient.ts`.

## REGLAS DE MANTENIMIENTO

- Las pantallas consumen hooks, no llaman `fetch` directamente.
- Las rutas del backend se centralizan en `productsApi.ts`.
- Los tipos compartidos se guardan en `features/products/types/`.
- Las opciones de filtros solo alimentan controles; no filtran por si solas.
- La combinacion final de filtros debe terminar en `useProducts`.

