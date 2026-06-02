"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import type { Product } from "@/features/products/types/product.types";
import {
  getProductDetailImage,
  getProductThumbnailImage,
} from "@/features/products/utils/productImage";

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const images = useMemo(
    () => {
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
    },
    [product.image, product.images],
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const activeImageUrl = selectedImageUrl ?? images[0]?.url ?? null;
  const showCarouselControls = images.length > 5;

  function scrollThumbnails(direction: "left" | "right") {
    const carousel = thumbnailsRef.current;

    if (!carousel) {
      return;
    }

    carousel.scrollBy({
      behavior: "smooth",
      left: direction === "left" ? -carousel.clientWidth : carousel.clientWidth,
    });
  }

  return (
    <section className="space-y-3">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
        {activeImageUrl ? (
          <Image
            alt={product.name}
            className="h-full w-full object-cover"
            height={760}
            priority
            quality={55}
            sizes="(max-width: 1023px) 100vw, 50vw"
            src={getProductDetailImage(activeImageUrl)}
            width={760}
          />
        ) : (
          <div className="flex h-48 w-64 items-center justify-center rounded-2xl bg-zinc-100 text-sm font-bold text-zinc-500 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-400">
            Imagen principal
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="flex items-center gap-2">
          {showCarouselControls && (
            <button
              aria-label="Imagenes anteriores"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:text-red-400"
              onClick={() => scrollThumbnails("left")}
              type="button"
            >
              <ChevronLeft size={18} suppressHydrationWarning />
            </button>
          )}

          <div
            className="grid min-w-0 flex-1 auto-cols-[calc((100%-2rem)/5)] grid-flow-col snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-1"
            ref={thumbnailsRef}
          >
            {images.map((image) => {
              const isActive = image.url === activeImageUrl;

              return (
                <button
                  aria-label={`Ver imagen ${image.order}`}
                  className={`aspect-square w-full shrink-0 snap-start overflow-hidden rounded-xl border bg-white text-xs font-bold text-zinc-500 transition-colors duration-300 dark:bg-zinc-900 dark:text-zinc-400 ${
                    isActive
                      ? "border-red-500 ring-2 ring-red-100 dark:border-red-500 dark:ring-red-950"
                      : "border-zinc-200 hover:border-red-300 dark:border-zinc-800 dark:hover:border-red-900"
                  }`}
                  key={image.id}
                  onClick={() => setSelectedImageUrl(image.url)}
                  type="button"
                >
                  <Image
                    alt=""
                    className="h-full w-full object-cover"
                    height={140}
                    quality={35}
                    sizes="112px"
                    src={getProductThumbnailImage(image.url)}
                    width={140}
                  />
                </button>
              );
            })}
          </div>

          {showCarouselControls && (
            <button
              aria-label="Imagenes siguientes"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:text-red-400"
              onClick={() => scrollThumbnails("right")}
              type="button"
            >
              <ChevronRight size={18} suppressHydrationWarning />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
