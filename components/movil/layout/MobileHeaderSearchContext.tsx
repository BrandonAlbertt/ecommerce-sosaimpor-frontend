"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import type { ProductSearchModel } from "@/components/compartidos/layout/ProductSearch";

type MobileHeaderSearchContextValue = {
  productSearch: ProductSearchModel | null;
  setProductSearch: Dispatch<SetStateAction<ProductSearchModel | null>>;
};

const MobileHeaderSearchContext = createContext<MobileHeaderSearchContextValue | null>(null);

type MobileHeaderSearchProviderProps = {
  children: ReactNode;
};

export function MobileHeaderSearchProvider({ children }: MobileHeaderSearchProviderProps) {
  const [productSearch, setProductSearch] = useState<ProductSearchModel | null>(null);

  const value = useMemo(
    () => ({
      productSearch,
      setProductSearch,
    }),
    [productSearch],
  );

  return (
    <MobileHeaderSearchContext.Provider value={value}>
      {children}
    </MobileHeaderSearchContext.Provider>
  );
}

export function useMobileHeaderSearch() {
  const context = useContext(MobileHeaderSearchContext);

  if (!context) {
    throw new Error("useMobileHeaderSearch debe usarse dentro de MobileHeaderSearchProvider");
  }

  return context;
}
