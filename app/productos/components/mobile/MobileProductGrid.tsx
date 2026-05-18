import type { Product } from "@/features/products/types/product.types";

import { MobileProductCard } from "./MobileProductCard";

type MobileProductGridProps = {
  products: Product[];
};

export function MobileProductGrid({ products }: MobileProductGridProps) {
  return (
    // Seccion movil: grilla tipo app, 1 columna en pantallas pequenas y 2 cuando entra bien.
    <div className="grid w-full max-w-full grid-cols-1 gap-4 md:hidden">
      {products.map((product) => (
        <MobileProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
