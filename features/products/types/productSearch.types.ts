import type {
  ProductApiItem,
  ProductPagination,
} from "@/features/products/types/product.types";

// MODELO DE DATOS Y ACCIONES QUE LA BARRA RECIBE DESDE EL HOOK.
export type ProductSearchModel = {
  value: string;
  suggestions: ProductApiItem[];
  suggestionsPagination: ProductPagination | null;
  isLoading: boolean;
  error: string | null;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onShowMore: () => void;
};

// PROPS DEL COMPONENTE VISUAL DE BUSQUEDA.
export type ProductSearchProps = {
  inputId?: string;
  model: ProductSearchModel;
  variant?: "desktop" | "mobile";
};
