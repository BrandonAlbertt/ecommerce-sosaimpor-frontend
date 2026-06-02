import { RotateCcw } from "lucide-react";

import type { Product, ProductPagination, ProductSortOrder } from "@/features/products/types/product.types";

import { DesktopProductGrid } from "@/components/escritorio/productos/DesktopProductGrid";
import { MobileProductGrid } from "@/components/movil/productos/MobileProductGrid";

type ProductGridProps = {
  error?: string | null;
  hasMoreMobileProducts?: boolean;
  isLoading?: boolean;
  mobileEyebrow?: string;
  mobileProducts?: Product[];
  onLoadMoreMobile?: () => void;
  onPageChange?: (page: number) => void;
  onResetFilters?: () => void;
  onSortChange?: (sortOrder: ProductSortOrder | "") => void;
  pagination?: ProductPagination | null;
  products: Product[];
  showSort?: boolean;
  sortOrder?: ProductSortOrder | "";
  summaryLabel?: string;
};

export function ProductGrid({ 
  error = null, 
  hasMoreMobileProducts = false,
  isLoading = false, 
  mobileEyebrow = "Destacados",
  mobileProducts,
  onLoadMoreMobile,
  onPageChange,
  onResetFilters,
  onSortChange,
  pagination = null, 
  products,
  showSort = true,
  sortOrder = "",
  summaryLabel = "productos encontrados",
}: ProductGridProps) {
  const visibleCount = products.length;
  const totalCount = pagination?.total ?? visibleCount;
  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <section className="w-full max-w-full overflow-hidden bg-white transition-colors duration-300 dark:bg-zinc-950 md:rounded-xl md:border md:border-zinc-200 md:bg-white md:p-4 md:shadow-sm md:dark:border-zinc-800 md:dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between gap-3 md:mb-4">
        <div>
          <p className="text-xs font-black uppercase text-red-600 dark:text-red-400 md:hidden">{mobileEyebrow}</p>
          <p className="text-sm text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
            {isLoading
              ? "Cargando productos..."
              : `${totalCount} ${summaryLabel}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onResetFilters && (
            <button
              aria-label="Restablecer lista"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-colors hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:text-red-400"
              disabled={isLoading}
              onClick={onResetFilters}
              title="Restablecer lista"
              type="button"
            >
              <RotateCcw size={16} suppressHydrationWarning />
            </button>
          )}
          {showSort && (
            <label className="hidden items-center gap-2 text-xs font-bold text-zinc-700 transition-colors duration-300 dark:text-zinc-300 sm:flex">
              Ordenar por:
              <select
                className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-600 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                onChange={(event) => onSortChange?.(event.target.value as ProductSortOrder | "")}
                value={sortOrder}
              >
                <option value="">Mas relevantes</option>
                <option value="precio_asc">Menor precio</option>
                <option value="precio_desc">Mayor precio</option>
              </select>
            </label>
          )}
        </div>
      </div>

      {/* Componentes compartidos: los datos viven aqui y las variantes solo cambian la presentacion. */}
      {error && (
        <p className="px-1 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <MobileProductGrid
        hasMoreProducts={hasMoreMobileProducts}
        isLoadingMore={isLoading && Boolean(mobileProducts?.length)}
        onLoadMore={onLoadMoreMobile}
        products={mobileProducts ?? products}
      />
      <DesktopProductGrid products={products} />

      {pagination && totalPages > 1 && (
        <div className="mt-4 hidden flex-wrap items-center justify-center gap-2 md:flex">
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
