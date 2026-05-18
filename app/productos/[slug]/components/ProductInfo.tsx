import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function ProductInfo() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900">
      <Badge tone="red">Motores</Badge>
      <h1 className="mt-4 text-3xl font-black text-zinc-950 transition-colors duration-300 dark:text-zinc-100">Motor 2.0 Turbo</h1>
      <p className="mt-3 text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
        Motor usado importado, gasolina, automatico, probado y seleccionado para instalacion en taller.
      </p>
      <div className="mt-6 grid gap-3 text-sm text-zinc-700 transition-colors duration-300 dark:text-zinc-300 sm:grid-cols-2">
        <p><strong>Año:</strong> 2015 - 2019</p>
        <p><strong>Condicion:</strong> Usado importado</p>
        <p><strong>Disponibilidad:</strong> Disponible</p>
        <p><strong>Recojo:</strong> En taller</p>
      </div>
      <p className="mt-6 text-3xl font-black text-zinc-950 transition-colors duration-300 dark:text-zinc-100">S/ 2,450.00</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button type="button">Agregar al carrito</Button>
        <Button type="button" variant="secondary">Consultar por WhatsApp</Button>
      </div>
    </section>
  );
}
