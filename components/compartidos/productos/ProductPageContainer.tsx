"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// COMPONENTES COMPARTIDOS Y DE LAYOUT
import { DesktopHeader } from "@/components/escritorio/layout/DesktopHeader";
import { StoreLocationModal } from "@/components/compartidos/layout/StoreLocationModal";
import { SuggestionModal } from "@/components/compartidos/layout/SuggestionModal";
import { StoreSupportAside } from "@/components/escritorio/productos/StoreSupportAside";
import { MobileAppChrome } from "@/components/movil/layout/MobileAppChrome";
// DATOS Y HOOKS DE PRODUCTOS
import { useComment } from "@/features/comments/hooks/useComment";
import { useHome } from "@/features/home/hooks/useHome";
import type { HomeContentModel } from "@/features/home/types/home.types";
import { catalogCategories } from "@/features/products/data/catalogData";
import { useCategoryMetrics } from "@/features/products/hooks/useCategoryMetrics";
import { useFeaturedCategories } from "@/features/products/hooks/useFeaturedCategories";
import { useProductFilterOptions } from "@/features/products/hooks/useProductFilterOptions";
import { useProductFilters } from "@/features/products/hooks/useProductFilters";
import { useProductSearch } from "@/features/products/hooks/useProductSearch";
import type { CategoryItem, ProductSortOrder } from "@/features/products/types/product.types";
import { storeLocation } from "@/features/store/storeLocation";
import { apiFeaturedCategoryToCategoryItem } from "@/features/products/utils/categoryAdapter";
import { apiProductToProduct } from "@/features/products/utils/productAdapter";
// ICONOS
import { SlidersHorizontal } from "lucide-react";

