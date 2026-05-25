"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Menu, Moon, Search, ShoppingCart, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { ProductSearch } from "@/components/compartidos/layout/ProductSearch";
import type { ProductSearchModel } from "@/components/compartidos/layout/ProductSearch";
import { Input } from "@/components/compartidos/ui/Input";
import { useMobileFilter } from "./MobileFilterContext";

type MobileHeaderProps = {
  productSearch?: ProductSearchModel;
};

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function MobileHeader({ productSearch }: MobileHeaderProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { resolvedTheme, setTheme } = useTheme();
  const { openFilters } = useMobileFilter();
  const isDark = mounted && resolvedTheme === "dark";

  const iconButtonClass =
    "relative z-[70] flex h-10 w-10 touch-manipulation items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100";
  const nextTheme = isDark ? "light" : "dark";

  function handleThemeToggle() {
    if (!mounted) {
      return;
    }

    setTheme(nextTheme);
  }

  return (
    // Seccion movil: header compacto con marca, filtros, tema, carrito y busqueda.
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 px-4 pb-3 pt-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 md:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link className="flex min-w-0 items-center gap-2" href="/">
          <div className="flex h-10 w-20 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-xs font-black text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            LOGO
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-black uppercase text-zinc-950 dark:text-zinc-100">SOSA IMPORT</p>
            <p className="truncate text-[11px] font-semibold text-red-600 dark:text-red-400">Recojo en taller</p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label="Abrir categorias y filtros"
            className={iconButtonClass}
            onClick={openFilters}
            type="button"
          >
            <Menu size={19} suppressHydrationWarning />
          </button>
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
        </div>
      </div>

      <div className="mt-3">
        {productSearch ? (
          <ProductSearch model={productSearch} variant="mobile" />
        ) : (
          <label className="flex h-11 items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Search className="shrink-0 text-zinc-500 dark:text-zinc-400" size={18} suppressHydrationWarning />
            <Input
              aria-label="Buscar repuestos"
              className="h-9 border-0 bg-transparent px-0 text-sm shadow-none focus:border-0 focus:ring-0 dark:bg-transparent"
              placeholder="Buscar motor, faro, freno..."
            />
          </label>
        )}
      </div>
    </header>
  );
}
