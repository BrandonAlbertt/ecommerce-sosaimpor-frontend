"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type MobileFilterContextValue = {
  filtersOpen: boolean;
  openFilters: () => void;
  closeFilters: () => void;
};

const MobileFilterContext = createContext<MobileFilterContextValue | null>(null);

type MobileFilterProviderProps = {
  children: ReactNode;
};

export function MobileFilterProvider({ children }: MobileFilterProviderProps) {
  // Este provider es el padre del estado compartido: abre y cierra el drawer movil.
  const [filtersOpen, setFiltersOpen] = useState(false);

  const value = useMemo(
    () => ({
      filtersOpen,
      openFilters: () => setFiltersOpen(true),
      closeFilters: () => setFiltersOpen(false),
    }),
    [filtersOpen],
  );

  return <MobileFilterContext.Provider value={value}>{children}</MobileFilterContext.Provider>;
}

export function useMobileFilter() {
  // El hijo que lo use recibe el estado desde el provider, no desde props directas.
  const context = useContext(MobileFilterContext);

  if (!context) {
    throw new Error("useMobileFilter debe usarse dentro de MobileFilterProvider");
  }

  return context;
}