// COMPONENTES DE LA SECCION DE PRODUCTOS
import { CategoryStrip } from "./CategoryStrip";
import { ProductFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";

const defaultHomePageContent: HomeContentModel = {
  banner: {
    imageLabel: "CATALOGO VIP",
    primaryMessage: "Entrega express",
    secondaryMessage: "Garantía extendida",
    tertiaryMessage: "Atención personalizada",
    subtitle: "Soluciones premium para talleres y conductores exigentes",
    title: "AUTOPARTES SELECTAS DEL PACIFICO",
  },
  header: {
    helpLabel: "Soporte inmediato",
    locationLabel: "Sede central",
    locationSubLabel: "Abrir mapa",
    phoneLabel: "+51 987 654 321",
    primaryMessage: "Compra segura y retiro coordinado",
    scheduleFriday: "Lun - Vie: 9:00 am - 7:00 pm",
    scheduleSaturday: "Sab: 9:00 am - 2:00 pm",
    shippingBadge: "envios a nivel nacional",
    secondaryMessage: "Recojo en tienda o despacho",
    whatsappLabel: "Escribenos",
    whatsappSubLabel: "Respuesta prioritaria",
    whatsappUrl: "https://wa.me/51987654321",
  },
  location: {
    displayAddress: "Jr. Comercio 456",
    displayDistrict: "Santa Anita, Lima",
    modal: storeLocation,
  },
  sellerWhatsappUrl: "https://wa.me/51987654321",
};

// FUNCION HERO: PRESENTA EL TITULO PRINCIPAL Y LOS MENSAJES CLAVE DE LA TIENDA.
function StoreHero({ content }: { content: HomeContentModel["banner"] }) {
  return (
    <section className="w-full max-w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white via-white to-zinc-50 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 md:rounded-xl">
      <div className="grid min-w-0 gap-5 px-5 py-5 md:px-5 md:py-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] lg:items-center xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 max-w-full py-1">
          <h1 className="max-w-full whitespace-normal wrap-break-word text-2xl font-black uppercase leading-tight tracking-normal text-zinc-950 transition-colors duration-300 dark:text-zinc-100 sm:text-3xl md:text-2xl xl:text-3xl">
            {content.title}
          </h1>
          <p className="mt-2 max-w-full whitespace-normal wrap-break-word text-sm font-medium leading-relaxed text-zinc-700 transition-colors duration-300 dark:text-zinc-400 md:text-base">
            {content.subtitle}
          </p>
          <div className="mt-4 flex max-w-full flex-wrap gap-2 text-[11px] font-black uppercase md:mt-4 md:gap-4 md:text-[11px] xl:text-xs">
            <span className="max-w-full wrap-break-word text-red-600 dark:text-red-500">{content.primaryMessage}</span>
            <span className="text-zinc-950 dark:text-zinc-400">{content.secondaryMessage}</span>
            <span className="text-zinc-950 dark:text-zinc-400">{content.tertiaryMessage}</span>
          </div>
        </div>
        <div className="relative hidden h-36 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-[0_14px_28px_rgba(15,23,42,0.10)] ring-1 ring-white/70 transition-colors duration-300 dark:border-zinc-700 dark:bg-zinc-950 dark:shadow-[0_18px_34px_rgba(0,0,0,0.45)] dark:ring-red-500/10 md:block lg:h-40">
          <Image
            alt="Banner de repuestos usados importados"
            className="object-cover object-center brightness-[0.98] contrast-[1.04] saturate-[1.04] dark:brightness-[0.88] dark:contrast-[1.08]"
            fill
            loading="eager"
            sizes="(min-width: 1280px) 380px, (min-width: 1024px) 360px, 0px"
            src="/banner1.webp"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/20 via-transparent to-zinc-950/10 dark:from-zinc-950/45 dark:via-zinc-950/5 dark:to-red-950/30" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/15 dark:from-zinc-950/35 dark:to-white/5" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/25 dark:ring-white/10" />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL EXPORTADO DE LA PAGINA DE PRODUCTOS
// ============================================================
type ProductPageContainerProps = {
  initialSearch?: string;
};

export function ProductPageContainer({ 
  initialSearch,
}: ProductPageContainerProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const mobileLoadMoreLockedRef = useRef(false);
  const mobileRequestedPageRef = useRef<number | null>(null);
  const comment = useComment();
  const home = useHome();
  const homePageContent = home.homeContent ?? defaultHomePageContent;
  const openMobileFilters = useCallback(() => setMobileFiltersOpen(true), []);
  const closeMobileFilters = useCallback(() => setMobileFiltersOpen(false), []);
  const openLocation = useCallback(() => setLocationOpen(true), []);
  const closeLocation = useCallback(() => setLocationOpen(false), []);
  const openSuggestion = useCallback(() => setSuggestionOpen(true), []);
  const closeSuggestion = useCallback(() => {
    setSuggestionOpen(false);
    comment.resetCommentState();
  }, [comment]);
  const handleSuggestionSubmit = useCallback(async () => {
    const response = await comment.submitComment(suggestionMessage);

    if (response) {
      setSuggestionMessage("");
    }
  }, [comment, suggestionMessage]);

  // CATEGORIAS DESTACADAS: SE CARGAN DESDE LA API SIN PROVIDER NI CONTEXT.
  const featuredCategories = useFeaturedCategories();
  // OPCIONES DE FILTROS: SE CARGAN UNA VEZ Y SE COMPARTEN ENTRE DESKTOP Y MOVIL.
  const filterOptions = useProductFilterOptions();
  // PRODUCTOS DEL CATALOGO: SE CARGAN DESDE LA API Y CAMBIAN AL APLICAR FILTROS.
  const productFilters = useProductFilters({
    initialFilters: initialSearch ? { search: initialSearch } : {},
  });
  const { applyFilters, filters } = productFilters;
  useCategoryMetrics(filters.categoria_id);
  // BUSQUEDA: AL ENVIAR TEXTO, LO APLICA AL MISMO CATALOGO QUE USAN LOS FILTROS.
  const handleSearchSubmit = useCallback(
    (search: string) => {
      applyFilters({
        ...filters,
        search,
      });
    },
    [applyFilters, filters],
  );
  // LOGICA PRINCIPAL: OBTIENE EL ESTADO DE BUSQUEDA Y LOS RESULTADOS.
  const { productSearch } = useProductSearch({
    onSearchSubmit: handleSearchSubmit,
  });
  const catalogProducts = useMemo(
    () => productFilters.products.map(apiProductToProduct),
    [productFilters.products],
  );
  const sortedCatalogProducts = useMemo(
    () => {
      const sortOrder = productFilters.filters.orden_precio;

      if (!sortOrder) {
        return catalogProducts;
      }

      // Idealmente este orden deberia venir desde SQL para paginar resultados ya ordenados.
      return [...catalogProducts].sort((firstProduct, secondProduct) => (
        sortOrder === "precio_asc"
          ? firstProduct.price - secondProduct.price
          : secondProduct.price - firstProduct.price
      ));
    },
    [catalogProducts, productFilters.filters.orden_precio],
  );
  const mobileCatalogProducts = useMemo(
    () => productFilters.accumulatedProducts.map(apiProductToProduct),
    [productFilters.accumulatedProducts],
  );
  const catalogFeaturedCategories = useMemo(
    () => {
      if (featuredCategories.categories.length === 0) {
        return catalogCategories;
      }

      return featuredCategories.categories.map(apiFeaturedCategoryToCategoryItem);
    },
    [featuredCategories.categories],
  );
  // CLIC EN CATEGORIA DESTACADA: USA EL MISMO FILTRO PUBLICO DEL CATALOGO.
  const handleFeaturedCategorySelect = useCallback(
    (category: CategoryItem) => {
      const categoryId = Number(category.id);

      if (!Number.isFinite(categoryId)) {
        return;
      }

      applyFilters({
        ...filters,
        categoria_id: categoryId,
      });
    },
    [applyFilters, filters],
  );
  const handleSortChange = useCallback(
    (sortOrder: ProductSortOrder | "") => {
      applyFilters({
        ...filters,
        orden_precio: sortOrder || undefined,
      });
    },
    [applyFilters, filters],
  );
  const filterFormKey = JSON.stringify(productFilters.filters);
  const hasMoreMobileProducts = Boolean(productFilters.pagination?.hasNextPage);
  const isLoadingProducts = productFilters.loading;
  const currentProductPage = productFilters.page;
  const changeProductPage = productFilters.changePage;

  useEffect(() => {
    mobileLoadMoreLockedRef.current = false;
    mobileRequestedPageRef.current = null;
  }, [filterFormKey]);

  useEffect(() => {
    if (isLoadingProducts) {
      return;
    }

    if (
      mobileRequestedPageRef.current !== null &&
      productFilters.pagination?.page === mobileRequestedPageRef.current
    ) {
      mobileLoadMoreLockedRef.current = false;
      mobileRequestedPageRef.current = null;
    }
  }, [isLoadingProducts, productFilters.pagination?.page]);

  const handleLoadMoreMobileProducts = useCallback(() => {
    if (
      isLoadingProducts ||
      !hasMoreMobileProducts ||
      mobileLoadMoreLockedRef.current
    ) {
      return;
    }

    const nextPage = currentProductPage + 1;
    mobileLoadMoreLockedRef.current = true;
    mobileRequestedPageRef.current = nextPage;
    changeProductPage(nextPage);
  }, [
    changeProductPage,
    currentProductPage,
    hasMoreMobileProducts,
    isLoadingProducts,
  ]);

  // Renderizado principal
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white transition-colors duration-300 dark:bg-zinc-950">
      <MobileAppChrome 
          filterOptions={filterOptions} 
          filtersOpen={mobileFiltersOpen}
          filters={productFilters.filters}
          onApplyFilters={productFilters.applyFilters}
          onClearFilters={productFilters.clearFilters}
          onCloseFilters={closeMobileFilters}
          productSearch={productSearch} 
      />
      {/* PARTE ESCRITORIO */}
      {/* HEADER PARA PANTALLAS MEDIANAS Y GRANDES. */}
      <DesktopHeader 
          content={homePageContent.header}
          onLocationClick={openLocation}
          productSearch={productSearch} 
      />
      <StoreLocationModal
        displayAddress={homePageContent.location.displayAddress}
        displayDistrict={homePageContent.location.displayDistrict}
        location={homePageContent.location.modal}
        onClose={closeLocation}
        open={locationOpen}
      />
      <SuggestionModal
        error={comment.error}
        isSubmitting={comment.isSubmitting}
        message={suggestionMessage}
        onChangeMessage={setSuggestionMessage}
        onClose={closeSuggestion}
        onSubmit={handleSuggestionSubmit}
        open={suggestionOpen}
        successMessage={comment.successMessage}
      />

      <main className="mx-auto w-full max-w-480 overflow-x-hidden px-4 pb-28 pt-[8.75rem] md:px-4 md:py-5">
        <div className="grid min-w-0 gap-5 xl:grid-cols-[270px_minmax(0,1fr)_300px]">
          {/* FILTROS LATERALES SOLO EN ESCRITORIO. */}
          <div className="hidden xl:block">
            <ProductFilters 
                key={filterFormKey}
                filterOptions={filterOptions} 
                filters={productFilters.filters}
                onApplyFilters={productFilters.applyFilters}
                onClearFilters={productFilters.clearFilters}
            />
          </div>

          <div className="min-w-0 max-w-full space-y-5">
            <StoreHero content={homePageContent.banner} />
            <CategoryStrip 
                categories={catalogFeaturedCategories}
                onCategorySelect={handleFeaturedCategorySelect}
            />

            {/* PARTE MOVIL */}
            {/* BOTON DE FILTROS PARA MOVIL. */}
            <div className="md:hidden">
              <button
                className="relative z-20 flex h-12 w-full max-w-full touch-manipulation items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white text-sm font-black text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                onClick={openMobileFilters}
                type="button"
              >
                <SlidersHorizontal size={18} suppressHydrationWarning />
                Filtrar productos
              </button>
            </div>

            <ProductGrid
              error={productFilters.error}
              isLoading={productFilters.loading}
              mobileProducts={mobileCatalogProducts.length > 0 ? mobileCatalogProducts : catalogProducts}
              onLoadMoreMobile={handleLoadMoreMobileProducts}
              onPageChange={productFilters.changePage}
              onResetFilters={productFilters.clearFilters}
              onSortChange={handleSortChange}
              pagination={productFilters.pagination}
              hasMoreMobileProducts={hasMoreMobileProducts}
              products={sortedCatalogProducts}
              sortOrder={productFilters.filters.orden_precio ?? ""}
            />
          </div>

          {/* soporte visible en escritorio */}
          <div className="hidden xl:block">
            <StoreSupportAside
              locationAddress={homePageContent.location.displayAddress}
              locationDistrict={homePageContent.location.displayDistrict}
              onLocationClick={openLocation}
              onSuggestionClick={openSuggestion}
              whatsappUrl={homePageContent.sellerWhatsappUrl}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
