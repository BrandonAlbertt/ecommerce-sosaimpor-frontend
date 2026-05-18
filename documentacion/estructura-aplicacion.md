# Estructura de la aplicacion SOSA IMPORT

## Resumen tecnico

La aplicacion es un frontend ecommerce construido con Next.js App Router, React, TypeScript y Tailwind CSS. La interfaz principal muestra un catalogo de repuestos usados importados, con dos experiencias visuales:

- Escritorio: usa header completo, filtros laterales, grilla amplia de productos, preview de carrito y footer.
- Movil: usa header compacto, buscador, drawer de filtros, carrusel de categorias, cards tactiles y barra inferior fija.

La pagina principal real es `/`, definida en `app/page.tsx`. Esta ruta no renderiza contenido propio: reutiliza `ProductsPageContent`, el mismo componente usado por `/productos`.

```txt
app/page.tsx
+-- ProductsPageContent
    +-- Header                       escritorio
    +-- MobileAppChrome              movil global desde layout
    +-- ProductFilters               escritorio lateral / movil en drawer
    +-- StoreHero                    bloque principal del catalogo
    +-- CategoryStrip                categorias destacadas
    +-- ProductGrid                  listado de productos
    +-- CartPreview                  preview lateral escritorio
    +-- BenefitsBar                  beneficios de compra
    +-- Footer                       escritorio/tablet
```

## Pagina principal

### Ruta `/`

Archivo: `app/page.tsx`

Componente principal:

- `Home`: retorna `<ProductsPageContent />`.

Finalidad:

- Convertir la raiz del sitio en la pantalla de catalogo.
- Evitar duplicar logica entre `/` y `/productos`.

### Ruta `/productos`

Archivo: `app/productos/page.tsx`

Componente principal:

- `ProductsPage`: retorna `<ProductsPageContent />`.

Finalidad:

- Mantener una URL explicita para el catalogo.
- Compartir exactamente la misma composicion visual que la pagina de inicio.

## Layout global

### `app/layout.tsx`

Contiene:

- Metadata del sitio.
- Configuracion de viewport.
- `Providers`.
- `MobileFilterProvider`.
- `MobileAppChrome`.
- Render de `children`.

Finalidad:

- Envolver toda la aplicacion con proveedores globales.
- Montar el chrome movil de forma global: header movil, drawer de filtros y bottom nav.
- Aplicar estilos base del body, tema claro/oscuro y padding inferior movil.

### `app/providers.tsx`

Contiene:

- `Providers`.
- `ThemeProvider`.

Finalidad:

- Centralizar proveedores globales de React.
- Actualmente solo registra el provider de tema.

### `app/globals.css`

Finalidad:

- Define estilos globales de Tailwind y reglas base de la aplicacion.

## Experiencia escritorio

La version escritorio se activa desde breakpoint `md` o superior en varios componentes, y desde `xl` para columnas laterales.

Componentes principales:

- `Header`: cabecera sticky visible desde `md`.
- `ProductFilters`: filtros laterales visibles en `xl`.
- `StoreHero`: hero del catalogo con mensaje comercial y placeholder de imagen.
- `CategoryStrip` + `DesktopCategoryGrid`: categorias en grilla.
- `ProductGrid` + `DesktopProductGrid`: productos en grilla responsive.
- `ProductCard`: card de producto para escritorio.
- `CartPreview`: resumen lateral del carrito visible en `xl`.
- `BenefitsBar`: beneficios debajo del catalogo.
- `Footer`: pie de pagina visible desde `md`.

Flujo visual:

```txt
Header
+-- main
    +-- ProductFilters
    +-- contenido central
    |   +-- StoreHero
    |   +-- CategoryStrip
    |   +-- ProductGrid
    +-- CartPreview
    +-- BenefitsBar
Footer
```

## Experiencia movil

La version movil se controla con clases `md:hidden` y componentes especificos dentro de `components/layout/mobile` y `app/productos/components/mobile`.

Componentes principales:

- `MobileAppChrome`: monta los elementos moviles globales.
- `MobileHeader`: header compacto con logo, filtro, tema, carrito y buscador.
- `MobileFilterDrawer`: panel inferior para filtros.
- `MobileBottomNav`: navegacion fija inferior.
- `MobileCategoryCarousel`: categorias en carrusel horizontal.
- `MobileProductGrid`: grilla movil de productos.
- `MobileProductCard`: card tactil compacta.

