# Guia simple: `layout`, `providers` y `page`

## Idea general

En esta app, el flujo principal es este:

```mermaid
flowchart TD
  A[app/layout.tsx] --> B[app/providers.tsx]
  B --> C[MobileFilterProvider]
  C --> D{children}
  D --> E[app/page.tsx<br/>ruta /]
  E --> F[ProductPageContainer]
  F --> G[MobileAppChrome]
  F --> H[DesktopHeader]
  F --> I[ProductFilters desktop]
  G --> J[MobileHeader]
  G --> K[MobileFilterDrawer]
```

## Que hace cada parte

### `app/layout.tsx`

Es el marco global de toda la app.

Hace esto:

- envuelve todas las paginas;
- aplica estilos base al `html` y `body`;
- monta los providers globales;
- recibe `children`, que es la pagina activa.

### `app/providers.tsx`

Es un contenedor de providers.

Ahora mismo solo pasa:

- `ThemeProvider`

Sirve para compartir el tema claro/oscuro en toda la app.

### `MobileFilterProvider`

Guarda el estado de filtros moviles.

Sirve para:

- abrir filtros;
- cerrar filtros;
- compartir ese estado entre componentes distintos.

### `app/page.tsx`

Es la pagina principal `/`.

Solo renderiza:

- `ProductPageContainer`

### `ProductPageContainer`

Es el componente que arma la pantalla principal.

Dentro decide que se ve en:

- movil;
- escritorio.

## Modo movil y escritorio

```mermaid
flowchart LR
  A[ProductPageContainer] --> B[MobileAppChrome]
  A --> C[DesktopHeader]
  A --> D[ProductFilters desktop]
  A --> E[ProductGrid]
  B --> F[MobileHeader]
  B --> G[MobileFilterDrawer]
  B --> H[MobileBottomNav]
```

## Como funciona el filtro

Si esta en escritorio:

- se ve `ProductFilters` como panel lateral.

Si esta en movil:

- el panel lateral se oculta;
- el boton de filtros abre `MobileFilterDrawer`;
- dentro del drawer se reutiliza `ProductFilters`.

```mermaid
flowchart TD
  A[ProductFilters] --> B[Escritorio: panel lateral]
  A --> C[Movil: dentro de MobileFilterDrawer]
  C --> D[MobileFilterProvider]
  D --> E[openFilters / closeFilters]
```

## Resumen corto

- `layout.tsx` = marco global.
- `providers.tsx` = providers globales.
- `children` = pagina activa.
- `page.tsx` = ruta `/`.
- `ProductPageContainer` = pantalla principal.
- `MobileFilterProvider` = estado compartido de filtros moviles.
