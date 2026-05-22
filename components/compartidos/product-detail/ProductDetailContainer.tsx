import { DesktopFooter } from "@/components/escritorio/layout/DesktopFooter";
import { DesktopHeader } from "@/components/escritorio/layout/DesktopHeader";
import { catalogProducts } from "@/features/products/data/catalogData";

import { ProductGrid } from "../productos/ProductGrid";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";

export function ProductDetailContainer() {
  return (
    <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-zinc-950">
      <DesktopHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <ProductGallery />
          <ProductInfo />
        </div>
        <section>
          <h2 className="mb-4 text-xl font-black text-zinc-950 transition-colors duration-300 dark:text-zinc-100">Productos relacionados</h2>
          <ProductGrid products={catalogProducts} />
        </section>
      </main>
      <DesktopFooter />
    </div>
  );
}
