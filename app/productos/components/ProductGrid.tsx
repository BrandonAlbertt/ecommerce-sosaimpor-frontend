import type { Product } from "@/features/products/types/product.types";

import { DesktopProductGrid } from "./desktop/DesktopProductGrid";
import { MobileProductGrid } from "./mobile/MobileProductGrid";

export const mockProducts: Product[] = [
  {
    id: "1",
    slug: "motor-2-0-turbo",
    name: "Motor 2.0 Turbo",
    category: "Motores",
    description: "Importado · Gasolina · Automático",
    year: "2015 - 2019",
    price: 2450,
    availability: "Disponible",
    condition: "Usado importado",
  },
  {
    id: "2",
    slug: "faro-delantero-derecho",
    name: "Faro delantero derecho",
    category: "Faros",
    description: "Hatchback · Con proyector",
    year: "2015 - 2018",
    price: 280,
    availability: "Disponible",
    condition: "Usado importado",
  },
  {
    id: "3",
    slug: "parachoques-delantero",
    name: "Parachoques delantero",
    category: "Parachoques",
    description: "Hatchback · Color gris",
    year: "2016 - 2020",
    price: 650,
    availability: "Disponible",
    condition: "Usado local",
  },
  {
    id: "4",
    slug: "amortiguador-delantero",
    name: "Amortiguador delantero",
    category: "Suspension",
    description: "Con resorte · 2 unidades",
    year: "2016 - 2019",
    price: 320,
    availability: "Disponible",
    condition: "Reacondicionado",
  },
  {
    id: "5",
    slug: "disco-de-freno-delantero",
    name: "Disco de freno delantero",
    category: "Frenos",
    description: "Ventilado · 2 unidades",
    year: "2016 - 2019",
    price: 290,
    availability: "Disponible",
    condition: "Usado importado",
  },
];

export function ProductGrid() {
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
      <MobileProductGrid products={mockProducts} />
      <DesktopProductGrid products={mockProducts} />
    </section>
  );
}
