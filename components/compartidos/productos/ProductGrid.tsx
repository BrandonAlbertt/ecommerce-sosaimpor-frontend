import type { Product, ProductPagination } from "@/features/products/types/product.types";

import { DesktopProductGrid } from "@/components/escritorio/productos/DesktopProductGrid";
import { MobileProductGrid } from "@/components/movil/productos/MobileProductGrid";

type ProductGridProps = {
  error?: string | null;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  pagination?: ProductPagination | null;
  products: Product[];
};

export function ProductGrid({ 
  error = null, 
  isLoading = false, 
  onPageChange,
  pagination = null, 
  products 
}: ProductGridProps) {
  const visibleCount = products.length;
  const totalCount = pagination?.total ?? visibleCount;
  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <section className="w-full max-w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 md:rounded-xl md:p-4">
      <div className="mb-3 flex items-center justify-between gap-3 md:mb-4">
        <div>
          <p className="text-xs font-black uppercase text-red-600 dark:text-red-400 md:hidden">Destacados</p>
          <p className="text-sm text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
            {isLoading
              ? "Cargando productos..."
              : `${totalCount} productos encontrados`}
          </p>
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
      {error && (
        <p className="px-1 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <MobileProductGrid products={products} />
      <DesktopProductGrid products={products} />

      {pagination && totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            className="h-9 rounded-lg border border-zinc-200 px-3 text-xs font-black text-zinc-700 transition-colors hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:text-red-400"
            disabled={!pagination.hasPrevPage || isLoading}
            onClick={() => onPageChange?.(currentPage - 1)}
            type="button"
          >
            Anterior
          </button>

          {pages.map((page) => (
            <button
              aria-current={page === currentPage ? "page" : undefined}
              className={`h-9 min-w-9 rounded-lg border px-3 text-xs font-black transition-colors ${
                page === currentPage
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-zinc-200 text-zinc-700 hover:border-red-300 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:text-red-400"
              }`}
              disabled={isLoading}
              key={page}
              onClick={() => onPageChange?.(page)}
              type="button"
            >
              {page}
            </button>
          ))}

          <button
            className="h-9 rounded-lg border border-zinc-200 px-3 text-xs font-black text-zinc-700 transition-colors hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:text-red-400"
            disabled={!pagination.hasNextPage || isLoading}
            onClick={() => onPageChange?.(currentPage + 1)}
            type="button"
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}
