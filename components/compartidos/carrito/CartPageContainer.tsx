"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { StoreLocationModal } from "@/components/compartidos/layout/StoreLocationModal";
import { Button } from "@/components/compartidos/ui/Button";
import { DesktopHeader } from "@/components/escritorio/layout/DesktopHeader";
import { MobileAppChrome } from "@/components/movil/layout/MobileAppChrome";
import { useProductSearchNavigation } from "@/features/products/hooks/useProductSearchNavigation";
import { storeLocation } from "@/features/store/storeLocation";

import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

const cartItems = [
  { name: "Motor 2.0 Turbo", category: "Motores", price: 2450 },
  { name: "Faro delantero derecho", category: "Faros", price: 280 },
  { name: "Amortiguador delantero", category: "Suspension", price: 320 },
];

export function CartPageContainer() {
  const [locationOpen, setLocationOpen] = useState(false);
  const { productSearch } = useProductSearchNavigation();
  const openLocation = useCallback(() => setLocationOpen(true), []);
  const closeLocation = useCallback(() => setLocationOpen(false), []);

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-zinc-950">
      <MobileAppChrome productSearch={productSearch} />
      <DesktopHeader onLocationClick={openLocation} productSearch={productSearch} />
      <StoreLocationModal
        location={storeLocation}
        onClose={closeLocation}
        open={locationOpen}
      />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* ----- Carrito completo ----- */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-red-600 dark:text-red-500">Pedido provisional</p>
            <h1 className="mt-1 text-3xl font-black text-zinc-950 dark:text-zinc-100">Mi carrito</h1>
          </div>
          <Link href="/productos">
            <Button variant="secondary">Seguir comprando</Button>
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <section className="space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.name} {...item} />
            ))}
          </section>
          <CartSummary />
        </div>
      </main>
    </div>
  );
}