Flujo visual:

```txt
MobileHeader
+-- main
    +-- StoreHero
    +-- CategoryStrip
    |   +-- MobileCategoryCarousel
    +-- boton Filtrar productos
    +-- ProductGrid
        +-- MobileProductGrid
            +-- MobileProductCard
MobileFilterDrawer
MobileBottomNav
```

## Carpeta `app`

Carpeta principal del App Router de Next.js. Define rutas, layouts y paginas.

### `app/page.tsx`

Contiene:

- `Home`.
- Importa `ProductsPageContent`.

Finalidad:

- Pagina principal `/`.
- Reutiliza el catalogo como pantalla inicial.

### `app/productos/page.tsx`

Contiene:

- `ProductsPage`.
- Importa `ProductsPageContent`.

Finalidad:

- Pagina del catalogo en `/productos`.

### `app/productos/ProductsPageContent.tsx`

Contiene:

- `ProductsPageContent`.
- `StoreHero`.
- `BenefitsBar`.

Usa:

- `Header`.
- `Footer`.
- `useMobileFilter`.
- `ProductFilters`.
- `CategoryStrip`.
- `ProductGrid`.
- `CartPreview`.

Finalidad:

- Es la composicion central del ecommerce.
- Decide que se muestra en escritorio y que se muestra en movil mediante breakpoints.
- Coordina filtros, categorias, productos, carrito lateral y bloques comerciales.

### `app/productos/components`

Componentes propios del catalogo.

#### `ProductGrid.tsx`

Contiene:

- `mockProducts`.
- `ProductGrid`.

Usa:

- `MobileProductGrid`.
- `DesktopProductGrid`.

Finalidad:

- Centraliza los datos mock de productos.
- Renderiza el encabezado del listado, el ordenamiento y las dos variantes de grilla.

#### `ProductFilters.tsx`

Contiene:

- `ProductFilters`.

Usa:

- `Button`.
- `Input`.
- `cn`.

Finalidad:

- Renderizar filtros por categoria, marca, modelo, combustible, transmision, año, condicion, precio y disponibilidad.
- Puede usarse como lateral de escritorio o dentro del drawer movil.

#### `CategoryStrip.tsx`

Contiene:

- `CategoryItem`.
- Lista local `categories`.
- `CategoryStrip`.

Usa:

- `MobileCategoryCarousel`.
- `DesktopCategoryGrid`.

Finalidad:

- Mostrar categorias destacadas.
- Compartir los mismos datos entre la vista movil y escritorio.

#### `CartPreview.tsx`

Contiene:

- Lista local `cartItems`.
- `CartPreview`.

Usa:

- `Button`.
- `Link`.

Finalidad:

- Mostrar un resumen lateral del carrito en escritorio.
- Presenta subtotal, descuento, total y acceso al carrito completo.

#### `ProductCard.tsx`

Contiene:

- `ProductCard`.
- Mapa `badgeColors`.

Usa:

- `Button`.
- `Product`.
- `Link`.

Finalidad:

- Card de producto para escritorio.
- Muestra categoria, favorito, imagen placeholder, nombre, descripcion, año, precio, disponibilidad y accion de carrito.

### `app/productos/components/desktop`

Componentes especificos para escritorio.

#### `DesktopProductGrid.tsx`

Contiene:

- `DesktopProductGrid`.

Usa:

- `ProductCard`.

Finalidad:

- Renderizar productos en grilla desde `md`.
- Ajusta columnas segun breakpoint.

#### `DesktopCategoryGrid.tsx`

Contiene:

- `DesktopCategoryGrid`.

Usa:

- `CategoryItem`.

Finalidad:

- Renderizar categorias destacadas en grilla para escritorio/tablet.
- Usa botones con borde superior de color por categoria.

### `app/productos/components/mobile`

Componentes especificos para movil.

#### `MobileProductGrid.tsx`

Contiene:

- `MobileProductGrid`.

Usa:

- `MobileProductCard`.

Finalidad:

- Renderizar productos en una columna para pantallas pequeñas.

#### `MobileProductCard.tsx`

Contiene:

- `MobileProductCard`.
- Mapa `badgeColors`.

Usa:

- `Heart`.
- `ShoppingCart`.
- `Product`.
- `Link`.

Finalidad:

- Card compacta para uso tactil.
- Prioriza imagen, precio, disponibilidad y boton de agregar.

