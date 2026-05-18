import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const fieldClass =
  "mt-2 h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-700 outline-none transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:placeholder:text-zinc-600 focus:border-red-500";

type ProductFiltersProps = {
  variant?: "desktop" | "mobile";
};

export function ProductFilters({ variant = "desktop" }: ProductFiltersProps) {
  return (
    <aside
      className={cn(
        "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900",
        variant === "mobile" && "border-0 p-0 shadow-none dark:bg-zinc-950",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-black uppercase text-zinc-950 dark:text-zinc-100">FILTRAR POR</h2>
        <button className="text-xs font-semibold text-zinc-500 transition-colors duration-300 dark:text-zinc-400" type="button">
          Limpiar filtros
        </button>
      </div>

      <div className="space-y-3">
        {["Categoria", "Marca", "Modelo", "Combustible", "Transmision"].map((label) => (
          <label key={label} className="block text-xs font-bold text-zinc-800 dark:text-zinc-300">
            {label}
            <select className={fieldClass}>
              <option>Todas</option>
            </select>
          </label>
        ))}

        <div>
          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-300">Año</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Input className="h-9 rounded-lg text-xs" placeholder="Desde" />
            <Input className="h-9 rounded-lg text-xs" placeholder="Hasta" />
          </div>
        </div>

        <fieldset className="space-y-1">
          <legend className="text-xs font-bold text-zinc-800 dark:text-zinc-300">Condición</legend>
          {["Usado importado", "Usado local", "Reacondicionado"].map((item) => (
            <label key={item} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <input className="accent-red-600" type="checkbox" defaultChecked={item === "Usado importado"} />
              {item}
            </label>
          ))}
        </fieldset>

        <div>
          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-300">Rango de precio</p>
          <input className="mt-2 w-full accent-red-600 dark:accent-red-500" type="range" min="0" max="8000" defaultValue="4500" />
          <div className="grid grid-cols-2 gap-2">
            <Input className="h-9 rounded-lg text-xs" placeholder="S/ 0" />
            <Input className="h-9 rounded-lg text-xs" placeholder="S/ 8000" />
          </div>
        </div>

        <fieldset className="space-y-1">
          <legend className="text-xs font-bold text-zinc-800 dark:text-zinc-300">Disponibilidad</legend>
          {["Disponible", "Proximamente"].map((item) => (
            <label key={item} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <input className="accent-red-600" type="checkbox" defaultChecked={item === "Disponible"} />
              {item}
            </label>
          ))}
        </fieldset>

        <Button className="h-10 w-full rounded-lg" type="button">
          Aplicar filtros
        </Button>
      </div>
    </aside>
  );
}
