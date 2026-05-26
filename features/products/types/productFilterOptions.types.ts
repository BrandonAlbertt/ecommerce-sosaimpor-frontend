import type { ProductFilterOptions } from "@/features/products/types/product.types";

// ESTADO PUBLICO QUE RECIBEN LOS COMPONENTES PARA ARMAR LOS FILTROS.
export type ProductFilterOptionsModel = {
  options: ProductFilterOptions | null;
  error: string | null;
  isLoading: boolean;
};
