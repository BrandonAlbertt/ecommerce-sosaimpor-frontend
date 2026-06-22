"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Lightbulb,
  Home,
  MapPin,
  MessageCircle,
  PackageCheck,
  Share2,
  ShieldCheck,
  Tag,
} from "lucide-react";

import type { Product, ProductDetail } from "@/features/products/types/product.types";
import {
  getMobileProductDetailImage,
  getProductThumbnailImage,
} from "@/features/products/utils/productImage";

type MobileProductDetailProps = {
  onShareClick: () => void;
  onSuggestionClick: () => void;
  product: ProductDetail;
  whatsappUrl: string;
};

function getProductImages(product: Product) {
  if (product.images.length > 0) {
    return product.images;
  }

  if (product.image) {
    return [{
      id: "principal",
      url: product.image,
      principal: true,
      order: 1,
    }];
  }

  return [];
}

export function MobileProductDetail({
  onShareClick,
  onSuggestionClick,
  product,
  whatsappUrl,
}: MobileProductDetailProps) {
  const [detailInfoTab, setDetailInfoTab] = useState<"specifications" | "description">("specifications");
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const images = getProductImages(product);
  const selectedImage = images.find((image) => image.id === selectedImageId);
  const activeImage = selectedImage ?? images[0] ?? null;
  const mainImage = activeImage?.url ?? product.image;
  const activeImageId = activeImage?.id ?? null;
  const productSummary = [product.brand, product.model, product.year]
    .filter(Boolean)
    .join(" · ");
  const warranty = product.specifications.find((specification) => (
    specification.name.toLowerCase() === "garantía" ||
    specification.name.toLowerCase() === "garantia"
  ))?.value ?? "7 dias por falla";
  const productFacts = [
    { icon: ShieldCheck, title: "Condición", value: product.condition },
    { icon: PackageCheck, title: "Disponibilidad", value: product.stock > 0 ? "Disponible para recojo" : product.availability },
    { icon: MapPin, title: "Recojo", value: "En taller" },
    { icon: ShieldCheck, title: "Garantía", value: warranty },
    { icon: Tag, title: "Tipo", value: product.productType ?? product.category },
  ];

  return (
    <div className="space-y-4 md:hidden">
      <nav className="flex min-w-0 items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        <Home size={15} suppressHydrationWarning />
        <Link href="/">Inicio</Link>
        <span>/</span>
        <span className="truncate">{product.category}</span>
        <span>/</span>
        <strong className="truncate text-zinc-900 dark:text-zinc-100">{product.name}</strong>
      </nav>

      <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          {product.featured && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black uppercase text-white">
              Destacado
            </span>
          )}
          {mainImage ? (
            <Image
              alt={product.name}
              className="h-full w-full object-cover"
              height={640}
              priority
              quality={45}
              sizes="100vw"
              src={getMobileProductDetailImage(mainImage)}
              width={640}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-black text-zinc-400">
              Imagen producto
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                aria-label={`Ver imagen ${index + 1} de ${product.name}`}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white p-0 dark:bg-zinc-950 ${
                  image.id === activeImageId ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                }`}
                key={image.id}
                onClick={() => setSelectedImageId(image.id)}
                type="button"
              >
                <Image
                  alt=""
                  className="h-full w-full object-cover"
                  height={80}
                  quality={35}
                  sizes="64px"
                  src={getProductThumbnailImage(image.url)}
                  width={80}
                />
              </button>
            ))}
          </div>
        )}

        <div>
          <span className="inline-flex rounded-full border border-red-300 px-3 py-1 text-[11px] font-black uppercase text-red-600 dark:border-red-900 dark:text-red-400">
            {product.category}
          </span>
          <h1 className="mt-2 text-2xl font-black leading-tight text-zinc-950 dark:text-zinc-100">
            {product.name}
          </h1>
          <p className="mt-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {productSummary || product.description || "Producto seleccionado para recojo en taller."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
            <span className="rounded-lg bg-zinc-100 px-3 py-2 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              Código: {product.code ?? product.slug.toUpperCase()}
            </span>
            <span className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {product.availability}
            </span>
            <span className="rounded-lg bg-zinc-100 px-3 py-2 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              Stock: {product.stock} unidades
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-zinc-950 dark:text-zinc-100">
            S/ {product.price.toLocaleString("es-PE")}.00
          </p>
        </div>

        <div className="grid gap-2">
          <a
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-black text-white shadow-sm"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle size={18} suppressHydrationWarning />
            Consultar por WhatsApp
          </a>
          {/*
            Boton futuro: consulta directa por sistema con el admin.
          <button
            className="h-12 rounded-xl border border-red-300 text-sm font-black text-red-600 dark:border-red-900 dark:text-red-400"
            type="button"
          >
            Consultar disponibilidad
          </button>
          */}
          <div className="grid gap-2">
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
              onClick={onShareClick}
              type="button"
            >
              <Share2 size={17} suppressHydrationWarning />
              Compartir
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-5 gap-2 rounded-2xl border border-zinc-200 bg-white p-3 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {productFacts.map((fact) => {
          const Icon = fact.icon;

          return (
            <div className="min-w-0" key={fact.title}>
              <Icon className="mx-auto text-red-600 dark:text-red-400" size={18} suppressHydrationWarning />
              <p className="mt-1 truncate text-[10px] font-black text-zinc-900 dark:text-zinc-100">{fact.title}</p>
              <p className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">{fact.value}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`rounded-lg px-3 py-2 text-sm font-black transition-colors ${
              detailInfoTab === "specifications"
                ? "bg-red-600 text-white"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
            onClick={() => setDetailInfoTab("specifications")}
            type="button"
          >
            Especificaciones
          </button>
          <button
            className={`rounded-lg px-3 py-2 text-sm font-black transition-colors ${
              detailInfoTab === "description"
                ? "bg-red-600 text-white"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
            onClick={() => setDetailInfoTab("description")}
            type="button"
          >
            Descripcion
          </button>
        </div>
        {detailInfoTab === "specifications" ? (
          <dl className="mt-3 divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
          {(product.specifications.length > 0
            ? product.specifications.map((specification) => [specification.name, specification.value])
            : [
                ["Categoría", product.category],
                ["Año compatible", product.year],
                ["Código de producto", product.code ?? product.slug.toUpperCase()],
                ["Condición", product.condition],
                ["Disponibilidad", product.availability],
                ["Recojo", "En taller"],
              ]
          ).map(([label, value]) => (
            <div className="grid grid-cols-[0.9fr_1.1fr] gap-3 py-2" key={label}>
              <dt className="font-bold text-zinc-600 dark:text-zinc-400">{label}</dt>
              <dd className="font-semibold text-zinc-900 dark:text-zinc-100">{value}</dd>
            </div>
          ))}
          </dl>
        ) : (
          <p className="mt-3 whitespace-pre-line rounded-xl border border-zinc-100 bg-white px-3 py-3 text-sm font-medium leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
            {product.description || "Descripcion no disponible."}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-center shadow-sm dark:border-amber-900 dark:bg-amber-950/20">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-zinc-950 shadow-sm dark:bg-amber-500">
          <Lightbulb size={23} suppressHydrationWarning />
        </span>
        <h2 className="mt-3 text-lg font-black text-zinc-950 dark:text-zinc-100">Cuéntanos qué quieres mejorar</h2>
        <p className="mt-1 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Tu sugerencia se guardará para que el equipo la revise</p>
        <button
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-center text-sm font-black leading-tight text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400"
          onClick={onSuggestionClick}
          type="button"
        >
          <Lightbulb size={18} suppressHydrationWarning />
          Enviar sugerencia
        </button>
      </section>
    </div>
  );
}
