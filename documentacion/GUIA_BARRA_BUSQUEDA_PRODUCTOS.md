# Guia simple: barra de busqueda de productos

## Idea general

En esta app, la busqueda de productos se crea una sola vez en `ProductPageContainer` y se comparte con el header de escritorio y el header movil.

```mermaid
flowchart TD
  A[app/page.tsx<br/>ruta /] --> B[ProductPageContainer]
  B --> C[useProductSearch]
  C --> D[useProducts<br/>sugerencias]
  C --> E[useProducts<br/>resultados enviados]
  D --> F[productsApi.ts]
  E --> F
  F --> G[axiosClient.ts]
  G --> H[GET /api/productos]

  B --> I[DesktopHeader]
  B --> J[MobileAppChrome]
  I --> K[ProductSearch<br/>desktop]
  J --> L[MobileHeader]
  L --> M[ProductSearch<br/>mobile]
```

## Que hace cada parte

### `app/page.tsx`

Es la pagina principal `/`.

Solo renderiza:

- `ProductPageContainer`

### `ProductPageContainer`

Es el componente que arma la pantalla principal.

Hace esto:

- llama a `useProductSearch`;
- recibe `productSearch`, `results` y `submittedSearch`;
- pasa `productSearch` a `DesktopHeader`;
- pasa `productSearch` a `MobileAppChrome`;
- por ahora registra en consola los resultados enviados.

### `useProductSearch`

Guarda el estado principal de la barra.

Maneja dos textos:

- `searchValue`: texto que el usuario esta escribiendo;
- `submittedSearch`: texto enviado con `Buscar` o `Mostrar mas coincidencias`.

Tambien arma el modelo que consume `ProductSearch`.

### `useProducts`

Consulta la API de productos.

Se usa dos veces:

- para sugerencias con `limit: 4`;
- para resultados enviados con `limit: 12`.

### `ProductSearch`

Es el componente visual de la barra.

Muestra:

- input controlado;
- boton buscar;
- estado de carga;
- error;
- mensaje sin resultados;
- sugerencias;
- boton `Mostrar mas coincidencias`.

## Flujo al escribir

Cuando el usuario escribe, el input cambia `searchValue`. Ese texto limpio se usa para pedir sugerencias.

```mermaid
sequenceDiagram
  participant User as Usuario
  participant UI as ProductSearch
  participant Hook as useProductSearch
  participant Products as useProducts
  participant Api as productsApi.ts
  participant Backend as API Backend

  User->>UI: Escribe texto
  UI->>Hook: onValueChange(value)
  Hook->>Hook: Actualiza searchValue
  Hook->>Products: search limpio + page 1 + limit 4
  Products->>Api: getProductsByQueryString
  Api->>Backend: GET /api/productos?search=texto&page=1&limit=4
  Backend-->>Api: Productos encontrados
  Api-->>Products: JSON tipado
  Products-->>Hook: products, pagination, loading, error
  Hook-->>UI: suggestions en productSearch
  UI-->>User: Lista desplegable
```

## Flujo al hacer clic

Cada sugerencia abre el detalle del producto usando su `slug`.

```mermaid
flowchart LR
  A[Usuario hace clic<br/>en sugerencia] --> B[Link de Next.js]
  B --> C["/productos/[slug]"]
  C --> D[ProductDetailContainer]
```

## Modo movil y escritorio

La logica vive en un solo lugar, pero la UI aparece en dos headers.

```mermaid
flowchart TD
  A[ProductPageContainer] --> B[productSearch]
  B --> C[DesktopHeader]
  B --> D[MobileAppChrome]
  C --> E[ProductSearch desktop]
  D --> F[MobileHeader]
  F --> G[ProductSearch mobile]
```

En escritorio:

- `DesktopHeader` recibe `productSearch`;
- renderiza `ProductSearch` con variante por defecto.

En movil:

- `MobileAppChrome` recibe `productSearch`;
- lo pasa a `MobileHeader`;
- `MobileHeader` renderiza `ProductSearch` con `variant="mobile"`.

## Sugerencias y busqueda enviada

Hay dos consultas separadas para no mezclar el desplegable con la busqueda final.

```mermaid
flowchart TD
  A[useProductSearch] --> B[searchValue]
  A --> C[submittedSearch]

  B --> D{Tiene texto?}
  D -- si --> E[useProducts<br/>limit 4]
  E --> F[Sugerencias del desplegable]

  C --> G{Fue enviado?}
  G -- si --> H[useProducts<br/>limit 12]
  H --> I[Resultados listos para grilla]
```

## Rutas de API

La barra usa la misma ruta publica de productos. Lo que cambia son los query params.

```mermaid
flowchart LR
  A[ProductSearch] --> B[useProductSearch]
  B --> C[useProducts]
  C --> D[productsApi.ts]
  D --> E["/api/productos?search=texto&page=1&limit=4"]
  D --> F["/api/productos?search=texto&page=1&limit=12"]
```

Ejemplos:

- sugerencias: `GET /api/productos?search=faro&page=1&limit=4`;
- busqueda enviada: `GET /api/productos?search=faro&page=1&limit=12`;
- detalle: `/productos/slug-del-producto`.

## Estado actual

Ahora mismo:

- las sugerencias al escribir si usan datos de la API;
- el clic en una sugerencia si abre el detalle por `slug`;
- el boton `Buscar` si consulta resultados con `limit: 12`;
- la grilla visible todavia usa `catalogProducts`.

Para que la grilla muestre la busqueda enviada, hay que conectar `results.products` con `ProductGrid`.

## Resumen corto

- `ProductPageContainer` = crea la logica de busqueda.
- `useProductSearch` = guarda texto, sugerencias y resultados enviados.
- `useProducts` = consulta la API.
- `ProductSearch` = dibuja input y sugerencias.
- `DesktopHeader` = barra en escritorio.
- `MobileHeader` = barra en movil.
- `productsApi.ts` = arma `/api/productos?search=...`.
