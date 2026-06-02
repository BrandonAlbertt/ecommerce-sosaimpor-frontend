# Estructura del proyecto

Estructura del proyecto `ecommerce-sosaimpor-frontend`, excluyendo carpetas generadas o de dependencias como `.git`, `.next`, `.pnpm-store` y `node_modules`.

```text
ecommerce-sosaimpor-frontend/
├─ .env
├─ .gitignore
├─ .next-dev.err.log
├─ .next-dev.log
├─ AGENTS.md
├─ CLAUDE.md
├─ README.md
├─ eslint.config.mjs
├─ next-env.d.ts
├─ next.config.ts
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ postcss.config.mjs
├─ tsconfig.json
├─ tsconfig.tsbuildinfo
├─ app/
│  ├─ carrito/
│  │  └─ page.tsx
│  ├─ productos/
│  │  ├─ [slug]/
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ providers.tsx
├─ certificates/
├─ components/
│  ├─ compartidos/
│  │  ├─ carrito/
│  │  │  ├─ CartItem.tsx
│  │  │  ├─ CartPageContainer.tsx
│  │  │  └─ CartSummary.tsx
│  │  ├─ layout/
│  │  │  ├─ DeveloperCredit.tsx
│  │  │  ├─ NavbarLink.tsx
│  │  │  ├─ ProductSearch.tsx
│  │  │  ├─ StoreLocationModal.tsx
│  │  │  ├─ SuggestionModal.tsx
│  │  │  └─ ThemeToggle.tsx
│  │  ├─ product-detail/
│  │  │  ├─ DesktopProductAside.tsx
│  │  │  ├─ ProductDetailContainer.tsx
│  │  │  ├─ ProductGallery.tsx
│  │  │  ├─ ProductInfo.tsx
│  │  │  └─ ProductShareModal.tsx
│  │  ├─ productos/
│  │  │  ├─ CategoryStrip.tsx
│  │  │  ├─ ProductCardBase.tsx
│  │  │  ├─ ProductFilters.tsx
│  │  │  ├─ ProductGrid.tsx
│  │  │  └─ ProductPageContainer.tsx
│  │  └─ ui/
│  │     ├─ Badge.tsx
│  │     ├─ Button.tsx
│  │     └─ Input.tsx
│  ├─ escritorio/
│  │  ├─ layout/
│  │  │  ├─ DesktopFooter.tsx
│  │  │  └─ DesktopHeader.tsx
│  │  └─ productos/
│  │     ├─ CartPreview.tsx
│  │     ├─ DesktopCategoryGrid.tsx
│  │     ├─ DesktopProductGrid.tsx
│  │     └─ StoreSupportAside.tsx
│  └─ movil/
│     ├─ layout/
│     │  ├─ MobileAppChrome.tsx
│     │  ├─ MobileBottomNav.tsx
│     │  └─ MobileHeader.tsx
│     └─ productos/
│        ├─ MobileCategoryCarousel.tsx
│        ├─ MobileFilterDrawer.tsx
│        ├─ MobileProductCard.tsx
│        ├─ MobileProductDetail.tsx
│        └─ MobileProductGrid.tsx
├─ documentacion/
│  ├─ AUDITORIA.md
│  ├─ CONTINUIDAD_FILTROS_CATALOGO.md
│  ├─ GUIA_BARRA_BUSQUEDA_PRODUCTOS.md
│  ├─ GUIA_FEATURES_LIB_PROVIDERS.md
│  ├─ GUIA_HIDRATACION_TEMA_MOBILEHEADER.md
│  ├─ GUIA_LAYOUT_PROVIDERS_PAGE.md
│  ├─ GUIA_LOGICA_FILTROS.md.md
│  ├─ GUIA_TEMA_Y_BOTONES_MOVIL.md
│  ├─ RESPONSIVE_MOVIL.md
│  ├─ estructura-aplicacion.md
│  ├─ estructura.md
│  ├─ guia-parte-escritorio.md
│  └─ guia-parte-movil.md
├─ features/
│  ├─ cart/
│  │  └─ store/
│  │     └─ cartStore.ts
│  ├─ comments/
│  │  ├─ api/
│  │  │  └─ commentsApi.ts
│  │  ├─ hooks/
│  │  │  └─ useComment.ts
│  │  ├─ types/
│  │  │  └─ comment.types.ts
│  │  └─ utils/
│  │     └─ commentValidation.ts
│  ├─ home/
│  │  ├─ api/
│  │  │  └─ homeApi.ts
│  │  ├─ hooks/
│  │  │  └─ useHome.ts
│  │  └─ types/
│  │     └─ home.types.ts
│  ├─ products/
│  │  ├─ api/
│  │  │  ├─ categoriesApi.ts
│  │  │  └─ productsApi.ts
│  │  ├─ data/
│  │  │  └─ catalogData.ts
│  │  ├─ hooks/
│  │  │  ├─ useFeaturedCategories.ts
│  │  │  ├─ useProductDetail.ts
│  │  │  ├─ useProductFilterOptions.ts
│  │  │  ├─ useProductFilters.ts
│  │  │  ├─ useProductRaiz.ts
│  │  │  ├─ useProductSearch.ts
│  │  │  └─ useProductSearchNavigation.ts
│  │  ├─ types/
│  │  │  ├─ category.types.ts
│  │  │  ├─ product.types.ts
│  │  │  ├─ productFilterOptions.types.ts
│  │  │  └─ productSearch.types.ts
│  │  └─ utils/
│  │     ├─ categoryAdapter.ts
│  │     ├─ productAdapter.ts
│  │     └─ productImage.ts
│  └─ store/
│     └─ storeLocation.ts
├─ lib/
│  ├─ axiosClient.ts
│  └─ utils.ts
├─ providers/
│  └─ ThemeProvider.tsx
└─ public/
   ├─ Yape-imagen.svg
   ├─ file.svg
   ├─ globe.svg
   ├─ logo-imagen-claro.webp
   ├─ logo-imagen-oscuro.webp
   ├─ next.svg
   ├─ plin-imagen.svg
   ├─ sosa-import-header-icon.svg
   ├─ vercel.svg
   ├─ visa-imagen.svg
   └─ window.svg
```
