# DOCUMENTACION RESPONSIVE MOVIL

## RESUMEN GENERAL

La version movil esta dentro de la misma app Next.js. La visibilidad depende de clases responsive de Tailwind, no de deteccion manual con JavaScript.

```mermaid
flowchart TD
  A[Una sola app] --> B{Breakpoint Tailwind}
  B -- Menor que md --> C[UI movil]
  B -- md o mayor --> D[UI escritorio]
  C --> E[md:hidden]
  D --> F[hidden md:block / hidden md:grid]
```

## BREAKPOINTS USADOS

| Clase | Significado en el proyecto |
| --- | --- |
| `md:hidden` | Visible solo en movil. |
| `hidden md:block` | Oculto en movil, visible desde `md`. |
| `hidden md:grid` | Grilla visible desde `md`. |
| `hidden xl:block` | Panel lateral visible solo en escritorio amplio. |
| `pb-20 md:pb-0` | Espacio inferior para bottom nav movil, eliminado en escritorio. |

## ESTRUCTURA RESPONSIVE

```mermaid
flowchart TD
  A[ProductPageContainer] --> B[MobileAppChrome<br/>md:hidden internamente]
  A --> C[DesktopHeader<br/>hidden md:block]
  A --> D[main responsive]
  D --> E[ProductFilters lateral<br/>hidden xl:block]
  D --> F[Contenido central]
  D --> G[CartPreview<br/>hidden xl:block]
  F --> H[CategoryStrip]
  F --> I[ProductGrid]
  H --> J[MobileCategoryCarousel]
  H --> K[DesktopCategoryGrid]
  I --> L[MobileProductGrid]
  I --> M[DesktopProductGrid]
```

## COMPONENTES POR VISTA

| Area | Movil | Escritorio |
| --- | --- | --- |
| Header | `MobileHeader` | `DesktopHeader` |
| Navegacion | `MobileBottomNav` | `Navbar` si se usa en header |
| Filtros | `MobileFilterDrawer` | `ProductFilters` lateral |
| Categorias | `MobileCategoryCarousel` | `DesktopCategoryGrid` |
| Productos | `MobileProductGrid` | `DesktopProductGrid` |
| Footer | Oculto en movil | `DesktopFooter` |

## FLUJO DEL LAYOUT MOVIL

```mermaid
sequenceDiagram
  participant User as Usuario movil
  participant Header as MobileHeader
  participant Drawer as MobileFilterDrawer
  participant Grid as MobileProductGrid

  User->>Header: Busca o abre filtros
  Header->>Drawer: Abre si toca filtros
  Drawer-->>User: Muestra controles
  User->>Grid: Revisa productos
```

## GRAFICO DE PRIORIDADES MOVILES

```mermaid
pie title Peso visual aproximado en movil
  "Header y busqueda" : 25
  "Catalogo" : 45
  "Filtros drawer" : 15
  "Bottom nav" : 15
```

## REGLAS DE MANTENIMIENTO

- Mantener el responsive en Tailwind siempre que sea posible.
- Evitar condicionales JavaScript para decidir movil/escritorio.
- Revisar que cada componente movil tenga espacio tactil suficiente.
- Mantener `overflow-x-hidden` para prevenir desbordes horizontales.
- Si se agrega una nueva seccion, definir desde el inicio su variante movil y escritorio.

