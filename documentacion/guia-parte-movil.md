# Guía técnica de la parte móvil

Esta guía está pensada para una persona que viene de React con Vite y necesita entender cómo está organizada la parte móvil en este proyecto de Next.js con TypeScript.

La idea principal es simple:

- En Vite normalmente piensas en `index.html` como entrada y en `App.jsx` como el árbol principal.
- En Next.js con App Router no hay un `index.html` editable para la app.
- La entrada real se divide entre `app/layout.tsx` y los archivos `page.tsx` de cada ruta.
- La home del proyecto es `app/page.tsx`.

## Mapa mental rápido

Si vienes de Vite, esta equivalencia te ayuda:

- `index.html` -> ya no se usa como punto de composición de la UI.
- `App.jsx` -> en este proyecto el equivalente funcional es `app/layout.tsx` + `app/page.tsx`.
- `components/` -> sigue existiendo como en React tradicional, pero se organiza por contexto y por ruta.
- `react-router` -> Next.js usa el sistema de rutas por carpetas dentro de `app/`.

## Dónde arranca la app

El archivo que define la estructura global es [app/layout.tsx](app/layout.tsx).

Ahí se montan cosas que deben existir en toda la app:

- `Providers` para temas y contexto global.
- `MobileFilterProvider` para abrir y cerrar el drawer móvil de filtros.
- `MobileAppChrome` para el header móvil, el drawer de filtros y la barra inferior.
- El `children`, que es el contenido de la ruta actual.

En otras palabras, el layout funciona como el envoltorio general de toda la aplicación. Si algo debe estar visible en todas las pantallas móviles, normalmente se engancha aquí.

## Cuál es la home

La home real del proyecto está en [app/page.tsx](app/page.tsx).

Ese archivo no contiene toda la UI directamente. Solo renderiza:

```tsx
import { ProductsPageContent } from "./productos/ProductsPageContent";

export default function Home() {
  return <ProductsPageContent />;
}
```

Eso significa que al entrar a `/`, Next renderiza `ProductsPageContent` como contenido principal.

## Qué ve el usuario en móvil

La experiencia móvil se arma con dos capas:

1. Capa global, que vive en `app/layout.tsx`.
2. Capa de contenido, que vive dentro de `app/productos/ProductsPageContent.tsx` y sus componentes.

### Capa global móvil

El componente [components/layout/mobile/MobileAppChrome.tsx](components/layout/mobile/MobileAppChrome.tsx) agrupa tres piezas:

- [components/layout/mobile/MobileHeader.tsx](components/layout/mobile/MobileHeader.tsx)
- [app/productos/components/mobile/MobileFilterDrawer.tsx](app/productos/components/mobile/MobileFilterDrawer.tsx)
- [components/layout/mobile/MobileBottomNav.tsx](components/layout/mobile/MobileBottomNav.tsx)

Esto quiere decir que el header móvil y la navegación inferior no dependen de la página actual, sino que viven por encima del contenido de cada ruta.

### Capa de contenido móvil

La pantalla principal de tienda se construye en [app/productos/ProductsPageContent.tsx](app/productos/ProductsPageContent.tsx).

Ese componente arma la página con estas secciones:

- `Header` para escritorio.
- `StoreHero` como bloque principal de presentación.
- `CategoryStrip` como acceso a categorías.
- Un botón móvil para abrir filtros.
- `ProductGrid` con los productos destacados.
- `BenefitsBar` con beneficios comerciales.
- `Footer` solo en pantallas medianas o mayores.

## Componentes móviles principales

### 1. Header móvil

Archivo: [components/layout/mobile/MobileHeader.tsx](components/layout/mobile/MobileHeader.tsx)

Función:

- Muestra la marca.
- Abre los filtros.
- Permite cambiar entre tema claro y oscuro.
- Muestra acceso al carrito.
- Incluye una barra de búsqueda.

Puntos importantes:

- Solo se muestra en móvil porque usa la clase `md:hidden`.
- Usa `next-themes` para cambiar el tema.
- Tiene una protección para hidratación con `useSyncExternalStore`.

### 2. Drawer móvil de filtros

Archivo: [app/productos/components/mobile/MobileFilterDrawer.tsx](app/productos/components/mobile/MobileFilterDrawer.tsx)

