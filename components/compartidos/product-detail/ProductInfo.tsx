import { Badge } from "@/components/compartidos/ui/Badge";
import type { ProductDetail } from "@/features/products/types/product.types";
import {
  MapPin,
  MessageCircle,
  PackageCheck,
  Share2,
  ShieldCheck,
  Tag,
} from "lucide-react";

type ProductInfoProps = {
  onShareClick: () => void;
  product: ProductDetail;
  whatsappUrl: string;
};

export function ProductInfo({
  onShareClick,
  product,
  whatsappUrl,
}: ProductInfoProps) {
  const productSummary = [product.brand, product.model, product.year]
    .filter(Boolean)
    .join(" - ");
  const warranty = product.specifications.find((specification) => (
    specification.name.toLowerCase() === "garantia" ||
    specification.name.toLowerCase() === "garantía"
  ))?.value ?? "7 dias por falla";
  const productFacts = [
    { icon: ShieldCheck, title: "Condicion", value: product.condition },
    { icon: PackageCheck, title: "Disponibilidad", value: product.stock > 0 ? "Disponible para recojo" : product.availability },
    { icon: MapPin, title: "Recojo", value: "En taller" },
    { icon: ShieldCheck, title: "Garantia", value: warranty },
    { icon: Tag, title: "Tipo de producto", value: product.productType ?? product.category },
  ];

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:dark:bg-transparent">
      <Badge className="rounded-lg border border-red-300 bg-white text-red-600 ring-0 dark:border-red-900 dark:bg-zinc-950 dark:text-red-400" tone="red">
        {product.category}
      </Badge>
      <h1 className="mt-4 text-3xl font-extrabold leading-tight text-zinc-950 transition-colors duration-300 dark:text-zinc-100 xl:text-[2rem]">
        {product.name}
      </h1>
      <p className="mt-3 text-base font-semibold text-zinc-500 transition-colors duration-300 dark:text-zinc-400">
        {productSummary || product.description || "Producto seleccionado para recojo en taller."}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold">
        <span className="rounded-xl bg-zinc-100 px-4 py-2 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          Codigo: {product.code ?? product.slug.toUpperCase()}
        </span>
        <span className="rounded-xl bg-emerald-50 px-4 py-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {product.availability}
        </span>
        <span className="rounded-xl bg-zinc-100 px-4 py-2 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          Stock: {product.stock} unidades
        </span>
      </div>

      <dl className="mt-6 space-y-3 border-b border-zinc-200 pb-6 text-sm dark:border-zinc-800">
        {productFacts.map((fact) => {
          const Icon = fact.icon;

          return (
            <div className="grid grid-cols-[150px_1fr] items-center gap-4" key={fact.title}>
              <dt className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200">
                <Icon size={17} suppressHydrationWarning />
                {fact.title}:
              </dt>
              <dd className="font-medium text-zinc-600 dark:text-zinc-400">{fact.value}</dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-5 text-3xl font-extrabold text-zinc-950 transition-colors duration-300 dark:text-zinc-100 xl:text-[2rem]">
        S/ {product.price.toLocaleString("es-PE")}.00
      </p>

      <div className="mt-6 grid gap-3">
        <a
          className="flex h-13 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-red-700"
          href={whatsappUrl}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={21} suppressHydrationWarning />
          Consultar por WhatsApp
        </a>
        {/*
          Boton futuro: consulta directa por sistema con el admin.
        <button
          className="h-13 rounded-xl border border-red-300 px-5 py-3.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          type="button"
        >
          Consultar disponibilidad
        </button>
        */}
        <button
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-700 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:text-red-400"
          onClick={onShareClick}
          type="button"
        >
          <Share2 size={18} suppressHydrationWarning />
          Compartir
        </button>
      </div>
    </section>
  );
}