#### `MobileFilterDrawer.tsx`

Contiene:

- `MobileFilterDrawer`.

Usa:

- `X`.
- `ProductFilters`.

Finalidad:

- Mostrar filtros dentro de un drawer inferior.
- Se abre y cierra mediante estado global movil.

#### `MobileCategoryCarousel.tsx`

Contiene:

- `MobileCategoryCarousel`.

Usa:

- `CategoryItem`.

Finalidad:

- Mostrar categorias en carrusel horizontal con scroll tactil.

### `app/productos/[slug]`

Ruta dinamica de detalle de producto.

#### `page.tsx`

Contiene:

- `ProductDetailPage`.

Usa:

- `Header`.
- `Footer`.
- `ProductGallery`.
- `ProductInfo`.
- `ProductGrid`.

Finalidad:

- Mostrar detalle de un producto.
- Incluye galeria, informacion comercial y productos relacionados.

#### `components/ProductGallery.tsx`

Contiene:

- `ProductGallery`.

Finalidad:

- Mostrar imagen principal placeholder y miniaturas.

#### `components/ProductInfo.tsx`

Contiene:

- `ProductInfo`.

Usa:

- `Badge`.
- `Button`.

Finalidad:

- Mostrar categoria, nombre, descripcion, atributos, precio y acciones de compra/consulta.

### `app/carrito`

Ruta del carrito completo.

#### `page.tsx`

Contiene:

- `CartPage`.
- Lista local `cartItems`.

Usa:

- `Header`.
- `Footer`.
- `Button`.
- `CartItem`.
- `CartSummary`.

Finalidad:

- Mostrar los productos agregados y el resumen de compra.

#### `components/CartItem.tsx`

Contiene:

- `CartItem`.

Finalidad:

- Renderizar cada producto del carrito.
- Incluye imagen placeholder, categoria, descripcion, cantidad y precio.

#### `components/CartSummary.tsx`

Contiene:

- `CartSummary`.

Usa:

- `Button`.

Finalidad:

- Mostrar subtotal, descuento, total y accion de finalizar pedido.

## Carpeta `components`

Agrupa componentes compartidos entre rutas.

### `components/layout`

Componentes estructurales generales.

#### `Header.tsx`

Contiene:

- `Header`.

Usa:

- `Button`.
- `Input`.
- `ThemeToggle`.
- `Link`.

Finalidad:

- Header de escritorio.
- Incluye barra superior informativa, logo, categorias, buscador, cuenta, carrito y cambio de tema.

#### `Footer.tsx`

Contiene:

- `Footer`.

Finalidad:

- Pie de pagina con informacion de marca, contacto, horario, recojo y medios de pago.

#### `Navbar.tsx`

Contiene:

- `Navbar`.
- Lista `links`.

Finalidad:

- Navegacion por categorias.
- Actualmente no esta integrada en `Header`, pero queda disponible como componente compartido.

### `components/layout/mobile`

Componentes globales para la experiencia movil.

#### `MobileAppChrome.tsx`

Contiene:

- `MobileAppChrome`.

Usa:

- `MobileHeader`.
- `MobileFilterDrawer`.
- `MobileBottomNav`.
- `useMobileFilter`.

Finalidad:

- Montar header movil, drawer de filtros y barra inferior en todas las paginas.

#### `MobileHeader.tsx`

Contiene:

- `MobileHeader`.

Usa:

- `Input`.
- `useTheme`.
- `useMobileFilter`.
- Iconos de `lucide-react`.

Finalidad:

- Header movil con marca, acceso a filtros, cambio de tema, carrito y busqueda.

#### `MobileBottomNav.tsx`

Contiene:

- `MobileBottomNav`.
- Lista `items`.

Usa:

- Iconos de `lucide-react`.
- `Link`.

Finalidad:

- Navegacion inferior fija tipo app.
- Da acceso a inicio, categorias, busqueda, carrito y admin.

#### `MobileFilterContext.tsx`

Contiene:

- `MobileFilterProvider`.
- `useMobileFilter`.
- Contexto `MobileFilterContext`.

Finalidad:

- Controlar si el drawer de filtros esta abierto o cerrado.
- Exponer `openFilters` y `closeFilters` a cualquier componente movil.

### `components/ui`

Componentes base reutilizables.

#### `Button.tsx`

Contiene:

- `Button`.

Usa:

- `cn`.

Finalidad:

- Boton base con variantes `primary`, `secondary` y `ghost`.
- Centraliza estilos de foco, tamaño, color y tema oscuro.

#### `Input.tsx`

Contiene:

- `Input`.

Usa:

- `cn`.

Finalidad:

- Input base reutilizable.
- Centraliza estilos de borde, foco, placeholder y tema oscuro.

#### `Badge.tsx`

Contiene:

- `Badge`.

Usa:

- `cn`.

Finalidad:

- Etiqueta visual para estados o categorias.
- Soporta tonos `red`, `green` y `zinc`.

#### `ThemeToggle.tsx`

Contiene:

- `ThemeToggle`.

Usa:

- `useTheme`.
- `useSyncExternalStore`.
- `Button`.
- Iconos `Sun` y `Moon`.

Finalidad:

- Alternar tema claro/oscuro en escritorio.
- Evita problemas de hidratacion esperando montaje del cliente.

## Carpeta `features`

Agrupa logica por dominio. Todavia esta preparada para crecer, pero parte de su contenido es placeholder.

### `features/products`

Dominio de productos.

#### `types/product.types.ts`

Contiene:

- `ProductCondition`.
- `Product`.

Finalidad:

- Definir la forma tecnica de un producto.
- Tipar cards, grillas y futuras respuestas de API.

#### `api/productsApi.ts`

Contiene:

- `getProducts`.

Finalidad:

- Frontera futura para integrar backend de productos.
- Actualmente retorna un arreglo vacio.

### `features/cart`

Dominio del carrito.

#### `types/cart.types.ts`

Contiene:

- `CartItem`.

Finalidad:

- Definir la estructura de un item del carrito.

#### `store/cartStore.ts`

Contiene:

- `cartStorePlaceholder`.

Finalidad:

- Placeholder para una store futura con Zustand, Context o Redux.

## Carpeta `providers`

Proveedores globales independientes de `app`.

### `ThemeProvider.tsx`

Contiene:

- `ThemeProvider`.

Usa:

- `next-themes`.

Finalidad:

- Configurar tema por clase CSS en el elemento HTML.
- Define tema claro por defecto y desactiva transiciones durante el cambio.

## Carpeta `lib`

Utilidades y configuraciones tecnicas compartidas.

### `utils.ts`

Contiene:

- `cn`.

Finalidad:

- Unir clases CSS condicionales.
- Evita concatenaciones manuales repetidas en componentes.

### `axiosClient.ts`

Contiene:

- `axiosClient`.

Finalidad:

- Placeholder de cliente HTTP.
- Lee `NEXT_PUBLIC_API_URL` para futura conexion con backend.

## Carpeta `public`

Contiene assets estaticos servidos por Next.js.

Archivos actuales:

- `file.svg`
- `globe.svg`
- `next.svg`
- `vercel.svg`
- `window.svg`

Finalidad:

- Guardar imagenes, iconos o archivos estaticos accesibles desde la raiz publica.
- Actualmente conserva assets base del scaffold.

## Carpeta `documentacion`

Contiene guias tecnicas del proyecto.

Archivos actuales:

- `guia-parte-escritorio.md`: guia de la vista escritorio.
- `guia-parte-movil.md`: guia de la vista movil.
- `GUIA_TEMA_Y_BOTONES_MOVIL.md`: guia de tema y botones moviles.
- `RESPONSIVE_MOVIL.md`: guia responsive movil.
- `estructura-aplicacion.md`: este documento.

Finalidad:

- Documentar decisiones de estructura, responsive, tema y componentes.

## Dependencias principales

- `next`: framework de rutas, layout y renderizado.
- `react` y `react-dom`: base de componentes.
- `tailwindcss`: estilos utilitarios.
- `next-themes`: cambio de tema claro/oscuro.
- `lucide-react`: iconos usados en botones y navegacion.

## Observaciones de arquitectura

- La pantalla principal esta concentrada en `ProductsPageContent`.
- Los datos de productos y carrito todavia son mock locales.
- Las carpetas `features/products/api`, `features/cart/store` y `lib/axiosClient.ts` estan preparadas para backend, pero aun no ejecutan logica real.
- El layout movil es global, por eso `MobileHeader` y `MobileBottomNav` aparecen en todas las rutas.
- La separacion `desktop` y `mobile` existe principalmente dentro de componentes de productos y categorias.