Función:

- Abre un panel desde abajo para filtrar productos.
- Reutiliza el componente `ProductFilters`.

Por qué existe:

- En escritorio los filtros viven en una columna lateral.
- En móvil esa misma funcionalidad se convierte en un drawer para ahorrar espacio.

### 3. Barra inferior móvil

Archivo: [components/layout/mobile/MobileBottomNav.tsx](components/layout/mobile/MobileBottomNav.tsx)

Función:

- Muestra navegación tipo app ecommerce.
- Da acceso a Inicio, Categorías, Buscar, Carrito y Admin.

Por qué está en el layout:

- No depende de una ruta concreta.
- Debe estar disponible en toda la experiencia móvil.

### 4. Carrusel de categorías móvil

Archivo: [app/productos/components/mobile/MobileCategoryCarousel.tsx](app/productos/components/mobile/MobileCategoryCarousel.tsx)

Función:

- Muestra categorías en una fila horizontal desplazable.
- Es la variante móvil de las categorías destacadas.

### 5. Grilla de productos móvil

Archivo: [app/productos/components/mobile/MobileProductGrid.tsx](app/productos/components/mobile/MobileProductGrid.tsx)

Función:

- Renderiza productos en una grilla de una o dos columnas según el ancho.
- Usa tarjetas pensadas para toque y escaneo rápido.

### 6. Tarjeta de producto móvil

Archivo: [app/productos/components/mobile/MobileProductCard.tsx](app/productos/components/mobile/MobileProductCard.tsx)

Función:

- Muestra imagen, categoría, nombre, descripción, precio, año y botón de agregar.
- Navega al detalle del producto en `/productos/[slug]`.

## Cómo se conectan entre sí

La cadena principal es esta:

```text
app/layout.tsx
  -> MobileAppChrome
    -> MobileHeader
    -> MobileFilterDrawer
    -> MobileBottomNav

app/page.tsx
  -> ProductsPageContent
    -> CategoryStrip
      -> MobileCategoryCarousel
    -> ProductGrid
      -> MobileProductGrid
        -> MobileProductCard
```

Si quieres cambiar algo visible en móvil, primero identifica en qué nivel vive:

- Si aparece en todas las rutas, probablemente está en `app/layout.tsx` o en `components/layout/mobile/`.
- Si solo cambia en la home de productos, probablemente está en `app/productos/`.
- Si es una pieza visual pequeña, puede estar en `app/productos/components/mobile/`.

## Cómo piensa un desarrollador que viene de Vite

La forma más útil de leer este proyecto es esta:

- No busques un único `App.jsx` gigante.
- Piensa en `layout.tsx` como el contenedor global.
- Piensa en cada `page.tsx` como la pantalla de una ruta.
- Piensa en `components/` como piezas reutilizables, no como un árbol único central.

En este proyecto, la UI móvil no está separada por un proyecto distinto. Está mezclada dentro de la misma app, pero con variantes responsivas:

- `md:hidden` para mostrar solo en móvil.
- `hidden md:block` para mostrar solo en escritorio.
- Componentes compartidos que cambian su presentación según el breakpoint.

## Qué tocar si solo trabajas en móvil

Si tu tarea es solo la parte móvil, normalmente vas a editar estas zonas:

- `components/layout/mobile/` para navegación, header y estructura global.
- `app/productos/components/mobile/` para filtros, categorías y tarjetas.
- `app/productos/ProductsPageContent.tsx` para el layout de la home y los accesos móviles.

Evita cambiar el comportamiento de escritorio si no es necesario. En esta base de código, la mayoría de componentes tienen variantes separadas por breakpoint, así que el cambio móvil suele ser local.

## Ruta de la home móvil

Si solo quieres ubicarte rápido, recuerda esto:

1. La app entra por `/`.
2. `/` ejecuta [app/page.tsx](app/page.tsx).
3. Esa página renderiza [app/productos/ProductsPageContent.tsx](app/productos/ProductsPageContent.tsx).
4. El layout global agrega el chrome móvil desde [app/layout.tsx](app/layout.tsx).

Con ese mapa ya puedes ubicar casi cualquier pantalla móvil del proyecto.
