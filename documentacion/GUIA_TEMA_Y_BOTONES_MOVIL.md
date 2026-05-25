# GUIA DE TEMA Y BOTONES INTERACTIVOS EN MOVIL

## IDEA GENERAL

La UI movil tiene botones que dependen de JavaScript en el navegador: filtros, tema y carrito. El carrito navega con `Link`; filtros y tema ejecutan acciones cliente.

```mermaid
flowchart TD
  A[MobileHeader] --> B[Boton filtros]
  A --> C[Boton tema]
  A --> D[Link carrito]
  B --> E[useMobileFilter.openFilters]
  C --> F[useTheme.setTheme]
  D --> G["/carrito"]
```

## ARCHIVOS QUE PARTICIPAN

| Archivo | Funcion |
| --- | --- |
| `components/movil/layout/MobileHeader.tsx` | Contiene botones principales del header movil. |
| `components/movil/layout/MobileFilterContext.tsx` | Guarda `filtersOpen`, `openFilters` y `closeFilters`. |
| `components/movil/layout/MobileAppChrome.tsx` | Une header, drawer y bottom nav. |
| `components/movil/productos/MobileFilterDrawer.tsx` | Muestra filtros en panel movil. |
| `providers/ThemeProvider.tsx` | Provee `next-themes`. |
| `components/compartidos/layout/ThemeToggle.tsx` | Toggle equivalente para escritorio. |

## FLUJO DEL BOTON DE FILTROS

```mermaid
sequenceDiagram
  participant U as Usuario
  participant Header as MobileHeader
  participant Context as MobileFilterContext
  participant Drawer as MobileFilterDrawer

  U->>Header: Toca menu
  Header->>Context: openFilters()
  Context-->>Drawer: filtersOpen true
  Drawer-->>U: Panel visible
  U->>Drawer: Cierra
  Drawer->>Context: closeFilters()
```

## FLUJO DEL BOTON DE TEMA

```mermaid
sequenceDiagram
  participant U as Usuario
  participant Header as MobileHeader
  participant Theme as next-themes
  participant Html as html

  U->>Header: Toca tema
  Header->>Header: Verifica mounted
  Header->>Theme: setTheme(nextTheme)
  Theme->>Html: Agrega o quita dark
  Html-->>U: Tailwind aplica dark:*
```

## GRAFICO DE ESTADOS

```mermaid
stateDiagram-v2
  [*] --> NoMontado
  NoMontado --> Montado: hidrata cliente
  Montado --> Claro: resolvedTheme light
  Montado --> Oscuro: resolvedTheme dark
  Claro --> Oscuro: setTheme dark
  Oscuro --> Claro: setTheme light
```

## PUNTOS IMPORTANTES

- `MobileHeader` es `"use client"` porque usa hooks de navegador.
- El boton de tema se deshabilita hasta que el componente esta montado.
- El boton de filtros depende de `MobileFilterProvider`.
- `MobileAppChrome` debe estar dentro de `MobileFilterProvider`.
- El carrito usa navegacion normal de Next.js con `Link`.

## REGLAS DE MANTENIMIENTO

- No mezclar estado del drawer dentro del header.
- No duplicar logica de tema entre movil y escritorio si puede vivir en el mismo patron.
- Mantener botones tactiles con tamano estable.
- No cambiar clases Tailwind sin revisar ambos temas.

