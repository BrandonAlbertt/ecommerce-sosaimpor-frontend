"use client";

import { MobileFilterDrawer } from "@/app/productos/components/mobile/MobileFilterDrawer";

import { MobileBottomNav } from "./MobileBottomNav";
import { useMobileFilter } from "./MobileFilterContext";
import { MobileHeader } from "./MobileHeader";

export function MobileAppChrome() {
  const { closeFilters, filtersOpen } = useMobileFilter();

  return (
    // Seccion movil global: header y barra inferior disponibles en todas las paginas.
    <>
      <MobileHeader />
      <MobileFilterDrawer open={filtersOpen} onClose={closeFilters} />
      <MobileBottomNav />
    </>
  );
}
