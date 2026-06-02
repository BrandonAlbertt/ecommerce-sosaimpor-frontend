import Image from "next/image";

import type { CategoryItem } from "@/features/products/types/product.types";
import { getSmallCategoryImage } from "@/features/products/utils/productImage";

type DesktopCategoryGridProps = {
  categories: CategoryItem[];
  onCategorySelect?: (category: CategoryItem) => void;
};

export function DesktopCategoryGrid({ 
  categories,
  onCategorySelect,
}: DesktopCategoryGridProps) {
  const shouldCenterCategories = categories.length <= 9;

  return (
    // Seccion escritorio: muestra hasta 9 categorias; en anchos menores funciona como carrusel.
    <div
      className={`hidden max-w-full grid-flow-col auto-cols-[104px] gap-3 overflow-x-auto scroll-smooth pb-2 md:grid lg:auto-cols-[calc((100%-4rem)/9)] lg:gap-2 xl:auto-cols-[112px] 2xl:auto-cols-[calc((100%-4rem)/9)] ${
        shouldCenterCategories ? "justify-start 2xl:justify-center" : "justify-start"
      }`}
    >
      {categories.map((category) => (
        <button
          key={category.id ?? category.slug ?? category.name}
          className={`min-w-0 rounded-xl border border-t-4 ${category.color} border-zinc-200 bg-white p-2 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900`}
          onClick={() => onCategorySelect?.(category)}
          style={{ borderTopColor: category.colorHex ?? undefined }}
          type="button"
        >
          <span className="mx-auto mb-2 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-zinc-50 text-[10px] font-black text-zinc-400 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-500">
            {category.image ? (
              <Image
                alt=""
                className="h-full w-full rounded-lg object-cover"
                height={96}
                src={getSmallCategoryImage(category.image)}
                sizes="(min-width: 1280px) 11vw, 112px"
                width={144}
              />
            ) : (
              "IMAGEN"
            )}
          </span>
          <span className="block truncate text-[11px] font-black text-zinc-950 dark:text-zinc-100 lg:text-xs">{category.name}</span>
        </button>
      ))}
    </div>
  );
}
