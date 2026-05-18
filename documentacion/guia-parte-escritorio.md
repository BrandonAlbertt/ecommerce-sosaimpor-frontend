# Guía técnica de la parte de PC / navegador

Esta guía explica cómo está organizada la experiencia de escritorio en este proyecto de Next.js con TypeScript.

Está escrita para alguien que viene de React con Vite y piensa en términos de `index.html`, `App.jsx` y componentes sueltos. Aquí el modelo cambia: la app se compone por rutas y layouts.

## Idea principal

En esta base de código, la vista de navegador no vive en un proyecto separado. Comparte la misma app con móvil, pero usa otras variantes visuales y otros breakpoints.

La lógica mental correcta es esta:

- `app/layout.tsx` define la estructura global.
- `app/page.tsx` define la home.
- `app/productos/ProductsPageContent.tsx` arma el contenido principal de la tienda.
- Los componentes de escritorio se activan con clases como `md:block`, `lg:flex` o `xl:grid`.

## Dónde arranca la pantalla de escritorio

La home sigue entrando por [app/page.tsx](app/page.tsx).

Ese archivo renderiza [app/productos/ProductsPageContent.tsx](app/productos/ProductsPageContent.tsx), así que la vista principal de PC no tiene una página distinta. Tiene el mismo entry point que móvil, pero el layout y los componentes cambian según el tamaño de pantalla.

El envoltorio global está en [app/layout.tsx](app/layout.tsx).

Ahí se montan elementos que afectan toda la app:

- `Providers`.
- `MobileFilterProvider`.
- `MobileAppChrome`.

En escritorio, parte de ese chrome móvil queda oculto por breakpoints, mientras que los componentes de escritorio sí se muestran.

## Home de escritorio

La pantalla de PC está compuesta principalmente por [app/productos/ProductsPageContent.tsx](app/productos/ProductsPageContent.tsx).

Ese componente estructura la home con estas partes:

- `Header` para escritorio.
- `StoreHero` como bloque de presentación.
- `CategoryStrip` con categorías destacadas.
- `ProductGrid` con el catálogo visible.
- `CartPreview` como columna lateral.
- `BenefitsBar` al final.
- `Footer` para el cierre de la página.

## Componentes clave de escritorio

### 1. Header de escritorio

Archivo: [components/layout/Header.tsx](components/layout/Header.tsx)

Este es el header visible en PC.

Funciones principales:

- Mostrar la franja superior con horario, ayuda y mensaje comercial.
- Mostrar el logo.
- Dar acceso a categorías.
- Permitir buscar repuestos.
- Mostrar cuenta, carrito y toggle de tema.

Detalles importantes:

- Usa `hidden md:block`, así que no aparece en móvil.
- Incluye un bloque superior informativo y una fila principal de controles.
- El botón de carrito aparece distinto en desktop y móvil.

### 2. Navegación de categorías

Archivo: [components/layout/Navbar.tsx](components/layout/Navbar.tsx)

Este componente contiene enlaces de navegación para escritorio.

En la práctica:

- Se muestra solo en pantallas grandes porque usa `lg:flex`.
- Sirve como navegación horizontal de categorías o secciones.
- Es una pieza más limpia y estática que la barra inferior móvil.

### 3. Filtros de productos

Archivo: [app/productos/components/ProductFilters.tsx](app/productos/components/ProductFilters.tsx)

Este componente es clave porque también lo reutiliza el drawer móvil.

En escritorio funciona como panel lateral:

- Categoría.
- Marca.
- Modelo.
- Combustible.
- Transmisión.
- Año.
- Condición.
- Rango de precio.
- Disponibilidad.

Punto importante:

- La versión de escritorio es el modo normal del componente.
- La versión móvil usa `variant="mobile"` para quitar bordes, sombra y padding extra.

### 4. Grilla de productos de escritorio

Archivo: [app/productos/components/desktop/DesktopProductGrid.tsx](app/productos/components/desktop/DesktopProductGrid.tsx)

Función:

- Renderiza la grilla principal de productos para PC.
- Reutiliza `ProductCard`.
- Ajusta el número de columnas según el breakpoint.

La idea es que el catálogo en escritorio sea más denso y visualmente más amplio que en móvil.

### 5. Grilla de categorías de escritorio

Archivo: [app/productos/components/desktop/DesktopCategoryGrid.tsx](app/productos/components/desktop/DesktopCategoryGrid.tsx)

