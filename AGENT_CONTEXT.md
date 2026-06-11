# Contexto rapido del proyecto

Proyecto: frontend ecommerce de SOSA IMPORT con Next.js App Router.

Este archivo existe para que cualquier IA entienda el proyecto sin leer todo el
repositorio antes de cambios pequenos. Si el cambio toca una zona concreta, lee
tambien los archivos cercanos antes de editar.

## Reglas principales de arquitectura

- Mantener el flujo claro: padre/container -> hijos por props y callbacks.
- La logica principal vive en containers/padres, especialmente desde Home.
- No agregar Context API, providers extra, Redux, Zustand ni estados globales
  ocultos. Solo se mantiene el provider actual del tema dark/light.
- No crear nuevas capas globales para resolver casos locales.
- Hooks para datos o efectos concretos; componentes hijos simples y faciles de
  debuggear.
- No modificar codigo que ya funciona si no es necesario para la tarea.
- Comentarios cortos, claros y utiles, como los existentes en hooks/API.
- Validar con `pnpm lint` despues de cambios de codigo.

## Next.js

- Este proyecto usa una version de Next con cambios importantes.
- Antes de escribir codigo de Next, leer la guia relevante en
  `node_modules/next/dist/docs/`.
- Las paginas viven en `app/`.
- Los componentes con hooks, eventos, `window` o `localStorage` deben ser client
  components con `"use client"`.

## Estructura principal

- `app/page.tsx`: Home. Renderiza `ProductPageContainer`.
- `app/productos/page.tsx`: pagina de productos/catalogo.
- `app/productos/[slug]/page.tsx`: detalle de producto. Renderiza
  `ProductDetailContainer`.
- `components/compartidos/productos/ProductPageContainer.tsx`: padre principal
  del Home/catalogo. Aqui se centralizan filtros, busqueda, categorias, productos
  y acciones principales.
- `components/compartidos/product-detail/ProductDetailContainer.tsx`: padre del
  detalle de producto.
- `components/compartidos/*`: componentes compartidos entre movil/escritorio.
- `components/movil/*`: UI especifica movil.
- `components/escritorio/*`: UI especifica escritorio.
- `features/*/api`: funciones que llaman al backend usando `axiosClient`.
- `features/*/hooks`: hooks de carga, filtros, busqueda y metricas.
- `features/*/types`: tipos de datos de API/UI.
- `features/*/utils`: adaptadores y utilidades.
- `lib/axiosClient.ts`: cliente HTTP compartido basado en `fetch`.
- `providers/ThemeProvider.tsx`: unico provider permitido para tema.

## Flujo del Home/catalogo

1. `app/page.tsx` monta `ProductPageContainer`.
2. `ProductPageContainer` carga:
   - configuracion Home con `useHome`.
   - categorias destacadas con `useFeaturedCategories`.
   - opciones de filtros con `useProductFilterOptions`.
   - productos con `useProductFilters` y `useProductRaiz`.
3. Los hijos reciben props:
   - `CategoryStrip` recibe categorias y `onCategorySelect`.
   - `ProductFilters` recibe filtros actuales y callbacks para aplicar/limpiar.
   - `ProductGrid` recibe productos, paginacion, orden y callbacks.
4. Cuando una categoria se selecciona realmente, el padre aplica
   `categoria_id` y `useCategoryMetrics` registra la vista.

## Flujo de detalle de producto

1. `app/productos/[slug]/page.tsx` recibe `slug`.
2. `ProductDetailContainer` llama a `useProductDetail(slug)`.
3. El producto API se adapta con `apiProductToProductDetail`.
4. El padre arma URLs de WhatsApp, compartir, relacionados y modales.
5. `useProductMetrics(detail.product?.id)` registra la vista real del producto.

## API y cache

- El backend base sale de `NEXT_PUBLIC_API_URL`.
- En produccion no debe apuntar a `localhost`.
- `features/products/cache/productRequestCache.ts` deduplica y cachea requests
  publicos en memoria.
- Las rutas publicas principales:
  - `GET /api/productos`
  - `GET /api/productos/:slug`
  - `GET /api/productos/filtros-opciones`
  - `GET /api/categorias/destacadas`
  - `POST /api/producto-metricas/:productoId/vista`
  - `POST /api/categoria-metricas/:categoriaId/vista`

## Metricas

- `useProductMetrics(productoId)` registra vistas de producto con ventana de
  30 minutos usando `localStorage`.
- `useCategoryMetrics(categoriaId)` registra vistas de categoria con ventana de
  30 minutos usando `localStorage`.
- Las metricas deben fallar en silencio y nunca romper la UI.
- No mover metricas a estado global ni provider.

## Estilo de cambios esperado

- Preferir cambios pequenos y localizados.
- Seguir nombres existentes en espanol cuando el proyecto ya los usa:
  `categoria_id`, `productoId`, `categoriaId`, `ProductPageContainer`.
- No introducir librerias nuevas si el proyecto ya resuelve el caso con React,
  hooks locales y `fetch`.
- Si una logica afecta a varios hijos, mantenerla en el container/padre y pasar
  datos por props.
