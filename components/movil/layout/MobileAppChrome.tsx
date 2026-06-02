"use client";

import { MobileFilterDrawer } from "@/components/movil/productos/MobileFilterDrawer";
import type { ProductFilterParams } from "@/features/products/types/product.types";
import type { ProductFilterOptionsModel } from "@/features/products/types/productFilterOptions.types";
import type { ProductSearchModel } from "@/features/products/types/productSearch.types";

import { mobileSearchInputId } from "./MobileBottomNav";
import { MobileHeader } from "./MobileHeader";

type MobileAppChromeProps = {
  filterOptions?: ProductFilterOptionsModel;
  filtersOpen?: boolean;
  filters?: ProductFilterParams;
  onApplyFilters?: (filters: ProductFilterParams) => void;
  onClearFilters?: () => void;
  onCloseFilters?: () => void;
  productSearch: ProductSearchModel;
};

export function MobileAppChrome({ 
  filterOptions, 
  filtersOpen = false,
  filters = {},
  onApplyFilters = () => {},
  onClearFilters = () => {},
  onCloseFilters = () => {},
  productSearch 
}: MobileAppChromeProps) {
  return (
    <>
      <MobileHeader
        mobileSearchInputId={mobileSearchInputId}
        productSearch={productSearch}
      />
      {filterOptions ? (
        <MobileFilterDrawer 
          filterOptions={filterOptions} 
          filters={filters}
          onApplyFilters={onApplyFilters}
          onClearFilters={onClearFilters}
          open={filtersOpen} 
          onClose={onCloseFilters} 
        />
      ) : null}
    </>
  );
}
