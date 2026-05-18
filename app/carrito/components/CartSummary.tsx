import { Button } from "@/components/ui/Button";

export function CartSummary() {
  return (
    <aside className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-32">
      <h2 className="text-lg font-black text-zinc-950 dark:text-zinc-100">Resumen</h2>
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
          <span>Subtotal</span>
          <span>S/ 3,050.00</span>
        </div>
        <div className="flex justify-between text-red-600 dark:text-red-400">
          <span>Descuento</span>
          <span>- S/ 400.00</span>
        </div>
        <div className="flex justify-between border-t border-zinc-200 pt-4 text-xl font-black text-zinc-950 dark:border-zinc-800 dark:text-zinc-100">
          <span>Total</span>
          <span>S/ 2,650.00</span>
        </div>
      </div>
      <div className="mt-5 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600 transition-colors duration-300 dark:bg-zinc-800 dark:text-zinc-400">
        Compra online y recoge en taller. Te contactaremos para coordinar tu reserva.
      </div>
      <Button className="mt-5 w-full" type="button">Finalizar pedido</Button>
    </aside>
  );
}
