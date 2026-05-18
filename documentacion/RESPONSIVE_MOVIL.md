# Documentacion responsive movil

Este documento explica como esta hecha la version movil del proyecto React/Next.js. No describe cambios pendientes ni modifica la logica; solo documenta la estructura actual.

## Resumen general

La version movil no vive en una aplicacion separada. Esta dentro de la misma app de Next.js y se activa principalmente con clases responsive de Tailwind.

El patron mas importante es:

- Los componentes moviles usan `md:hidden` para mostrarse solo antes del breakpoint `md`.
- Los componentes de escritorio usan `hidden md:block`, `hidden md:grid`, `hidden xl:block` o `lg:flex` para aparecer en pantallas medianas, grandes o extra grandes.
- No hay una deteccion manual de dispositivo con JavaScript para decidir si algo es movil o escritorio.

En otras palabras, el navegador renderiza la misma app y CSS decide que piezas se ven en cada ancho.

## Punto de entrada de la app

La estructura global arranca en:

- `app/layout.tsx`

Ese archivo monta:

- `Providers`, para proveedores globales como el tema.
- `MobileFilterProvider`, para manejar si el drawer movil de filtros esta abierto.
- `MobileAppChrome`, que contiene el header movil, el drawer movil y la barra inferior movil.
- `children`, que representa la ruta actual.

Tambien declara el viewport de la aplicacion:

```tsx
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
```

Esto es importante para moviles porque le dice al navegador que use el ancho real del dispositivo. Asi Tailwind puede aplicar correctamente breakpoints como `sm`, `md`, `lg`, `xl` y `2xl`.

Tambien define clases importantes en el `body`:

```tsx
className="min-h-full overflow-x-hidden bg-white pb-20 ... md:pb-0"
```

La clase `pb-20` deja espacio inferior en movil para la barra de navegacion fija. En `md:pb-0` ese espacio se elimina porque la barra inferior movil ya no se muestra.

## Componentes que cambian entre escritorio y movil

### Header global

Version movil:

- `components/layout/mobile/MobileHeader.tsx`
- Usa `md:hidden`.
- Contiene logo, boton de filtros, boton de tema, acceso al carrito y buscador.
- Esta dentro de `MobileAppChrome`, por eso aparece como chrome global de la app.

Version escritorio:

- `components/layout/Header.tsx`
- Usa `hidden ... md:block`.
- Muestra barra superior informativa, logo, categorias, buscador, cuenta, carrito y toggle de tema.
- Se renderiza dentro de paginas como `ProductsPageContent`, detalle de producto y carrito.

### Navegacion

Movil:

- `components/layout/mobile/MobileBottomNav.tsx`
- Usa `md:hidden`.
- Es una barra inferior fija con accesos a Inicio, Categorias, Buscar, Carrito y Admin.
- Usa `env(safe-area-inset-bottom)` para respetar zonas seguras en telefonos.

Escritorio:

- `components/layout/Navbar.tsx`
- Usa `hidden ... lg:flex`.
- Es una navegacion horizontal pensada para pantallas grandes.

### Filtros

Movil:

- `app/productos/components/mobile/MobileFilterDrawer.tsx`
- Usa `fixed inset-0 z-[60] md:hidden`.
- Se abre como drawer desde abajo.
- Reutiliza `ProductFilters` con `variant="mobile"`.

Escritorio:

- `app/productos/components/ProductFilters.tsx`
- En la pagina de productos se muestra en una columna lateral dentro de `ProductsPageContent`.
- El contenedor de escritorio usa `hidden xl:block`.

El estado de apertura del drawer movil vive en:

- `components/layout/mobile/MobileFilterContext.tsx`

Ese contexto maneja `filtersOpen`, `openFilters` y `closeFilters`. No detecta el ancho de pantalla; solo abre o cierra el drawer cuando la UI movil llama esas funciones.

### Categorias

Componente coordinador:

- `app/productos/components/CategoryStrip.tsx`

Renderiza dos variantes:

- `MobileCategoryCarousel`
- `DesktopCategoryGrid`

Movil:

- `app/productos/components/mobile/MobileCategoryCarousel.tsx`
- Usa `md:hidden`.
- Presenta categorias en carrusel horizontal con `overflow-x-auto`, `snap-x` y `snap-mandatory`.

Escritorio:

