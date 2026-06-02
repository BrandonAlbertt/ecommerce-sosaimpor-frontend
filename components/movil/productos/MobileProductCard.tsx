import Link from "next/link";
import Image from "next/image";
import { Truck } from "lucide-react";

import type { Product } from "@/features/products/types/product.types";
import { getCatalogProductImage } from "@/features/products/utils/productImage";

type MobileProductCardProps = {
  product: Product;
};

const badgeColors: Record<string, string> = {
  Accesorios: "bg-purple-700",
  "Aros y Llantas": "bg-blue-800",
  Capos: "bg-zinc-700",
  Espejos: "bg-cyan-700",
  Motores: "bg-blue-800",
  Motor: "bg-blue-800",
  Faros: "bg-amber-500",
  Parachoques: "bg-slate-700",
  Suspension: "bg-teal-600",
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
  Transmision: "bg-rose-800",
  Vidrios: "bg-blue-600",
};

export function MobileProductCard({ product }: MobileProductCardProps) {
  return (
    // Seccion movil: card compacta tipo marketplace para escanear rapido.
    <article className="relative w-full max-w-full overflow-hidden bg-white dark:bg-zinc-950">
      <Link
        aria-label={`Ver detalle de ${product.name}`}
        className="absolute inset-0 z-10 rounded-xl"
        href={`/productos/${product.slug}`}
      />

      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
        <div className="flex h-full items-center justify-center text-[11px] font-black text-zinc-400 dark:text-zinc-500">
          {product.image ? (
            <Image
              alt={product.name}
              className="h-full w-full object-cover"
              height={220}
              quality={45}
              sizes="50vw"
              src={getCatalogProductImage(product.image)}
              width={220}
            />
          ) : (
            "IMAGEN"
          )}
        </div>
      </div>

      <div className="min-w-0 pt-1.5">
        <h3 className="line-clamp-1 max-w-full break-words text-[13px] font-medium leading-5 text-zinc-950 dark:text-zinc-100">
          <span
            className={`mr-1 inline-flex rounded px-1.5 py-0.5 align-middle text-[10px] font-black leading-none text-white ${
              product.categoryColor ? "" : badgeColors[product.category] ?? "bg-yellow-300"
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
          {product.name}
        </h3>

        <p className="mt-1 flex min-w-0 items-center gap-1 truncate text-[12px] font-semibold leading-4 text-emerald-700 dark:text-emerald-400">
          <Truck size={12} suppressHydrationWarning />
          Recojo gratis en taller
        </p>

        <p className="mt-1 text-[22px] font-black leading-7 text-zinc-950 dark:text-zinc-100">
          <span className="text-[15px]">S/</span>
          {product.price.toLocaleString("es-PE")}
        </p>

        <p className="truncate text-[12px] leading-4 text-zinc-500 dark:text-zinc-400">
          {product.availability} · {product.condition}
        </p>
      </div>
    </article>
  );
}
