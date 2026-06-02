"use client";

import { useEffect, useRef } from "react";

import type { Product } from "@/features/products/types/product.types";

import { MobileProductCard } from "./MobileProductCard";

type MobileProductGridProps = {
  hasMoreProducts?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  products: Product[];
};

export function MobileProductGrid({
  hasMoreProducts = false,
  isLoadingMore = false,
  onLoadMore,
  products,
}: MobileProductGridProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasMoreProducts || isLoadingMore || !onLoadMore) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
          observer.disconnect();
        }
      },
      {
        rootMargin: "320px 0px",
      },
    );

    observer.observe(loadMoreElement);

    return () => observer.disconnect();
  }, [hasMoreProducts, isLoadingMore, onLoadMore]);

  return (
    // Seccion movil: grilla compacta de dos columnas, tipo marketplace.
    <div className="md:hidden">
      <div className="grid w-full max-w-full grid-cols-2 gap-x-2 gap-y-5">
        {products.map((product) => (
          <MobileProductCard key={product.id} product={product} />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-12">
        {isLoadingMore && (
          <p className="py-4 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Cargando mas productos...
          </p>
        )}
      </div>
    </div>
  );
}
