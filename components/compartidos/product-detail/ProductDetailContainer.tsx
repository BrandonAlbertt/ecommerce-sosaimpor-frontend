"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { SuggestionModal } from "@/components/compartidos/layout/SuggestionModal";
import { StoreLocationModal } from "@/components/compartidos/layout/StoreLocationModal";
import { DesktopHeader } from "@/components/escritorio/layout/DesktopHeader";
import { MobileAppChrome } from "@/components/movil/layout/MobileAppChrome";
import { MobileProductDetail } from "@/components/movil/productos/MobileProductDetail";
import { useComment } from "@/features/comments/hooks/useComment";
import { useProductDetail } from "@/features/products/hooks/useProductDetail";
import { useProductRaiz } from "@/features/products/hooks/useProductRaiz";
import { useProductSearchNavigation } from "@/features/products/hooks/useProductSearchNavigation";
import { apiProductToProduct, apiProductToProductDetail } from "@/features/products/utils/productAdapter";
import { storeLocation } from "@/features/store/storeLocation";

import { ProductGrid } from "../productos/ProductGrid";
import { DesktopProductAside } from "./DesktopProductAside";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductShareModal } from "./ProductShareModal";

type ProductDetailContainerProps = {
  slug: string;
};

export function ProductDetailContainer({ slug }: ProductDetailContainerProps) {
  const [locationOpen, setLocationOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const comment = useComment();
  const detail = useProductDetail(slug);
  const { productSearch } = useProductSearchNavigation();
  const whatsappPhone = "51924516682";
  const supportWhatsappUrl = `https://wa.me/${whatsappPhone}`;
  const openLocation = useCallback(() => setLocationOpen(true), []);
  const closeLocation = useCallback(() => setLocationOpen(false), []);
  const openSuggestion = useCallback(() => setSuggestionOpen(true), []);
  const closeSuggestion = useCallback(() => {
    setSuggestionOpen(false);
    comment.resetCommentState();
  }, [comment]);
  const closeShareModal = useCallback(() => setShareModalOpen(false), []);
  const handleSuggestionSubmit = useCallback(async () => {
    const response = await comment.submitComment(suggestionMessage);

    if (response) {
      setSuggestionMessage("");
    }
  }, [comment, suggestionMessage]);
  const getProductShareUrl = useCallback(() => {
    if (typeof window === "undefined") {
      return `/productos/${slug}`;
    }

    return window.location.href;
  }, [slug]);
  const product = useMemo(
    () => detail.product ? apiProductToProductDetail(detail.product) : null,
    [detail.product],
  );
  const currentProductUrl = typeof window === "undefined" ? "" : window.location.href;
  const whatsappUrl = useMemo(() => {
    if (!product) {
      return `https://wa.me/${whatsappPhone}`;
    }

    const message = [
      "Hola, quiero consultar por este producto:",
      `Producto: ${product.name}`,
      `Codigo: ${product.code ?? product.slug.toUpperCase()}`,
      `Precio: S/ ${product.price.toLocaleString("es-PE")}.00`,
      currentProductUrl ? `Link: ${currentProductUrl}` : null,
      "Consulta: Quisiera mas informacion.",
    ].filter(Boolean).join("\n");

    return `https://wa.me/${whatsappPhone}?${new URLSearchParams({ text: message }).toString()}`;
  }, [currentProductUrl, product]);
  const relatedProductsState = useProductRaiz(
    {
      categoria_id: detail.product?.categoria_id,
      limit: 5,
      page: 1,
    },
    { enabled: Boolean(detail.product?.categoria_id) },
  );
  const relatedProducts = useMemo(
    () => relatedProductsState.products
      .filter((relatedProduct) => relatedProduct.id !== detail.product?.id)
      .map(apiProductToProduct)
      .slice(0, 4),
    [detail.product?.id, relatedProductsState.products],
  );
  const openDesktopShareModal = useCallback(() => {
    setShareCopied(false);
    setShareUrl(getProductShareUrl());
    setShareModalOpen(true);
  }, [getProductShareUrl]);
  const copyShareUrl = useCallback(async () => {
    const urlToCopy = shareUrl || getProductShareUrl();

    try {
      await navigator.clipboard.writeText(urlToCopy);
      setShareCopied(true);
    } catch {
      setShareCopied(false);
    }
  }, [getProductShareUrl, shareUrl]);
  const shareProductOnMobile = useCallback(async () => {
    if (!product) {
      return;
    }

    const url = getProductShareUrl();
    const shareText = `Mira este producto de SOSA IMPORT: ${product.name}\n${url}`;
    const shareData = {
      text: shareText,
      title: product.name,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        try {
          await navigator.share({
            text: shareText,
            title: product.name,
          });
        } catch {
          return;
        }
      }

      return;
    }
  }, [getProductShareUrl, product]);

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-zinc-950">
      <MobileAppChrome productSearch={productSearch} />
      <DesktopHeader onLocationClick={openLocation} productSearch={productSearch} />
      <StoreLocationModal
        location={storeLocation}
        onClose={closeLocation}
        open={locationOpen}
      />
      <SuggestionModal
        error={comment.error}
        isSubmitting={comment.isSubmitting}
        message={suggestionMessage}
        onChangeMessage={setSuggestionMessage}
        onClose={closeSuggestion}
        onSubmit={handleSuggestionSubmit}
        open={suggestionOpen}
        successMessage={comment.successMessage}
      />
      <ProductShareModal
        copied={shareCopied}
        onClose={closeShareModal}
        onCopy={copyShareUrl}
        open={shareModalOpen}
        productName={product?.name ?? "Producto"}
        shareUrl={shareUrl}
      />
      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-28 pt-[8.75rem] md:py-6">
        {detail.isLoading && (
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm font-semibold text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            Cargando producto...
          </section>
        )}

        {!detail.isLoading && detail.error && (
          <section className="rounded-2xl border border-red-200 bg-white p-6 text-sm font-semibold text-red-600 shadow-sm dark:border-red-900 dark:bg-zinc-900 dark:text-red-400">
            {detail.error}
          </section>
        )}

        {!detail.isLoading && product && (
          <>
            <MobileProductDetail
              onShareClick={shareProductOnMobile}
              onSuggestionClick={openSuggestion}
              product={product}
              whatsappUrl={whatsappUrl}
            />
            <section className="md:hidden">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-black text-zinc-950 dark:text-zinc-100">
                  Productos relacionados
                </h2>
                <Link className="text-xs font-black text-red-600 dark:text-red-400" href="/productos">
                  Ver todos
                </Link>
              </div>
              <ProductGrid
                error={relatedProductsState.error}
                isLoading={relatedProductsState.isLoading}
                mobileEyebrow="Relacionados"
                products={relatedProducts}
                showSort={false}
                summaryLabel="productos relacionados"
              />
            </section>
            <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.86fr)_260px] lg:gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.9fr)_300px] xl:gap-7">
              <nav className="col-span-3 flex min-w-0 items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                <Link href="/">Inicio</Link>
                <span>/</span>
                <Link href="/productos">Categorias</Link>
                <span>/</span>
                <span className="truncate">{product.category}</span>
                <span>/</span>
                <strong className="truncate text-zinc-900 dark:text-zinc-100">{product.name}</strong>
              </nav>

              <ProductGallery key={product.id} product={product} />
              <ProductInfo
                onShareClick={openDesktopShareModal}
                product={product}
                whatsappUrl={whatsappUrl}
              />
              <DesktopProductAside
                onLocationClick={openLocation}
                onSuggestionClick={openSuggestion}
                supportWhatsappUrl={supportWhatsappUrl}
              />

              <section className="col-span-2 self-start rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="border-b border-zinc-200 pb-3 text-lg font-black text-zinc-950 dark:border-zinc-800 dark:text-zinc-100">
                  Especificaciones
                </h2>
                <dl className="mt-4 grid gap-3 text-sm lg:grid-cols-2">
                  {(product.specifications.length > 0
                    ? product.specifications.map((specification) => [specification.name, specification.value])
                    : [
                        ["Categoria", product.category],
                        ["Anio compatible", product.year],
                        ["Codigo de producto", product.code ?? product.slug.toUpperCase()],
                        ["Condicion", product.condition],
                        ["Disponibilidad", product.availability],
                        ["Recojo", "En taller"],
                      ]
                  ).map(([label, value]) => (
                    <div
                      className="grid grid-cols-[0.85fr_1.15fr] overflow-hidden rounded-lg border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                      key={label}
                    >
                      <dt className="bg-zinc-50 px-3 py-2.5 font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                        {label}
                      </dt>
                      <dd className="px-3 py-2.5 font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-black text-zinc-950 transition-colors duration-300 dark:text-zinc-100">
                    Productos relacionados
                  </h2>
                  <Link className="text-sm font-black text-red-600 dark:text-red-400" href="/productos">
                    Ver todos
                  </Link>
                </div>
                <ProductGrid
                  error={relatedProductsState.error}
                  isLoading={relatedProductsState.isLoading}
                  products={relatedProducts}
                  showSort={false}
                  summaryLabel="productos relacionados"
                />
              </section>
            </div>

            <div className="hidden gap-6 md:grid lg:hidden md:grid-cols-[0.95fr_1.05fr]">
              <ProductGallery key={product.id} product={product} />
              <div className="space-y-6">
                <ProductInfo
                  onShareClick={openDesktopShareModal}
                  product={product}
                  whatsappUrl={whatsappUrl}
                />
                <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="text-xl font-black text-zinc-950 dark:text-zinc-100">Especificaciones</h2>
                  <dl className="mt-4 overflow-hidden rounded-xl border border-zinc-100 text-sm dark:border-zinc-800">
                    {(product.specifications.length > 0
                      ? product.specifications.map((specification) => [specification.name, specification.value])
                      : [
                          ["Categoria", product.category],
                          ["Anio compatible", product.year],
                          ["Codigo de producto", product.code ?? product.slug.toUpperCase()],
                          ["Condicion", product.condition],
                          ["Disponibilidad", product.availability],
                          ["Recojo", "En taller"],
                        ]
                    ).map(([label, value]) => (
                      <div
                        className="grid grid-cols-[0.36fr_0.64fr] border-b border-zinc-100 last:border-b-0 dark:border-zinc-800"
                        key={label}
                      >
                        <dt className="bg-zinc-50 px-4 py-3 font-black text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                          {label}
                        </dt>
                        <dd className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </div>
              <section className="col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-black text-zinc-950 transition-colors duration-300 dark:text-zinc-100">
                    Productos relacionados
                  </h2>
                  <Link className="text-sm font-black text-red-600 dark:text-red-400" href="/productos">
                    Ver todos
                  </Link>
                </div>
                <ProductGrid
                  error={relatedProductsState.error}
                  isLoading={relatedProductsState.isLoading}
                  products={relatedProducts}
                  showSort={false}
                  summaryLabel="productos relacionados"
                />
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
