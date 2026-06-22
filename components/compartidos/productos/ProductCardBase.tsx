import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";

import { Product } from "@/features/products/types/product.types";
import { getCatalogProductImage } from "@/features/products/utils/productImage";

type ProductCardBaseProps = {
  product: Product;
  shippingBadge?: string;
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

export function ProductCardBase({
  product,
  shippingBadge = "envios a nivel nacional",
}: ProductCardBaseProps) {
  const conditionLabel = product.condition.replace(" importado", "");

  return (
    <article className="relative flex h-full flex-col rounded-lg border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link
        aria-label={`Ver detalle de ${product.name}`}
        className="absolute inset-0 z-10 rounded-lg"
        href={`/productos/${product.slug}`}
      />

      <div className="relative p-3">
        <span
          className={`absolute left-3 top-3 z-20 rounded px-2 py-1 text-[10px] font-black uppercase text-white ${
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
        <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-lg bg-zinc-50 text-[11px] font-black text-zinc-400 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-500">
          {product.image ? (
            <Image
              alt={product.name}
              className="h-full w-full object-contain"
              height={144}
              quality={45}
              sizes="(min-width: 1280px) 220px, 180px"
              src={getCatalogProductImage(product.image)}
              width={220}
            />
          ) : (
            "IMAGEN PRODUCTO"
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-2 px-3 pb-3">
        <h3 className="text-sm font-black leading-tight text-zinc-950 transition-colors duration-300 dark:text-zinc-100">
          {product.name}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{product.description}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Año: {product.year}</p>
        <p className="text-base font-black text-zinc-950 dark:text-zinc-100">S/ {product.price.toLocaleString("es-PE")}.00</p>
        <div className="space-y-1 text-[11px] font-bold uppercase">
          <p className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {product.availability}
          </p>
          <p className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {shippingBadge}
          </p>
          <p className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {conditionLabel}
          </p>
        </div>
        <Link
          className="relative z-20 mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm font-black text-zinc-900 shadow-sm transition-colors duration-300 hover:border-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-red-500 dark:hover:bg-red-600 dark:focus:ring-offset-zinc-950"
          href={`/productos/${product.slug}`}
        >
          <Eye size={16} suppressHydrationWarning />
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