- `app/productos/components/desktop/DesktopCategoryGrid.tsx`
- Usa `hidden ... md:grid`.
- Cambia columnas con `sm:grid-cols-4` y `xl:grid-cols-8`.

Nota: en `DesktopCategoryGrid` aparece la combinacion `hidden grid-cols-2 gap-3 md:grid sm:grid-cols-4 xl:grid-cols-8`. Como `hidden` oculta por defecto y `md:grid` aparece desde `md`, la vista realmente se activa desde `md`.

### Productos

Componente coordinador:

- `app/productos/components/ProductGrid.tsx`

Renderiza dos variantes:

- `MobileProductGrid`
- `DesktopProductGrid`

Movil:

- `app/productos/components/mobile/MobileProductGrid.tsx`
- Usa `grid ... md:hidden`.
- Renderiza `MobileProductCard`.

Tarjeta movil:

- `app/productos/components/mobile/MobileProductCard.tsx`
- Esta pensada para tactil: imagen con aspecto fijo, badge, favorito, precio, disponibilidad y boton ancho de agregar.

Escritorio:

- `app/productos/components/desktop/DesktopProductGrid.tsx`
- Usa `hidden ... md:grid`.
- Cambia columnas con `md:grid-cols-2`, `xl:grid-cols-4` y `2xl:grid-cols-5`.
- Renderiza `ProductCard`, que es la tarjeta tradicional de escritorio.

### Footer

En la pagina principal de productos:

- `ProductsPageContent` envuelve `Footer` con `hidden md:block`.
- Eso significa que el footer se oculta en movil.

En paginas como detalle de producto y carrito:

- `Footer` se renderiza directamente al final.
- El footer en si usa clases responsive como `md:grid-cols-2` y `lg:grid-cols-5`.

## Paginas y layouts responsive importantes

### Home y productos

Archivos:

- `app/page.tsx`
- `app/productos/page.tsx`
- `app/productos/ProductsPageContent.tsx`

La home (`/`) renderiza el contenido de productos. La estructura principal esta en `ProductsPageContent`.

Clases importantes en `ProductsPageContent`:

- `overflow-x-hidden`, para evitar scroll horizontal accidental.
- `px-4 pb-28 pt-3 md:px-4 md:py-5`, que cambia espaciado entre movil y pantallas medianas.
- `xl:grid-cols-[270px_minmax(0,1fr)_300px]`, que activa tres columnas en escritorio amplio.
- `hidden xl:block`, para filtros laterales y preview de carrito.
- `md:hidden`, para el boton movil "Filtrar productos".
- `hidden md:block`, para mostrar el footer solo desde `md`.

### Hero de productos

Dentro de `ProductsPageContent`, `StoreHero` adapta texto e imagen:

- `md:rounded-xl`, cambia radio desde `md`.
- `md:px-6 md:py-5`, aumenta espaciado desde `md`.
- `lg:grid-cols-[1fr_340px]`, separa contenido e imagen desde `lg`.
- `sm:text-3xl md:text-3xl xl:text-4xl`, escala el titulo por breakpoint.
- `hidden ... md:flex`, oculta la imagen placeholder en movil y la muestra desde `md`.

### Barra de beneficios

Tambien dentro de `ProductsPageContent`, `BenefitsBar` cambia columnas con:

- `grid`, una columna base.
- `md:grid-cols-2`, dos columnas desde `md`.
- `xl:grid-cols-4`, cuatro columnas desde `xl`.
- `xl:border-r xl:last:border-r-0`, separadores solo en escritorio amplio.

### Detalle de producto

Archivos:

- `app/productos/[slug]/page.tsx`
- `app/productos/[slug]/components/ProductGallery.tsx`
- `app/productos/[slug]/components/ProductInfo.tsx`

Clases importantes:

- `lg:grid-cols-[0.95fr_1.05fr]`, pone galeria e informacion en columnas desde `lg`.
- `grid grid-cols-4`, miniaturas en cuatro columnas.
- `sm:grid-cols-2`, datos del producto en dos columnas desde `sm`.
- `sm:flex-row`, botones en fila desde `sm`; en movil quedan en columna con `flex-col`.

### Carrito

Archivo:

- `app/carrito/page.tsx`

Clases importantes:

