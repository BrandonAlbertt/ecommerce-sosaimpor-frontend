"use client";

import { MobileFilterDrawer } from "@/components/movil/productos/MobileFilterDrawer";
import { useProductFilterOptions } from "@/features/products/hooks/useProductFilterOptions";
import type { ProductFilterParams } from "@/features/products/types/product.types";
import type { ProductFilterOptionsModel } from "@/features/products/types/productFilterOptions.types";
import type { ProductSearchModel } from "@/features/products/types/productSearch.types";

import { MobileBottomNav } from "./MobileBottomNav";
import { useMobileFilter } from "./MobileFilterContext";
import { MobileHeader } from "./MobileHeader";

type MobileAppChromeProps = {
  filterOptions?: ProductFilterOptionsModel;
  filters?: ProductFilterParams;
  onApplyFilters?: (filters: ProductFilterParams) => void;
  onClearFilters?: () => void;
  productSearch?: ProductSearchModel;
};

export function MobileAppChrome({ 
  filterOptions, 
  filters = {},
  onApplyFilters = () => {},
  onClearFilters = () => {},
  productSearch 
}: MobileAppChromeProps) {
  if (!filterOptions) {
    return (
      <MobileAppChromeWithFilterOptions
        filters={filters}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        productSearch={productSearch}
      />
    );
  }

  return (
    <MobileAppChromeContent 
      filterOptions={filterOptions} 
      filters={filters}
      onApplyFilters={onApplyFilters}
      onClearFilters={onClearFilters}
      productSearch={productSearch} 
    />
  );
}

function MobileAppChromeWithFilterOptions({
  filters,
  onApplyFilters,
  onClearFilters,
  productSearch,
}: Omit<MobileAppChromeProps, "filterOptions">) {
  const filterOptions = useProductFilterOptions();

  return (
    <MobileAppChromeContent 
      filterOptions={filterOptions} 
      filters={filters ?? {}}
      onApplyFilters={onApplyFilters ?? (() => {})}
      onClearFilters={onClearFilters ?? (() => {})}
      productSearch={productSearch} 
    />
  );
}

function MobileAppChromeContent({
  filterOptions,
  filters,
  onApplyFilters,
  onClearFilters,
  productSearch,
}: {
  filterOptions: ProductFilterOptionsModel;
  filters: ProductFilterParams;
  onApplyFilters: (filters: ProductFilterParams) => void;
  onClearFilters: () => void;
  productSearch?: ProductSearchModel;
}) {
  const { closeFilters, filtersOpen } = useMobileFilter();

  return (
    // CHROME MOVIL REUTILIZABLE: HEADER, FILTROS Y BARRA INFERIOR DE LA PAGINA.
    <>
      <MobileHeader productSearch={productSearch} />
      <MobileFilterDrawer 
        filterOptions={filterOptions} 
        filters={filters}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        open={filtersOpen} 
        onClose={closeFilters} 
      />
      <MobileBottomNav />
    </>
  );
}
