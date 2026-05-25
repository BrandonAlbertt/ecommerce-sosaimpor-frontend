"use client";

import { useEffect } from "react";

import { DesktopFooter } from "@/components/escritorio/layout/DesktopFooter";
import { DesktopHeader } from "@/components/escritorio/layout/DesktopHeader";
import { CartPreview } from "@/components/escritorio/productos/CartPreview";
import { MobileAppChrome } from "@/components/movil/layout/MobileAppChrome";
import { useMobileFilter } from "@/components/movil/layout/MobileFilterContext";
import { catalogCategories, catalogProducts } from "@/features/products/data/catalogData";
import { useProductSearch } from "@/features/products/hooks/useProductSearch";
import { SlidersHorizontal } from "lucide-react";

import { CategoryStrip } from "./CategoryStrip";
import { ProductFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";

// FUNCION HERO: PRESENTA EL TITULO PRINCIPAL Y LOS MENSAJES CLAVE DE LA TIENDA.
function StoreHero() {
  return (
    <section className="w-full max-w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 md:rounded-xl">
      <div className="grid min-w-0 gap-4 px-4 py-4 md:px-6 md:py-5 lg:grid-cols-[1fr_340px] lg:items-center">
        <div className="min-w-0 max-w-full">
          <h1 className="max-w-full whitespace-normal wrap-break-word text-2xl font-black uppercase leading-tight tracking-normal text-zinc-950 transition-colors duration-300 dark:text-zinc-100 sm:text-3xl md:text-3xl xl:text-4xl">
            REPUESTOS USADOS IMPORTADOS
          </h1>
          <p className="mt-2 max-w-full whitespace-normal wrap-break-word text-sm font-medium leading-relaxed text-zinc-700 transition-colors duration-300 dark:text-zinc-400 md:text-lg">
            Piezas seleccionadas y verificadas para tu vehículo
          </p>
          <div className="mt-4 flex max-w-full flex-wrap gap-2 text-[11px] font-black uppercase md:mt-5 md:gap-5 md:text-xs">
            <span className="max-w-full wrap-break-word text-red-600 dark:text-red-500">Compra online y recoge en taller</span>
            <span className="text-zinc-950 dark:text-zinc-400">Sin envíos</span>
            <span className="text-zinc-950 dark:text-zinc-400">Recojo en tienda</span>
          </div>
        </div>
        <div className="hidden h-36 items-center justify-center rounded-xl bg-zinc-50 text-sm font-black text-zinc-400 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-500 md:flex lg:h-40">
          IMAGEN MOTOR
        </div>
      </div>
    </section>
  );
}

// BARRA DE BENEFICIOS: MUESTRA LOS PUNTOS FUERTES DEL SERVICIO EN TARJETAS.
function BenefitsBar() {
  const benefits = [
    "Piezas verificadas",
    "Stock actualizado",
    "Atencion personalizada",
    "Recojo en taller",
  ];

  return (
    <section className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2 md:gap-4 md:rounded-xl xl:grid-cols-4">
      {benefits.map((benefit) => (
        <div key={benefit} className="flex min-w-0 items-center gap-4 border-zinc-200 dark:border-zinc-800 xl:border-r xl:last:border-r-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-xs font-black text-red-600 transition-colors duration-300 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            OK
          </div>
          <div className="min-w-0">
            <h3 className="wrap-break-word text-sm font-black uppercase text-zinc-950 dark:text-zinc-100">{benefit}</h3>
            <p className="wrap-break-word text-xs text-zinc-600 dark:text-zinc-400">Servicio claro, rapido y listo para coordinar.</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export function ProductPageContainer() {
  // LOGICA DE FILTROS MOVILES: ABRE EL PANEL DESDE LA CABECERA.
  const { openFilters } = useMobileFilter();
  // LOGICA PRINCIPAL: OBTIENE EL ESTADO DE BUSQUEDA Y LOS RESULTADOS.
  const { productSearch, results, submittedSearch } = useProductSearch();

  // LOGICA DE RESULTADOS: REGISTRA EL ESTADO FINAL DE LA BUSQUEDA CUANDO YA CARGO.
  useEffect(() => {
    if (!submittedSearch || results.isLoading) {
      return;
    }

    if (results.error) {
      console.log("[Productos] Error al cargar coincidencias:", results.error);
      return;
    }

    if (!results.pagination) {
      return;
    }

    console.log("[Productos] Coincidencias listas para ProductGrid:", {
      search: submittedSearch,
      products: results.products,
      pagination: results.pagination,
    });
  }, [
    results.error,
    results.isLoading,
    results.pagination,
    results.products,
    submittedSearch,
  ]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white transition-colors duration-300 dark:bg-zinc-950">
      {/* CHROME MOVIL: RECIBE LA MISMA BUSQUEDA QUE EL HEADER DE ESCRITORIO. */}
      <MobileAppChrome productSearch={productSearch} />
      {/* PARTE ESCRITORIO */}
      {/* HEADER PARA PANTALLAS MEDIANAS Y GRANDES. */}
      <DesktopHeader productSearch={productSearch} />

      <main className="mx-auto w-full max-w-480 overflow-x-hidden px-4 pb-28 pt-3 md:px-4 md:py-5">
        <div className="grid min-w-0 gap-5 xl:grid-cols-[270px_minmax(0,1fr)_300px]">
          {/* FILTROS LATERALES SOLO EN ESCRITORIO. */}
          <div className="hidden xl:block">
            <ProductFilters />
          </div>

          <div className="min-w-0 max-w-full space-y-5">
            <StoreHero />
            <CategoryStrip categories={catalogCategories} />

            {/* PARTE MOVIL */}
            {/* BOTON DE FILTROS PARA MOVIL. */}
            <div className="md:hidden">
              <button
                className="relative z-20 flex h-12 w-full max-w-full touch-manipulation items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white text-sm font-black text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                onClick={openFilters}
                type="button"
              >
                <SlidersHorizontal size={18} suppressHydrationWarning />
                Filtrar productos
              </button>
            </div>

            <ProductGrid products={catalogProducts} />
          </div>

          {/* carrito visible en escritorio */}
          <div className="hidden xl:block">
            <CartPreview />
          </div>
        </div>

        {/* BENEFICIOS DE LA PAGINA. */}
        <div className="mt-5">
          <BenefitsBar />
        </div>
      </main>
      {/* FOOTER DESDE MD EN ADELANTE. */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>
    </div>
  );
}
