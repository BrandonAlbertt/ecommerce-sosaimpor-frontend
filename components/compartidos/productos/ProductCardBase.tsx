import Link from "next/link";

import { Button } from "@/components/compartidos/ui/Button";
import { Product } from "@/features/products/types/product.types";

type ProductCardBaseProps = {
  product: Product;
};

const badgeColors: Record<string, string> = {
  Motores: "bg-blue-800",
  Faros: "bg-amber-500",
  Parachoques: "bg-slate-700",
  Suspension: "bg-teal-600",
  Frenos: "bg-red-700",
};

export function ProductCardBase({ product }: ProductCardBaseProps) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative p-3">
        <span
          className={`absolute left-3 top-3 rounded px-2 py-1 text-[10px] font-black uppercase text-white ${
            badgeColors[product.category] ?? "bg-zinc-800"
          }`}
        >
          {product.category}
        </span>
        <button
          aria-label="Agregar a favoritos"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors duration-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
          type="button"
        >
          ♡
        </button>
        <div className="flex h-36 items-center justify-center rounded-lg bg-zinc-50 text-[11px] font-black text-zinc-400 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-500">
          IMAGEN PRODUCTO
        </div>
      </div>

      <div className="space-y-2 px-3 pb-3">
        <Link href={`/productos/${product.slug}`}>
          <h3 className="text-sm font-black leading-tight text-zinc-950 transition-colors duration-300 hover:text-red-600 dark:text-zinc-100">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{product.description}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Año: {product.year}</p>
        <p className="text-base font-black text-zinc-950 dark:text-zinc-100">S/ {product.price.toLocaleString("es-PE")}.00</p>
        <div className="space-y-1 text-[11px] font-bold uppercase">
          <p className="text-emerald-600 dark:text-emerald-400">● {product.availability}</p>
          <p className="text-red-600 dark:text-red-400">● Recojo en taller</p>
        </div>
        <Button className="h-9 w-full rounded-lg text-xs" type="button" variant="secondary">
          Agregar al carrito
        </Button>
      </div>
    </article>
  );
}
