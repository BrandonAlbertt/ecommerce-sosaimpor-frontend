import { DesktopCategoryGrid } from "./desktop/DesktopCategoryGrid";
import { MobileCategoryCarousel } from "./mobile/MobileCategoryCarousel";

export type CategoryItem = {
  name: string;
  color: string;
};

const categories: CategoryItem[] = [
  { name: "Motores", color: "border-t-blue-700" },
  { name: "Faros", color: "border-t-amber-500" },
  { name: "Parachoques", color: "border-t-slate-700" },
  { name: "Suspension", color: "border-t-teal-600" },
  { name: "Frenos", color: "border-t-red-700" },
  { name: "Interior", color: "border-t-orange-900" },
  { name: "Llantas", color: "border-t-blue-800" },
  { name: "Accesorios", color: "border-t-purple-700" },
];

export function CategoryStrip() {
  return (
    <section className="w-full max-w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 md:rounded-xl md:p-4">
      <div className="mb-3 flex items-center justify-between md:mb-4">
        <h2 className="text-sm font-black uppercase text-zinc-950 dark:text-zinc-100">CATEGORIAS DESTACADAS</h2>
        <span className="hidden text-xs font-semibold text-zinc-500 dark:text-zinc-400 sm:block">Ver todas las categorías</span>
      </div>

      {/* Componentes compartidos: las categorias se definen aqui y cada breakpoint decide la vista. */}
      <MobileCategoryCarousel categories={categories} />
      <DesktopCategoryGrid categories={categories} />
    </section>
  );
}
