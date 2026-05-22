import type { Product } from "@/features/products/types/product.types";

import { ProductCardBase } from "@/components/compartidos/productos/ProductCardBase";

type DesktopProductGridProps = {
  products: Product[];
};

export function DesktopProductGrid({ products }: DesktopProductGridProps) {
  return (
    // Seccion escritorio: conserva la grilla y ProductCard actuales.
    <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
      {products.map((product) => (
        <ProductCardBase key={product.id} product={product} />
      ))}
    </div>
  );
}