- `flex flex-col ... sm:flex-row`, cambia el encabezado del carrito de columna a fila desde `sm`.
- `lg:grid-cols-[1fr_340px]`, separa items y resumen desde `lg`.

## Clases responsive de Tailwind usadas

Estas son las clases responsive mas relevantes encontradas:

- `sm:flex-row`
- `sm:items-end`
- `sm:justify-between`
- `sm:block`
- `sm:flex`
- `sm:grid-cols-2`
- `sm:grid-cols-4`
- `sm:text-3xl`
- `md:hidden`
- `md:block`
- `md:flex`
- `md:grid`
- `md:px-4`
- `md:px-6`
- `md:py-5`
- `md:p-4`
- `md:pb-0`
- `md:rounded-xl`
- `md:text-lg`
- `md:text-xs`
- `md:grid-cols-2`
- `lg:flex`
- `lg:block`
- `lg:hidden`
- `lg:grid-cols-[270px_180px_1fr_150px_170px_60px]`
- `lg:grid-cols-[1fr_340px]`
- `lg:grid-cols-[0.95fr_1.05fr]`
- `lg:h-40`
- `lg:items-center`
- `xl:block`
- `xl:grid-cols-[270px_minmax(0,1fr)_300px]`
- `xl:grid-cols-4`
- `xl:grid-cols-8`
- `xl:text-4xl`
- `xl:border-r`
- `xl:last:border-r-0`
- `2xl:grid-cols-5`

Tambien se usan clases base que ayudan mucho al responsive aunque no tengan prefijo:

- `hidden`
- `block`
- `flex`
- `grid`
- `flex-col`
- `flex-wrap`
- `min-w-0`
- `max-w-full`
- `w-full`
- `overflow-hidden`
- `overflow-x-hidden`
- `overflow-x-auto`
- `aspect-square`
- `aspect-[4/3]`
- `truncate`
- `break-words`
- `line-clamp-2`

## Deteccion con JavaScript

No se encontro deteccion responsive con:

- `window.innerWidth`
- `matchMedia`
- `userAgent`
- `navigator.userAgent`
- `useIsMobile`

La unica logica relacionada con movil es el contexto:

- `components/layout/mobile/MobileFilterContext.tsx`

Pero ese contexto no detecta si el dispositivo es movil. Solo guarda el estado del drawer de filtros.

Tambien existe `useSyncExternalStore` en:

- `components/layout/mobile/MobileHeader.tsx`

Ese uso no es para detectar movil. Se usa para saber si el componente ya monto en cliente y evitar problemas de hidratacion con el cambio de tema.

## Archivos importantes para que funcione movil

Archivos globales:

- `app/layout.tsx`
- `app/globals.css`
- `app/providers.tsx`
- `providers/ThemeProvider.tsx`

Chrome movil:

- `components/layout/mobile/MobileAppChrome.tsx`
- `components/layout/mobile/MobileHeader.tsx`
- `components/layout/mobile/MobileBottomNav.tsx`
- `components/layout/mobile/MobileFilterContext.tsx`

Productos y home:

- `app/page.tsx`
- `app/productos/page.tsx`
- `app/productos/ProductsPageContent.tsx`
- `app/productos/components/ProductGrid.tsx`
- `app/productos/components/CategoryStrip.tsx`
- `app/productos/components/ProductFilters.tsx`

Variantes moviles:

- `app/productos/components/mobile/MobileProductGrid.tsx`
- `app/productos/components/mobile/MobileProductCard.tsx`
- `app/productos/components/mobile/MobileCategoryCarousel.tsx`
- `app/productos/components/mobile/MobileFilterDrawer.tsx`

Variantes de escritorio que conviven con movil:

- `components/layout/Header.tsx`
- `components/layout/Navbar.tsx`
- `app/productos/components/desktop/DesktopProductGrid.tsx`
- `app/productos/components/desktop/DesktopCategoryGrid.tsx`
- `app/productos/components/ProductCard.tsx`
- `app/productos/components/CartPreview.tsx`

Otras paginas responsive:

- `app/productos/[slug]/page.tsx`
- `app/productos/[slug]/components/ProductGallery.tsx`
- `app/productos/[slug]/components/ProductInfo.tsx`
- `app/carrito/page.tsx`
- `app/carrito/components/CartItem.tsx`
- `app/carrito/components/CartSummary.tsx`

## Dependencias de index.html, viewport, Tailwind, CSS global y .env

