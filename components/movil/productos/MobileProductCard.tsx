import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";

import type { Product } from "@/features/products/types/product.types";
import { getCatalogProductImage } from "@/features/products/utils/productImage";

type MobileProductCardProps = {
  product: Product;
};

const badgeColors: Record<string, string> = {
  Accesorios: "bg-purple-700",
  "Aros y Llantas": "bg-blue-800",
  Capós: "bg-zinc-700",
  Espejos: "bg-cyan-700",
  Motores: "bg-blue-800",
  Motor: "bg-blue-800",
  Faros: "bg-amber-500",
  Parachoques: "bg-slate-700",
  Suspension: "bg-teal-600",
  Suspensión: "bg-teal-600",
  Frenos: "bg-red-700",
  Guardafangos: "bg-lime-700",
  Interiores: "bg-orange-900",
  Maleteras: "bg-fuchsia-800",
  Manijas: "bg-stone-700",
  Molduras: "bg-neutral-700",
  Neblineros: "bg-indigo-700",
  Puertas: "bg-emerald-700",
  Radiadores: "bg-sky-800",
  Rejillas: "bg-violet-800",
  Transmisión: "bg-rose-800",
  Vidrios: "bg-blue-600",
};

export function MobileProductCard({ product }: MobileProductCardProps) {
  return (
    // Seccion movil: card compacta y tactil para escanear productos rapido.
    <article className="w-full max-w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <Link className="block" href={`/productos/${product.slug}`}>
        <div className="relative aspect-[4/3] max-h-48 min-h-36 w-full bg-zinc-50 dark:bg-zinc-800">
          <span
            className={`absolute left-2 top-2 z-10 rounded-full px-2 py-1 text-[9px] font-black uppercase text-white ${
              product.categoryColor ? "" : badgeColors[product.category] ?? "bg-zinc-800"
            }`}
            style={
              product.categoryColor
                ? {
                    backgroundColor: product.categoryColor,
                    color: product.categoryTextColor ?? "#FFFFFF",
                  }
                : undefined
            }
          >
            {product.category}
          </span>
          <button
            aria-label="Agregar a favoritos"
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white/95 text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-300"
            type="button"
          >
            <Heart size={16} suppressHydrationWarning />
          </button>
          <div className="flex h-full items-center justify-center text-[11px] font-black text-zinc-400 dark:text-zinc-500">
            {product.image ? (
              <Image
                alt={product.name}
                className="h-full w-full object-cover"
                height={180}
                quality={45}
                sizes="(max-width: 767px) 50vw, 180px"
                src={getCatalogProductImage(product.image)}
                width={240}
              />
            ) : (
              "IMAGEN"
            )}
          </div>
        </div>
      </Link>

      <div className="min-w-0 space-y-2 p-3">
        <Link href={`/productos/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-9 max-w-full break-words text-sm font-black leading-tight text-zinc-950 dark:text-zinc-100">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 max-w-full break-words text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{product.description}</p>
        <div className="grid min-w-0 gap-1">
          <p className="text-base font-black text-zinc-950 dark:text-zinc-100">S/ {product.price.toLocaleString("es-PE")}</p>
          <p className="max-w-full break-words text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">{product.availability}</p>
        </div>
        <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Año: {product.year}</p>
        <button
          className="flex h-10 w-full max-w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-3 text-xs font-black text-white shadow-sm transition-colors hover:bg-red-700"
          type="button"
        >
          <ShoppingCart size={16} suppressHydrationWarning />
          Agregar
        </button>
      </div>
    </article>
  );
}
