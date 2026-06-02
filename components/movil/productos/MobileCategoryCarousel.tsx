import Image from "next/image";

import type { CategoryItem } from "@/features/products/types/product.types";
import { getSmallCategoryImage } from "@/features/products/utils/productImage";

type MobileCategoryCarouselProps = {
  categories: CategoryItem[];
  onCategorySelect?: (category: CategoryItem) => void;
};

export function MobileCategoryCarousel({ 
  categories,
  onCategorySelect,
}: MobileCategoryCarouselProps) {
  return (
    // Seccion movil: carrusel horizontal tactil para navegar categorias.
    <div className="flex max-w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-0 pb-2 md:hidden">
      {categories.map((category) => (
        <button
          key={category.id ?? category.slug ?? category.name}
          className={`w-24 shrink-0 snap-start rounded-2xl border border-t-4 ${category.color} border-zinc-200 bg-white p-2 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900`}
          onClick={() => onCategorySelect?.(category)}
          style={{ borderTopColor: category.colorHex ?? undefined }}
          type="button"
        >
          <span className="mx-auto mb-2 flex h-12 w-full items-center justify-center rounded-xl bg-zinc-50 text-[10px] font-black text-zinc-400 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-500">
            {category.image ? (
              <Image
                alt=""
                className="h-full w-full rounded-xl object-cover"
                height={48}
                src={getSmallCategoryImage(category.image)}
                sizes="96px"
                width={96}
              />
            ) : (
              "IMG"
            )}
          </span>
          <span className="block truncate text-[11px] font-black text-zinc-950 dark:text-zinc-100">{category.name}</span>
        </button>
      ))}
    </div>
  );
}