Función:

- Muestra categorías como tarjetas en una grilla más amplia.
- Es la variante de escritorio del bloque de categorías destacadas.

### 6. Vista previa del carrito

Archivo: [app/productos/components/CartPreview.tsx](app/productos/components/CartPreview.tsx)

Función:

- Ocupa la columna derecha en pantallas grandes.
- Muestra un resumen visual del carrito o estado de compra.

Esta pieza no es el carrito completo, sino un panel de contexto para la navegación dentro de la tienda.

### 7. Footer

Archivo: [components/layout/Footer.tsx](components/layout/Footer.tsx)

Función:

- Cerrar la página con información de contacto, horario, pagos y recojo.

En escritorio el footer sí aparece, mientras que en móvil la experiencia se apoya más en la barra inferior y en el flujo compacto de la pantalla.

## Cómo se organiza la home en PC

La composición de [app/productos/ProductsPageContent.tsx](app/productos/ProductsPageContent.tsx) se entiende mejor como un layout de tres columnas en pantallas grandes:

- Columna izquierda: filtros.
- Columna central: hero, categorías y productos.
- Columna derecha: carrito de vista previa.

La lógica de la grilla principal está aquí:

- `xl:grid-cols-[270px_minmax(0,1fr)_300px]`

Eso significa que en pantallas anchas la página se comporta como una tienda clásica de escritorio, con navegación lateral y contenido central amplio.

## Qué cambia con respecto a móvil

La parte de PC no es otra app. Es la misma app con otro comportamiento visual.

La diferencia importante está en los breakpoints:

- `md:hidden` oculta elementos en escritorio o móvil según el caso.
- `hidden md:block` muestra bloques solo a partir de `md`.
- `xl:block` o `xl:grid` activa la estructura más completa del escritorio.

Por eso, al desarrollar la parte de navegador, normalmente no debes crear rutas nuevas. Debes encontrar qué componente ya existe y qué variante de breakpoint está usando.

## Cómo pensar la estructura si vienes de Vite

En Vite seguramente piensas así:

- `index.html` entra primero.
- `App.jsx` contiene toda la composición.
- El router y los componentes cuelgan desde ahí.

En este proyecto debes pensar así:

- `app/layout.tsx` es el envoltorio global.
- `app/page.tsx` es la home.
- `app/productos/ProductsPageContent.tsx` es el compositor principal de la tienda.
- `components/layout/` contiene piezas de estructura general.
- `app/productos/components/desktop/` contiene la UI pensada para escritorio.

## Qué tocar si solo trabajas en PC

Si tu trabajo es solo la vista de navegador, normalmente tocarás estas zonas:

- [components/layout/Header.tsx](components/layout/Header.tsx)
- [components/layout/Navbar.tsx](components/layout/Navbar.tsx)
- [app/productos/components/ProductFilters.tsx](app/productos/components/ProductFilters.tsx)
- [app/productos/components/desktop/DesktopProductGrid.tsx](app/productos/components/desktop/DesktopProductGrid.tsx)
- [app/productos/components/desktop/DesktopCategoryGrid.tsx](app/productos/components/desktop/DesktopCategoryGrid.tsx)
- [app/productos/ProductsPageContent.tsx](app/productos/ProductsPageContent.tsx)
- [components/layout/Footer.tsx](components/layout/Footer.tsx)

Si quieres ajustar el comportamiento visual de toda la tienda, casi siempre el cambio real está en `ProductsPageContent` o en el componente de layout correspondiente.

## Ruta rápida de lectura

Si quieres ubicarte rápido, sigue este orden:

1. Abre [app/page.tsx](app/page.tsx).
2. Sigue hacia [app/productos/ProductsPageContent.tsx](app/productos/ProductsPageContent.tsx).
3. Revisa [components/layout/Header.tsx](components/layout/Header.tsx) para el encabezado de PC.
4. Revisa [app/productos/components/ProductFilters.tsx](app/productos/components/ProductFilters.tsx) para los filtros.
5. Revisa [app/productos/components/desktop/DesktopProductGrid.tsx](app/productos/components/desktop/DesktopProductGrid.tsx) para el catálogo.
6. Revisa [components/layout/Footer.tsx](components/layout/Footer.tsx) para el cierre de página.

Con esa ruta ya entiendes casi toda la experiencia de escritorio de la tienda.
