"use client";

import Link from "next/link";
import { useState } from "react";
import { Home, MapPin, MessageCircle, Search } from "lucide-react";

import { StoreLocationModal } from "@/components/compartidos/layout/StoreLocationModal";
import { storeLocation } from "@/features/store/storeLocation";

export const mobileSearchInputId = "mobile-product-search";

const items = [
  { href: "/", label: "Inicio", icon: Home, type: "link" },
  { label: "Buscar", icon: Search, type: "button" },
  { href: "https://wa.me/51924516682", label: "WhatsApp", icon: MessageCircle, type: "link" },
  { label: "Ubicacion", icon: MapPin, type: "location" },
];

type MobileBottomNavProps = {
  onSearchClick?: () => void;
};

export function MobileBottomNav({ onSearchClick }: MobileBottomNavProps) {
  const [locationOpen, setLocationOpen] = useState(false);
  const itemClass =
    "relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold text-zinc-600 transition-colors hover:bg-zinc-100 first:text-red-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:first:text-red-500";

  function focusMobileSearch() {
    const searchInput = document.getElementById(mobileSearchInputId);

    if (searchInput instanceof HTMLInputElement) {
      searchInput.focus();
      searchInput.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  return (
    // Seccion movil: navegacion inferior tipo app ecommerce.
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-2 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <span className="relative">
                  <Icon size={25} strokeWidth={2.2} suppressHydrationWarning />
                </span>
                <span className="max-w-full truncate">{item.label}</span>
              </>
            );

            if (item.type === "button") {
              return (
                <button
                  className={itemClass}
                  key={item.label}
                  onClick={onSearchClick ?? focusMobileSearch}
                  type="button"
                >
                  {content}
                </button>
              );
            }

            if (item.type === "location") {
              return (
                <button
                  className={itemClass}
                  key={item.label}
                  onClick={() => setLocationOpen(true)}
                  type="button"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                className={itemClass}
                href={item.href ?? "/"}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>
      <StoreLocationModal
        location={storeLocation}
        onClose={() => setLocationOpen(false)}
        open={locationOpen}
      />
    </>
  );
}
