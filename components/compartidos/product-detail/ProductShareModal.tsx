"use client";

import { useEffect } from "react";
import { Check, Copy, Link2, X } from "lucide-react";

type ProductShareModalProps = {
  copied: boolean;
  onClose: () => void;
  onCopy: () => void;
  open: boolean;
  productName: string;
  shareUrl: string;
};

export function ProductShareModal({
  copied,
  onClose,
  onCopy,
  open,
  productName,
  shareUrl,
}: ProductShareModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-zinc-950/60 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Cerrar compartir producto"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        type="button"
      />

      <section className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 p-5 dark:border-zinc-800">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
              <Link2 size={22} suppressHydrationWarning />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-red-600 dark:text-red-400">
                Compartir producto
              </p>
              <h2 className="mt-1 truncate text-xl font-black leading-tight text-zinc-950 dark:text-zinc-100">
                {productName}
              </h2>
            </div>
          </div>
          <button
            aria-label="Cerrar modal de compartir"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:text-red-400"
            onClick={onClose}
            type="button"
          >
            <X size={18} suppressHydrationWarning />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            <input
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-semibold text-zinc-700 outline-none dark:text-zinc-200"
              readOnly
              value={shareUrl}
            />
            <button
              className="flex h-12 shrink-0 items-center justify-center gap-2 border-l border-zinc-200 px-4 text-sm font-black text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-800"
              onClick={onCopy}
              type="button"
            >
              {copied ? (
                <Check size={17} suppressHydrationWarning />
              ) : (
                <Copy size={17} suppressHydrationWarning />
              )}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
