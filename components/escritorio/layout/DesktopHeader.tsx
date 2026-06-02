"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { MapPin, MessageCircle } from "lucide-react";
import { useTheme } from "next-themes";

import { ProductSearch } from "@/components/compartidos/layout/ProductSearch";
import { ThemeToggle } from "@/components/compartidos/layout/ThemeToggle";
import { Button } from "@/components/compartidos/ui/Button";
import type { ProductSearchModel } from "@/features/products/types/productSearch.types";

type DesktopHeaderProps = {
  content?: DesktopHeaderContent;
  onLocationClick?: () => void;
  productSearch: ProductSearchModel;
};

export type DesktopHeaderContent = {
  helpLabel: string;
  locationLabel: string;
  locationSubLabel: string;
  phoneLabel: string;
  primaryMessage: string;
  scheduleFriday: string;
  scheduleSaturday: string;
  shippingBadge: string;
  secondaryMessage: string;
  whatsappLabel: string;
  whatsappSubLabel: string;
  whatsappUrl: string;
};

const defaultHeaderContent: DesktopHeaderContent = {
  helpLabel: "Necesitas ayuda?",
  locationLabel: "Ubicacion",
  locationSubLabel: "Ver en mapa",
  phoneLabel: "+51 924 516 682",
  primaryMessage: "Compra online y recoge en taller",
  scheduleFriday: "Lun - Vie: 8:00 am - 6:00 pm",
  scheduleSaturday: "Sab: 8:00 am - 1:00 pm",
  shippingBadge: "SIN ENVIOS",
  secondaryMessage: "Solo recojo en tienda",
  whatsappLabel: "WhatsApp",
  whatsappSubLabel: "Atencion rapida",
  whatsappUrl: "https://wa.me/51924516682",
};

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function DesktopHeader({
  content = defaultHeaderContent,
  onLocationClick,
  productSearch,
}: DesktopHeaderProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { resolvedTheme } = useTheme();
  const showDarkLogo = mounted && resolvedTheme === "dark";

  return (
    // Header escritorio fijo: se mantiene visible al bajar y reserva su altura.
    <>
      <header className="fixed inset-x-0 top-0 z-40 hidden border-b border-zinc-200 bg-white/95 backdrop-blur transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950/95 md:block">
        <div className="border-b border-zinc-100 px-4 py-2 text-xs text-zinc-700 transition-colors duration-300 dark:border-zinc-800 dark:text-zinc-400">
          <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span>{content.primaryMessage}</span>
              <span className="rounded bg-red-600 px-3 py-1 text-[11px] font-black text-white">
                {content.shippingBadge}
              </span>
              <span>{content.secondaryMessage}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span>{content.helpLabel}</span>
              <span className="font-bold">{content.phoneLabel}</span>
              <span>{content.scheduleFriday}</span>
              <span>{content.scheduleSaturday}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1920px] gap-4 px-4 py-4 lg:grid-cols-[270px_minmax(0,1fr)_164px_164px_60px] lg:items-center">
          <div className="flex items-center justify-between gap-3">
            <Link className="flex items-center" href="/">
              <div className="relative h-14 w-56 overflow-hidden">
                <Image
                  alt=""
                  className={`scale-110 object-contain transition-opacity duration-300 ${showDarkLogo ? "opacity-0" : "opacity-100"}`}
                  fill
                  priority
                  sizes="224px"
                  src="/logo-imagen-claro.webp"
                />
                <Image
                  alt=""
                  className={`scale-110 object-contain transition-opacity duration-300 ${showDarkLogo ? "opacity-100" : "opacity-0"}`}
                  fill
                  priority
                  sizes="224px"
                  src="/logo-imagen-oscuro.webp"
                />
              </div>
            </Link>
            <Link className="lg:hidden" href="/carrito">
              <Button className="h-10" variant="secondary">
                Carrito
              </Button>
            </Link>
          </div>

          <ProductSearch model={productSearch} />

          <a
            className="hidden h-12 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 text-zinc-950 shadow-sm transition-colors duration-300 hover:border-green-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 lg:flex"
            href={content.whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="h-6 w-6 shrink-0 text-green-600 dark:text-green-400" suppressHydrationWarning />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-black">{content.whatsappLabel}</span>
              <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">{content.whatsappSubLabel}</span>
            </span>
          </a>

          <button
            className="hidden h-12 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 text-zinc-950 shadow-sm transition-colors duration-300 hover:border-red-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 lg:flex"
            onClick={onLocationClick}
            type="button"
          >
            <MapPin className="h-6 w-6 shrink-0 text-red-600 dark:text-red-400" suppressHydrationWarning />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-black">{content.locationLabel}</span>
              <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">{content.locationSubLabel}</span>
            </span>
          </button>

          {/*
          <div className="hidden leading-tight lg:block">
            <p className="text-sm font-black text-zinc-950 dark:text-zinc-100">Mi cuenta</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Iniciar sesion</p>
          </div>

          <Link className="hidden lg:block" href="/carrito">
            <div className="rounded-xl border border-zinc-200 bg-white px-4 py-2 leading-tight transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-black text-zinc-950 dark:text-zinc-100">
                Mi carrito <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">3</span>
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">S/ 2,650.00</p>
            </div>
          </Link>
          */}

          <ThemeToggle />
        </div>
      </header>
      <div aria-hidden="true" className="hidden h-[137px] md:block" />
    </>
  );
}
