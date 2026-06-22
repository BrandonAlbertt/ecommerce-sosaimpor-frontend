import type { Product } from "@/features/products/types/product.types";

import { ProductCardBase } from "@/components/compartidos/productos/ProductCardBase";

type DesktopProductGridProps = {
  className?: string;
  products: Product[];
  shippingBadge?: string;
};

export function DesktopProductGrid({
  className = "hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5",
  products,
  shippingBadge = "envios a nivel nacional",
}: DesktopProductGridProps) {
  return (
    // Seccion escritorio: conserva la grilla y ProductCard actuales.
    <div className={className}>
      {products.map((product) => (
        <ProductCardBase key={product.id} product={product} shippingBadge={shippingBadge} />
      ))}
    </div>
  );
}
