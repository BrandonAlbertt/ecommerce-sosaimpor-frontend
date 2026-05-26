# GUIA DE BARRA DE BUSQUEDA DE PRODUCTOS

## IDEA GENERAL

La busqueda de productos se crea una sola vez en `ProductPageContainer` mediante `useProductSearch`. Ese modelo se comparte con el header de escritorio y el header movil.

```mermaid
flowchart TD
  A[ProductPageContainer] --> B[useProductSearch]
  B --> C[useProductRaiz<br/>sugerencias]
  B --> D[useProductRaiz<br/>resultados enviados]
  C --> E[productsApi.ts]
  D --> E
  E --> F[axiosClient.ts]
  F --> G[GET /api/productos]

  A --> H[DesktopHeader]
  A --> I[MobileAppChrome]
  H --> J[ProductSearch desktop]
  I --> K[MobileHeader]
  K --> L[ProductSearch mobile]
```

## ARCHIVOS QUE PARTICIPAN

| Archivo | Responsabilidad |
| --- | --- |
| `components/compartidos/layout/ProductSearch.tsx` | Componente visual de la barra. |
| `features/products/types/productSearch.types.ts` | Tipos `ProductSearchModel` y `ProductSearchProps`. |
| `features/products/hooks/useProductSearch.ts` | Estado y acciones de busqueda. |
| `features/products/hooks/useProductRaiz.ts` | Hook base interno para consultar productos. |
| `features/products/api/productsApi.ts` | Arma llamadas a la API de productos. |
| `lib/axiosClient.ts` | Ejecuta la peticion HTTP. |

## MODELO DE DATOS

```mermaid
classDiagram
  class ProductSearchModel {
    value
    suggestions
    suggestionsPagination
    isLoading
    error
    onValueChange()
    onSubmit()
    onShowMore()
  }
  ProductSearchModel --> ProductSearch
  ProductSearchModel --> DesktopHeader
  ProductSearchModel --> MobileHeader
```

## FLUJO AL ESCRIBIR

```mermaid
sequenceDiagram
  participant U as Usuario
  participant UI as ProductSearch
  participant Hook as useProductSearch
  participant Products as useProductRaiz
  participant API as productsApi.ts
  participant Backend as Backend

  U->>UI: Escribe texto
  UI->>Hook: onValueChange(value)
  Hook->>Products: search limpio + limit 4
  Products->>API: getProductsByQueryString
  API->>Backend: GET /api/productos
  Backend-->>API: JSON
  API-->>Products: Respuesta tipada
  Products-->>Hook: suggestions
  Hook-->>UI: Modelo actualizado
  UI-->>U: Desplegable
```

## FLUJO AL ENVIAR

```mermaid
flowchart LR
  A[Usuario presiona Buscar] --> B[ProductSearch]
  B --> C[onSubmit]
  C --> D[submittedSearch]
  D --> E[useProductRaiz limit 12]
  E --> F[Resultados listos para catalogo]
```

## REGLAS DE MANTENIMIENTO

- El componente visual no debe guardar la logica de consulta.
- Los tipos compartidos deben quedarse en `features/products/types/`.
- El limite visible del desplegable puede quedarse cerca del componente si solo afecta a esa UI.
- Las llamadas HTTP deben pasar por `productsApi.ts` y `axiosClient.ts`.
