import type { CategoryItem } from "../CategoryStrip";

type DesktopCategoryGridProps = {
  categories: CategoryItem[];
};

export function DesktopCategoryGrid({ categories }: DesktopCategoryGridProps) {
  return (
    // Seccion escritorio: conserva la grilla visual de categorias.
    <div className="hidden grid-cols-2 gap-3 md:grid sm:grid-cols-4 xl:grid-cols-8">
      {categories.map((category) => (
        <button
          key={category.name}
          className={`rounded-lg border border-t-4 ${category.color} border-zinc-200 bg-white p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900`}
          type="button"
        >
          <span className="mx-auto mb-2 flex h-16 w-full items-center justify-center rounded-lg bg-zinc-50 text-[11px] font-black text-zinc-400 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-500">
            IMAGEN
          </span>
          <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">{category.name}</span>
        </button>
      ))}
    </div>
  );
}
