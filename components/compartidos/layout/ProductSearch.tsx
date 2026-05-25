"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import type { FormEvent } from "react";

import { Input } from "@/components/compartidos/ui/Input";
import type { ProductSearchProps } from "@/features/products/types/productSearch.types";
import { getSmallProductImage } from "@/features/products/utils/productImage";
import { cn } from "@/lib/utils";

// LIMITE DE SUGERENCIAS VISIBLES EN EL DESPLEGABLE.
const visibleSuggestionLimit = 4;

export function ProductSearch({ 
  model, 
  variant = "desktop" 
}: ProductSearchProps) {
  // TEXTO LIMPIO USADO PARA VALIDAR Y CONSULTAR.
  const cleanSearch = model.value.trim();
  // SUGERENCIAS QUE SE MUESTRAN EN LA LISTA.
  const suggestions = model.suggestions.slice(0, visibleSuggestionLimit);
  // INDICA SI LA API TIENE MAS COINCIDENCIAS.
  const hasMoreSuggestions =
    (model.suggestionsPagination?.total ?? 0) > suggestions.length ||
    Boolean(model.suggestionsPagination?.hasNextPage);
  // ABRE SUGERENCIAS SOLO CUANDO HAY TEXTO.
  const showSuggestions = cleanSearch.length > 0;
  // CAMBIA TAMANO Y TEXTO SEGUN LA VISTA.
  const isMobile = variant === "mobile";

  // ENVIA LA BUSQUEDA SIN RECARGAR LA PAGINA.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cleanSearch) {
      model.onSubmit();
    }
  }

  return (
    <div className="relative min-w-0">
      {/* FORMULARIO PRINCIPAL DE LA BARRA. */}
      <form
        className={cn(
          "flex min-w-0 items-center gap-2 border border-zinc-200 bg-white shadow-sm transition-colors duration-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:ring-red-900",
          isMobile ? "h-11 rounded-2xl bg-zinc-50 px-3 dark:bg-zinc-900" : "h-12 rounded-xl px-3",
        )}
        onSubmit={handleSubmit}
      >
        {/* ICONO DE BUSQUEDA. */}
        <Search
          className="shrink-0 text-zinc-500 dark:text-zinc-400"
          size={isMobile ? 18 : 19}
          suppressHydrationWarning
        />
        {/* INPUT CONTROLADO POR EL MODELO DEL HOOK. */}
        <Input
          aria-label="Buscar repuestos"
          autoComplete="off"
          className="h-9 min-w-0 border-0 bg-transparent px-0 text-sm shadow-none focus:border-0 focus:ring-0 dark:bg-transparent"
          onChange={(event) => model.onValueChange(event.target.value)}
          placeholder={
            isMobile
              ? "Buscar motor, faro, freno..."
              : "Buscar repuestos por nombre, categoria, marca, modelo..."
          }
          value={model.value}
        />
        {/* BOTON QUE ENVIA EL TEXTO ESCRITO. */}
        <button
          aria-label="Buscar coincidencias"
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg bg-red-600 font-black text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700",
            isMobile ? "h-8 w-8" : "h-9 px-3 text-xs uppercase",
          )}
          disabled={!cleanSearch}
          type="submit"
        >
          {isMobile ? <Search size={16} suppressHydrationWarning /> : "Buscar"}
        </button>
      </form>

      {showSuggestions && (
        // PANEL DESPLEGABLE DE COINCIDENCIAS.
        <div
          className={cn(
            "absolute left-0 right-0 z-80 mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950",
            isMobile ? "max-h-[min(65vh,420px)]" : "max-h-[min(70vh,520px)]",
          )}
        >
          <div className="max-h-[inherit] overflow-y-auto p-2">
            {/* ESTADO MIENTRAS LA API RESPONDE. */}
            {model.isLoading && (
              <p className="px-2 py-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                Buscando coincidencias...
              </p>
            )}

            {/* ERROR DEVUELTO POR LA CONSULTA. */}
            {!model.isLoading && model.error && (
              <p className="px-2 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
                {model.error}
              </p>
            )}

            {/* MENSAJE CUANDO NO HAY COINCIDENCIAS. */}
            {!model.isLoading && !model.error && suggestions.length === 0 && (
              <p className="px-2 py-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                No se encontraron repuestos.
              </p>
            )}

            {/* LISTA DE PRODUCTOS SUGERIDOS. */}
            {!model.error && suggestions.length > 0 && (
              <div className="space-y-1">
                {suggestions.map((product) => (
                  // CADA SUGERENCIA ABRE SU DETALLE POR SLUG.
                  <Link
                    className="flex min-w-0 items-center gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    href={`/productos/${product.slug}`}
                    key={product.id}
                  >
                    {/* IMAGEN PEQUENA DEL PRODUCTO O PLACEHOLDER. */}
                    <span className="flex h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                      {product.imagen_principal ? (
                        <Image
                          alt=""
                          className="h-full w-full object-cover"
                          height={48}
                          src={getSmallProductImage(product.imagen_principal)}
                          sizes="48px"
                          width={48}
                        />
                      ) : (
                        <span className="h-full w-full bg-zinc-100 dark:bg-zinc-900" />
                      )}
                    </span>
                    {/* NOMBRE Y DATOS CORTOS DEL PRODUCTO. */}
                    <span className="min-w-0">
                      <strong className="block truncate text-sm font-black text-zinc-950 dark:text-zinc-100">
                        {product.nombre}
                      </strong>
                      <span className="block truncate text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {[product.marca, product.modelo, product.anio].filter(Boolean).join(" ")}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* ACCION PARA CONSULTAR MAS RESULTADOS. */}
            {hasMoreSuggestions && (
              <button
                className="mt-2 flex h-10 w-full items-center justify-center rounded-lg border border-zinc-200 px-3 text-sm font-black text-zinc-900 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-100 dark:hover:border-red-900 dark:hover:text-red-400"
                onClick={model.onShowMore}
                type="button"
              >
                Mostrar mas coincidencias
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
