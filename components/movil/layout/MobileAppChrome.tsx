"use client";

import { MobileFilterDrawer } from "@/components/movil/productos/MobileFilterDrawer";
import type { ProductSearchModel } from "@/features/products/types/productSearch.types";

import { MobileBottomNav } from "./MobileBottomNav";
import { useMobileFilter } from "./MobileFilterContext";
import { MobileHeader } from "./MobileHeader";

type MobileAppChromeProps = {
  productSearch?: ProductSearchModel;
};

export function MobileAppChrome({ productSearch }: MobileAppChromeProps) {
  const { closeFilters, filtersOpen } = useMobileFilter();

  return (
    // CHROME MOVIL REUTILIZABLE: HEADER, FILTROS Y BARRA INFERIOR DE LA PAGINA.
    <>
      <MobileHeader productSearch={productSearch} />
      <MobileFilterDrawer open={filtersOpen} onClose={closeFilters} />
      <MobileBottomNav />
    </>
  );
}
