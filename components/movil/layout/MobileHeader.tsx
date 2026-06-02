"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { ProductSearch } from "@/components/compartidos/layout/ProductSearch";
import type { ProductSearchModel } from "@/features/products/types/productSearch.types";

type MobileHeaderProps = {
  mobileSearchInputId?: string;
  productSearch: ProductSearchModel;
};

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const animatedPaymentItems = [
  { alt: "Visa", className: "h-8 w-auto", delay: "0s", src: "/visa-imagen.svg" },
  { alt: "Plin", className: "h-6 w-auto", delay: "2.66s", src: "/plin-imagen.svg" },
  { alt: "Yape", className: "h-6 w-auto", delay: "5.33s", src: "/Yape-imagen.svg" },
];

function AnimatedHeaderIcon({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={className}>
      {animatedPaymentItems.map((item) => (
        <Image
          alt={item.alt}
          className={`absolute object-contain opacity-0 ${item.className}`}
          height={32}
          key={item.alt}
          src={item.src}
          style={{
            animation: "mobileHeaderPayment 8s infinite",
            animationDelay: item.delay,
          }}
          width={70}
        />
      ))}
      <style>
        {`
          @keyframes mobileHeaderPayment {
            0%, 25%, 100% {
              opacity: 0;
              transform: translateX(0) scale(1);
            }
            5%, 20% {
              opacity: 1;
            }
            9% {
              transform: translateX(-0.7px) scaleX(1.12);
            }
            13% {
              transform: translateX(0.7px) scaleX(1.12);
            }
            17% {
              transform: translateX(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export function MobileHeader({
  mobileSearchInputId,
  productSearch,
}: MobileHeaderProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  const iconButtonClass =
    "relative z-[70] flex h-10 w-10 touch-manipulation items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100";
  const paymentIconClass =
    "relative z-[70] mr-2 flex h-10 w-10 items-center justify-center overflow-visible";
  const nextTheme = isDark ? "light" : "dark";

  function handleThemeToggle() {
    if (!mounted) {
      return;
    }

    setTheme(nextTheme);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200 bg-white/95 px-4 pb-3 pt-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 md:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link className="flex min-w-0 items-center" href="/">
          <div className="relative h-12 w-44 shrink-0 overflow-hidden">
            <Image
              alt=""
              className={`-translate-x-3 scale-110 object-contain transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-100"}`}
              fill
              priority
              sizes="176px"
              src="/logo-imagen-claro.webp"
            />
            <Image
              alt=""
              className={`-translate-x-3 scale-110 object-contain transition-opacity duration-300 ${isDark ? "opacity-100" : "opacity-0"}`}
              fill
              priority
              sizes="176px"
              src="/logo-imagen-oscuro.webp"
            />
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <AnimatedHeaderIcon className={paymentIconClass} />
          <button
            aria-label="Cambiar tema"
            className={iconButtonClass}
            disabled={!mounted}
            onClick={handleThemeToggle}
            type="button"
          >
            {mounted ? (
              isDark ? (
                <Sun size={18} suppressHydrationWarning />
              ) : (
                <Moon size={18} suppressHydrationWarning />
              )
            ) : (
              <Sun size={18} suppressHydrationWarning />
            )}
          </button>
          {/*
            Funcion futura: acceso al carrito movil.
          <Link
            aria-label="Ir al carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm"
            href="/carrito"
          >
            <ShoppingCart size={19} suppressHydrationWarning />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-zinc-950 px-1 text-[10px] font-black text-white dark:border-zinc-950">
              3
            </span>
          </Link>
          */}
        </div>
      </div>

      <div className="mt-3">
        <ProductSearch inputId={mobileSearchInputId} model={productSearch} variant="mobile" />
      </div>
    </header>
  );
}