### index.html

No hay un `index.html` editable como en Vite.

Este proyecto usa Next.js App Router. La estructura HTML global se define en `app/layout.tsx`, donde aparecen las etiquetas `<html>` y `<body>`.

### Meta viewport

El proyecto ahora tiene una configuracion manual y explicita de `viewport` en:

- `app/layout.tsx`

La configuracion es:

```tsx
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
```

Esto evita depender solo del valor por defecto de Next.js y deja claro que la app debe renderizarse usando el ancho del dispositivo. En celulares, esto ayuda a que las clases responsive de Tailwind se comporten como se espera.

### Tailwind config

No se encontro archivo `tailwind.config.*`.

El proyecto usa Tailwind CSS v4 con:

- `app/globals.css`
- `postcss.config.mjs`
- paquete `tailwindcss`
- paquete `@tailwindcss/postcss`

Al no existir config custom, los breakpoints usados (`sm`, `md`, `lg`, `xl`, `2xl`) dependen de los valores por defecto de Tailwind.

### CSS global

El archivo importante es:

- `app/globals.css`

Contiene:

- `@import "tailwindcss";`
- `@custom-variant dark (&:where(.dark, .dark *));`
- variables `--background` y `--foreground`
- definicion de fuente en `@theme inline`
- `box-sizing: border-box`
- estilos base de `body` y `a`

El responsive no se define con media queries manuales en este archivo. Depende de las utilidades de Tailwind usadas en los componentes.

### Variables .env

No se encontraron archivos `.env*` en el proyecto.

La version movil no depende de variables de entorno.

### Configuracion de Next para red local y produccion

Archivo:

- `next.config.ts`

Actualmente no hay una IP fija unica en `allowedDevOrigins`. En su lugar, el proyecto permite rangos comunes de red local para desarrollo:

```ts
const localNetworkDevOrigins = [
  "192.168.*.*",
  "10.*.*.*",
  "172.*.*.*",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: localNetworkDevOrigins,
  // ...
};
```

Esto es necesario en Next.js 16 porque el servidor de desarrollo bloquea por seguridad algunos recursos internos de `/_next` cuando vienen desde otro origen. Si se abre la app desde un celular usando la IP de la PC, el HTML y el CSS pueden verse, pero si los scripts de Next quedan bloqueados, React no hidrata la pagina y los botones con `onClick` no responden.

Antes el proyecto tenia una configuracion amarrada a una sola maquina:

```ts
allowedDevOrigins: ["192.168.18.9"]
```

Eso podia causar problemas al copiar el repositorio en otra PC, porque la nueva maquina normalmente tiene otra IP local. Con rangos como `192.168.*.*`, `10.*.*.*` y `172.*.*.*`, el desarrollo desde celulares en redes privadas queda cubierto sin editar el proyecto cada vez.

La version movil no debe activarse por IP ni por nombre de dispositivo. Debe activarse por el ancho del viewport usando Tailwind. Por eso, para desarrollo en otra PC o para produccion, lo importante es:

- Que el servidor Next este accesible desde la red o dominio correspondiente.
- Que el navegador movil reciba el viewport correcto.
- Que las clases responsive sigan usando `md:hidden`, `hidden md:block`, `hidden md:grid`, etc.

Si desde un celular no carga en otra PC, normalmente el problema no esta en la UI movil, sino en acceso de red: IP incorrecta, firewall, puerto cerrado, celular y PC en redes distintas o servidor levantado solo para `localhost`.

## Como leer el responsive de este proyecto

Para entender si algo es movil o escritorio, conviene revisar las clases del componente:

- Si ves `md:hidden`, probablemente es una pieza movil.
- Si ves `hidden md:block`, `hidden md:grid` o `hidden xl:block`, probablemente es una pieza de escritorio o tablet/escritorio.
- Si ves `lg:grid-cols-*` o `xl:grid-cols-*`, el componente existe tambien en movil, pero cambia su distribucion al crecer la pantalla.
- Si ves `overflow-x-hidden`, `max-w-full`, `min-w-0`, `truncate` o `break-words`, son protecciones para evitar desbordes en pantallas chicas.

El responsive actual esta basado en CSS/Tailwind, no en deteccion de dispositivo. Eso hace que al cambiar el ancho del navegador las variantes aparezcan o desaparezcan por breakpoint.
