import { DesktopCategoryGrid } from "@/components/escritorio/productos/DesktopCategoryGrid";
import { MobileCategoryCarousel } from "@/components/movil/productos/MobileCategoryCarousel";
import type { CategoryItem } from "@/features/products/types/product.types";

type CategoryStripProps = {
  categories: CategoryItem[];
  onCategorySelect?: (category: CategoryItem) => void;
};

export function CategoryStrip({ 
  categories,
  onCategorySelect,
}: CategoryStripProps) {
  return (
    <section className="w-full max-w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 md:rounded-xl md:p-4">
      <div className="mb-3 flex items-center justify-between md:mb-4">
        <h2 className="text-sm font-black uppercase text-zinc-950 dark:text-zinc-100">CATEGORIAS DESTACADAS</h2>
      </div>

      {/* Componentes compartidos: las categorias se definen aqui y cada breakpoint decide la vista. */}
      <MobileCategoryCarousel categories={categories} onCategorySelect={onCategorySelect} />
      <DesktopCategoryGrid categories={categories} onCategorySelect={onCategorySelect} />
    </section>
  );
}
