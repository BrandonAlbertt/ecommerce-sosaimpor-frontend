"use client";

import { useEffect } from "react";
import { ExternalLink, MapPin, X } from "lucide-react";

import type { StoreLocation } from "@/features/store/storeLocation";

type StoreLocationModalProps = {
  location: StoreLocation;
  onClose: () => void;
  open: boolean;
};

export function StoreLocationModal({
  location,
  onClose,
  open,
}: StoreLocationModalProps) {
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
        aria-label="Cerrar ubicacion"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        type="button"
      />

      <section className="relative max-h-[88vh] w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 p-5 dark:border-zinc-800">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
              <MapPin size={22} suppressHydrationWarning />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-red-600 dark:text-red-400">
                Ubicacion del taller
              </p>
              <h2 className="mt-1 text-xl font-black leading-tight text-zinc-950 dark:text-zinc-100">
                SOSA IMPORT
              </h2>
            </div>
          </div>
          <button
            aria-label="Cerrar modal de ubicacion"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-red-900 dark:hover:text-red-400"
            onClick={onClose}
            type="button"
          >
            <X size={18} suppressHydrationWarning />
          </button>
        </div>

        <div className="max-h-[calc(88vh-5.25rem)] space-y-4 overflow-y-auto p-5">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-black uppercase text-zinc-500 dark:text-zinc-400">
              Direccion
            </p>
            <p className="mt-2 text-base font-bold leading-relaxed text-zinc-950 dark:text-zinc-100">
              {location.address}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
            <iframe
              className="h-64 w-full border-0 sm:h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={location.mapEmbedUrl}
              title={`Mapa de ${location.address}`}
            />
          </div>

          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-black text-white shadow-sm transition-colors hover:bg-red-700"
            href={location.mapUrl}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink size={18} suppressHydrationWarning />
            Ver en Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}
