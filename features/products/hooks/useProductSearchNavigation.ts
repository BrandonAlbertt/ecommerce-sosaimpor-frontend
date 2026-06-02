"use client";

// ============================================================
// HOOK PARA BUSQUEDA GLOBAL DE PRODUCTOS
// ============================================================
// Funcionalidad: usar la misma barra de busqueda en cualquier pagina.
// No usa context ni provider. Solo navega a /productos con search en la URL.
//
// Flujo:
// 1. Header usa useProductSearchNavigation().
// 2. ProductSearch muestra sugerencias con useProductSearch.
// 3. Al presionar Buscar o Mostrar mas coincidencias navega a:
//    /productos?search=texto
// 4. ProductPageContainer lee ese search y lista el grid filtrado.

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { useProductSearch } from "./useProductSearch";

export function useProductSearchNavigation() {
  const router = useRouter();

  const handleSearchSubmit = useCallback(
    (search: string) => {
      const cleanSearch = search.trim();

      if (!cleanSearch) {
        return;
      }

      router.push(`/productos?search=${encodeURIComponent(cleanSearch)}`);
    },
    [router],
  );

  return useProductSearch({
    onSearchSubmit: handleSearchSubmit,
  });
}
