"use client";

import { X } from "lucide-react";

import { ProductFilters } from "../ProductFilters";

type MobileFilterDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileFilterDrawer({ open, onClose }: MobileFilterDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    // Seccion movil: drawer que reutiliza los mismos filtros compartidos de escritorio.
    <div className="fixed inset-0 z-[60] md:hidden">
      <button
        aria-label="Cerrar filtros"
        className="absolute inset-0 bg-zinc-950/45"
        onClick={onClose}
        type="button"
      />
      <aside className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-2xl border-t border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase text-red-600 dark:text-red-400">Busqueda avanzada</p>
            <h2 className="text-lg font-black text-zinc-950 dark:text-zinc-100">Filtros y categorias</h2>
          </div>
          <button
            aria-label="Cerrar filtros"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            onClick={onClose}
            type="button"
          >
            <X size={18} suppressHydrationWarning />
          </button>
        </div>
        <ProductFilters />
      </aside>
    </div>
  );
}
