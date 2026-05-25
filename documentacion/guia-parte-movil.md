# GUIA TECNICA DE LA PARTE MOVIL

## IDEA GENERAL

La experiencia movil usa la misma app que escritorio. No hay deteccion manual de dispositivo: Tailwind decide que piezas se muestran con clases como `md:hidden`.

```mermaid
flowchart TD
  A[ProductPageContainer] --> B[MobileAppChrome]
  B --> C[MobileHeader]
  B --> D[MobileFilterDrawer]
  B --> E[MobileBottomNav]
  A --> F[Contenido del catalogo]
  F --> G[StoreHero]
  F --> H[MobileCategoryCarousel]
  F --> I[Boton Filtrar productos]
  F --> J[MobileProductGrid]
```

## PUNTO DE ENTRADA

| Archivo | Papel |
| --- | --- |
| `app/layout.tsx` | Envuelve la app con `Providers` y `MobileFilterProvider`. |
| `app/page.tsx` | Ruta `/`, renderiza `ProductPageContainer`. |
| `app/productos/page.tsx` | Ruta `/productos`, renderiza el mismo contenedor. |
| `components/compartidos/productos/ProductPageContainer.tsx` | Monta el chrome movil y el contenido. |

## CAPAS DE LA UI MOVIL

```mermaid
flowchart LR
  A[Capa de estado] --> B[MobileFilterProvider]
  B --> C[ProductPageContainer]
  C --> D[Capa chrome movil]
  C --> E[Capa contenido]
  D --> F[Header + Drawer + BottomNav]
  E --> G[Hero + Categorias + Productos]
```

## COMPONENTES PRINCIPALES

| Componente | Archivo | Funcion |
| --- | --- | --- |
| `MobileHeader` | `components/movil/layout/MobileHeader.tsx` | Logo, filtros, tema, carrito y busqueda. |
| `MobileFilterDrawer` | `components/movil/productos/MobileFilterDrawer.tsx` | Panel inferior de filtros. |
| `MobileBottomNav` | `components/movil/layout/MobileBottomNav.tsx` | Navegacion inferior fija. |
| `MobileCategoryCarousel` | `components/movil/productos/MobileCategoryCarousel.tsx` | Carrusel horizontal de categorias. |
| `MobileProductGrid` | `components/movil/productos/MobileProductGrid.tsx` | Grilla movil de productos. |
| `MobileProductCard` | `components/movil/productos/MobileProductCard.tsx` | Card tactil de producto. |

## FLUJO DEL DRAWER DE FILTROS

```mermaid
sequenceDiagram
  participant U as Usuario
  participant H as MobileHeader
  participant C as MobileFilterContext
  participant D as MobileFilterDrawer

  U->>H: Toca boton de filtros
  H->>C: openFilters()
  C-->>D: filtersOpen = true
  D-->>U: Muestra filtros
  U->>D: Cierra drawer
  D->>C: closeFilters()
```

## GRAFICO RESPONSIVE

```mermaid
flowchart TD
  A[Ancho de pantalla] --> B{Menor que md?}
  B -- Si --> C[Mostrar componentes moviles]
  B -- No --> D[Ocultar chrome movil]
  C --> E[md:hidden]
  D --> F[hidden md:block / hidden md:grid]
```

## CRITERIO DE MANTENIMIENTO

- Los componentes moviles deben quedarse en `components/movil/`.
- La logica compartida debe vivir en hooks o tipos de `features/`.
- Los estilos responsive deben seguir expresados con Tailwind.
- Evitar duplicar logica entre movil y escritorio.

