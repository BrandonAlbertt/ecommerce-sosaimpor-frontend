import Link from "next/link";

import { Button } from "@/components/ui/Button";

const cartItems = [
  { name: "Motor 2.0 Turbo", detail: "Año: 2016 - 2019", price: 2450 },
  { name: "Faro delantero derecho", detail: "Año: 2015 - 2018", price: 280 },
  { name: "Amortiguador delantero", detail: "Año: 2016 - 2019", price: 320 },
];

export function CartPreview() {
  return (
    <aside className="sticky top-32 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black uppercase text-zinc-950 dark:text-zinc-100">MI CARRITO (3)</h2>
        <span className="text-lg text-zinc-500 dark:text-zinc-400">×</span>
      </div>

      <div className="mt-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.name} className="flex gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-50 text-[10px] font-black text-zinc-400 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-500">
              IMG
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-zinc-950 dark:text-zinc-100">{item.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Usado importado</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.detail}</p>
              <p className="mt-1 text-sm font-black text-zinc-950 dark:text-zinc-100">S/ {item.price.toLocaleString("es-PE")}.00</p>
              <div className="mt-2 inline-flex rounded border border-zinc-200 text-xs transition-colors duration-300 dark:border-zinc-800">
                <button className="px-2 py-1 text-zinc-950 dark:text-zinc-100" type="button">-</button>
                <span className="px-2 py-1 font-bold text-zinc-950 dark:text-zinc-100">1</span>
                <button className="px-2 py-1 text-zinc-950 dark:text-zinc-100" type="button">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <span>Subtotal</span>
          <span>S/ 3,050.00</span>
        </div>
        <div className="flex justify-between text-red-600 dark:text-red-400">
          <span>Descuento</span>
          <span>- S/ 400.00</span>
        </div>
        <div className="flex justify-between border-t border-zinc-200 pt-3 text-xl font-black text-zinc-950 dark:border-zinc-800 dark:text-zinc-100">
          <span>Total</span>
          <span>S/ 2,650.00</span>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <p className="font-black text-zinc-900 dark:text-zinc-100">Compra online y recoge en taller</p>
        <p>Tu reserva estara lista para recojo en el taller mas cercano.</p>
      </div>

      <Button className="mt-4 w-full rounded-lg" type="button">
        Finalizar pedido
      </Button>
      <Link className="mt-3 block text-center text-sm font-semibold text-zinc-700 underline transition-colors duration-300 dark:text-zinc-400" href="/carrito">
        Ver carrito completo
      </Link>
    </aside>
  );
}
