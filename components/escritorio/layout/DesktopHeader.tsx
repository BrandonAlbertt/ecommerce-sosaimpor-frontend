"use client";

import Link from "next/link";

import { ProductSearch } from "@/components/compartidos/layout/ProductSearch";
import type { ProductSearchModel } from "@/components/compartidos/layout/ProductSearch";
import { ThemeToggle } from "@/components/compartidos/layout/ThemeToggle";
import { Button } from "@/components/compartidos/ui/Button";
import { Input } from "@/components/compartidos/ui/Input";

type DesktopHeaderProps = {
  productSearch?: ProductSearchModel;
};

export function DesktopHeader({ productSearch }: DesktopHeaderProps) {
  return (
    // Header escritorio: se mantiene igual y se oculta en movil.
    <header className="sticky top-0 z-40 hidden border-b border-zinc-200 bg-white/95 backdrop-blur transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950/95 md:block">
      <div className="border-b border-zinc-100 px-4 py-2 text-xs text-zinc-700 transition-colors duration-300 dark:border-zinc-800 dark:text-zinc-400">
        <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span>Compra online y recoge en taller</span>
            <span className="rounded bg-red-600 px-3 py-1 text-[11px] font-black text-white">
              SIN ENVIOS
            </span>
            <span>Solo recojo en tienda</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>Necesitas ayuda?</span>
            <span className="font-bold">+51 987 654 321</span>
            <span>Lun - Vie: 8:00 am - 6:00 pm</span>
            <span>Sab: 8:00 am - 1:00 pm</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1920px] gap-4 px-4 py-4 lg:grid-cols-[270px_180px_1fr_150px_170px_60px] lg:items-center">
        <div className="flex items-center justify-between gap-3">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex h-14 w-28 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-black text-zinc-500 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              LOGO
            </div>
            <span className="sr-only">SOSA IMPORT</span>
          </Link>
          <Link className="lg:hidden" href="/carrito">
            <Button className="h-10" variant="secondary">
              Carrito
            </Button>
          </Link>
        </div>

        <Button className="justify-start" variant="ghost">
          <span className="text-xl leading-none">☰</span>
          Categorias
        </Button>

        {productSearch ? (
          <ProductSearch model={productSearch} />
        ) : (
          <Input
            aria-label="Buscar repuestos"
            className="h-12"
            placeholder="Buscar repuestos por nombre, categoria, marca, modelo..."
          />
        )}

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

        <ThemeToggle />
      </div>
    </header>
  );
}
