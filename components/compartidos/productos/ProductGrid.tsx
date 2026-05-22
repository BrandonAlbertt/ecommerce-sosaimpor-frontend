import type { Product } from "@/features/products/types/product.types";

import { DesktopProductGrid } from "@/components/escritorio/productos/DesktopProductGrid";
import { MobileProductGrid } from "@/components/movil/productos/MobileProductGrid";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="w-full max-w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 md:rounded-xl md:p-4">
      <div className="mb-3 flex items-center justify-between gap-3 md:mb-4">
        <div>
          <p className="text-xs font-black uppercase text-red-600 dark:text-red-400 md:hidden">Destacados</p>
          <p className="text-sm text-zinc-600 transition-colors duration-300 dark:text-zinc-400">Mostrando 24 de 155 productos</p>
        </div>
        <label className="hidden items-center gap-2 text-xs font-bold text-zinc-700 transition-colors duration-300 dark:text-zinc-300 sm:flex">
          Ordenar por:
          <select className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-600 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <option>Más relevantes</option>
            <option>Menor precio</option>
            <option>Mayor precio</option>
          </select>
        </label>
      </div>

      {/* Componentes compartidos: los datos viven aqui y las variantes solo cambian la presentacion. */}
      <MobileProductGrid products={products} />
      <DesktopProductGrid products={products} />
    </section>
  );
}
