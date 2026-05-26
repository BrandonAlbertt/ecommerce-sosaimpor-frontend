"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/compartidos/ui/Button";
import type { ProductFilterParams } from "@/features/products/types/product.types";
import type { ProductFilterOptionsModel } from "@/features/products/types/productFilterOptions.types";
import { cn } from "@/lib/utils";

const fieldClass =
  "mt-2 h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-700 outline-none transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:placeholder:text-zinc-600 focus:border-red-500";

type FilterOption = {
  label: string;
  value: number | string;
};

type FilterSelectProps = {
  disabled: boolean;
  emptyLabel: string;
  label: string;
  loading: boolean;
  onChange: (value: number | string | undefined) => void;
  options: FilterOption[];
  value: number | string | undefined;
};

type ProductFiltersProps = {
  filterOptions: ProductFilterOptionsModel;
  filters: ProductFilterParams;
  onApplyFilters: (filters: ProductFilterParams) => void;
  onClearFilters: () => void;
  variant?: "desktop" | "mobile";
};

function formatOptionLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatPrice(value: number | undefined) {
  if (!value) {
    return "Sin precio";
  }

  return `S/ ${value.toLocaleString("es-PE")}`;
}

// COMBO CON SCROLL: LIMITA OPCIONES VISIBLES Y PERMITE BAJAR CON DEDO/MOUSE.
function FilterSelect({
  disabled,
  emptyLabel,
  label,
  loading,
  onChange,
  options,
  value,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => String(option.value) === String(value));
  const displayLabel = selectedOption?.label ?? (loading ? "Cargando..." : emptyLabel);

  function selectValue(nextValue: number | string | undefined) {
    onChange(nextValue);
    setOpen(false);
  }

  return (
    <label className="relative block text-xs font-bold text-zinc-800 dark:text-zinc-300">
      {label}
      <button
        className={`${fieldClass} flex items-center justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-60`}
        disabled={disabled}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        type="button"
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown size={15} suppressHydrationWarning />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 z-90 mt-1 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
          {/* En movil muestra pocas opciones; en pantallas grandes deja ver un poco mas. */}
          <div className="max-h-48 overflow-y-auto p-1 md:max-h-60">
            <button
              className="flex min-h-9 w-full items-center rounded-md px-3 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              onClick={() => selectValue(undefined)}
              type="button"
            >
              {emptyLabel}
            </button>

            {options.map((option) => (
              <button
                className="flex min-h-9 w-full items-center rounded-md px-3 text-left text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                key={String(option.value)}
                onClick={() => selectValue(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </label>
  );
}

export function ProductFilters({ 
  filterOptions, 
  filters,
  onApplyFilters,
  onClearFilters,
  variant = "desktop" 
}: ProductFiltersProps) {
  const [draftFilters, setDraftFilters] = useState<ProductFilterParams>(filters);
  const [activePriceField, setActivePriceField] = useState<"max" | "min">("min");
  const { error, isLoading, options } = filterOptions;
  const disabled = isLoading || Boolean(error);
  const apiMinPrice = Number(options?.precios.precio_min ?? 0);
  const apiMaxPrice = Number(options?.precios.precio_max ?? 0);
  const priceStep = 10;
  const availableYears = options?.anios ?? [];
  const maxYearOptions = availableYears.filter((year) => (
    draftFilters.anio_min ? year > draftFilters.anio_min : false
  ));

  function updateTextFilter(key: keyof ProductFilterParams) {
    return (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const { value } = event.target;

      setDraftFilters((currentFilters) => ({
        ...currentFilters,
        [key]: value || undefined,
      }));
    };
  }

  // ACTUALIZA COMBOS: RECIBE EL VALOR DEL COMBO CON SCROLL.
  function updateComboFilter(key: keyof ProductFilterParams) {
    return (value: number | string | undefined) => {
      setDraftFilters((currentFilters) => ({
        ...currentFilters,
        [key]: value,
      }));
    };
  }

  function getActivePriceValue() {
    if (activePriceField === "max") {
      return draftFilters.precio_max ?? draftFilters.precio_min ?? 0;
    }

    return draftFilters.precio_min ?? 0;
  }

  // PRECIO: UNA SOLA BARRA CAMBIA MINIMO O MAXIMO SEGUN EL CAMPO ACTIVO.
  function handlePriceChange(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);

    setDraftFilters((currentFilters) => {
      if (activePriceField === "min") {
        if (value === 0) {
          return {
            ...currentFilters,
            precio_min: undefined,
            precio_max: undefined,
          };
        }

        const nextMinPrice = Math.max(value, apiMinPrice);

        return {
          ...currentFilters,
          precio_min: nextMinPrice,
          precio_max:
            currentFilters.precio_max && currentFilters.precio_max > nextMinPrice
              ? currentFilters.precio_max
              : undefined,
        };
      }

      if (!currentFilters.precio_min || value === 0) {
        return {
          ...currentFilters,
          precio_max: undefined,
        };
      }

      return {
        ...currentFilters,
        precio_max: Math.max(value, currentFilters.precio_min + priceStep),
      };
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApplyFilters(draftFilters);
  }

  function handleClearFilters() {
    setDraftFilters({});
    onClearFilters();
  }

  return (
    <aside
      className={cn(
        "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900",
        // En movil el componente no cambia su logica, solo su apariencia.
        variant === "mobile" && "border-0 p-0 shadow-none dark:bg-zinc-950",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-black uppercase text-zinc-950 dark:text-zinc-100">
          FILTRAR POR
        </h2>

        <button
          className="text-xs font-semibold text-zinc-500 transition-colors duration-300 dark:text-zinc-400"
          onClick={handleClearFilters}
          type="button"
        >
          Limpiar filtros
        </button>
      </div>

      {error && (
        <p className="mb-3 text-xs font-semibold text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* COMBOS DE FILTRO: USAN LISTA CON SCROLL PARA NO OCUPAR TODA LA PANTALLA. */}
        <FilterSelect
          disabled={disabled}
          emptyLabel="Todas"
          label="Categoria"
          loading={isLoading}
          onChange={updateComboFilter("categoria_id")}
          options={(options?.categorias ?? []).map((category) => ({
            label: category.nombre,
            value: category.id,
          }))}
          value={draftFilters.categoria_id}
        />

        <FilterSelect
          disabled={disabled}
          emptyLabel="Todas"
          label="Marca"
          loading={isLoading}
          onChange={updateComboFilter("marca")}
          options={(options?.marcas ?? []).map((brand) => ({
            label: brand,
            value: brand,
          }))}
          value={draftFilters.marca}
        />

        <FilterSelect
          disabled={disabled}
          emptyLabel="Todos"
          label="Modelo"
          loading={isLoading}
          onChange={updateComboFilter("modelo")}
          options={(options?.modelos ?? []).map((model) => ({
            label: model,
            value: model,
          }))}
          value={draftFilters.modelo}
        />

        <FilterSelect
          disabled={disabled}
          emptyLabel="Todos"
          label="Tipo de producto"
          loading={isLoading}
          onChange={updateComboFilter("tipo_producto")}
          options={(options?.tipos_producto ?? []).map((productType) => ({
            label: productType,
            value: productType,
          }))}
          value={draftFilters.tipo_producto}
        />

        <div>
          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-300">Anio</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {/* ANIO MINIMO: EL USUARIO SOLO SELECCIONA ANIOS DISPONIBLES. */}
            <FilterSelect
              disabled={disabled}
              emptyLabel="Minimo"
              label=""
              loading={isLoading}
              onChange={(value) => {
                const nextMinYear = typeof value === "number" ? value : undefined;

                setDraftFilters((currentFilters) => ({
                  ...currentFilters,
                  anio_min: nextMinYear,
                  anio_max:
                    nextMinYear && currentFilters.anio_max && currentFilters.anio_max > nextMinYear
                      ? currentFilters.anio_max
                      : undefined,
                }));
              }}
              options={availableYears.map((year) => ({
                label: String(year),
                value: year,
              }))}
              value={draftFilters.anio_min}
            />

            {/* ANIO MAXIMO: SE ACTIVA SOLO DESPUES DE ELEGIR MINIMO Y MUESTRA SUPERIORES. */}
            <FilterSelect
              disabled={disabled || !draftFilters.anio_min}
              emptyLabel="Maximo"
              label=""
              loading={isLoading}
              onChange={updateComboFilter("anio_max")}
              options={maxYearOptions.map((year) => ({
                label: String(year),
                value: year,
              }))}
              value={draftFilters.anio_max}
            />
          </div>
        </div>

        <fieldset className="space-y-1">
          <legend className="text-xs font-bold text-zinc-800 dark:text-zinc-300">
            Condicion
          </legend>

          {(options?.condiciones ?? []).map((condition) => (
            <label key={condition} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <input
                className="accent-red-600"
                checked={draftFilters.condicion === condition}
                disabled={disabled}
                name="condicion"
                onChange={updateTextFilter("condicion")}
                type="radio"
                value={condition}
              />
              {formatOptionLabel(condition)}
            </label>
          ))}
        </fieldset>

        <div>
          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-300">
            Rango de precio
          </p>

          {/* PRECIO: UNA BARRA CONTROLA MINIMO O MAXIMO SEGUN EL CAMPO SELECCIONADO. */}
          <input
            className={cn(
              "mt-2 w-full accent-red-600 dark:accent-red-500",
              activePriceField === "max" && "accent-orange-500 dark:accent-orange-400",
            )}
            disabled={disabled}
            max={apiMaxPrice}
            min={activePriceField === "max" && draftFilters.precio_min ? draftFilters.precio_min + priceStep : 0}
            onChange={handlePriceChange}
            step={priceStep}
            type="range"
            value={getActivePriceValue()}
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              className={cn(
                fieldClass,
                "flex items-center text-left",
                activePriceField === "min" && "border-red-500 ring-2 ring-red-100 dark:ring-red-900",
              )}
              onClick={() => setActivePriceField("min")}
              type="button"
            >
              {formatPrice(draftFilters.precio_min)}
            </button>
            <button
              className={cn(
                fieldClass,
                "flex items-center text-left disabled:cursor-not-allowed disabled:opacity-60",
                activePriceField === "max" && "border-orange-500 ring-2 ring-orange-100 dark:ring-orange-900",
              )}
              disabled={!draftFilters.precio_min}
              onClick={() => setActivePriceField("max")}
              type="button"
            >
              {formatPrice(draftFilters.precio_max)}
            </button>
          </div>
        </div>

        <fieldset className="space-y-1">
          <legend className="text-xs font-bold text-zinc-800 dark:text-zinc-300">
            Disponibilidad
          </legend>

          {(options?.disponibilidad ?? []).map((availability) => (
            <label key={availability} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <input
                className="accent-red-600"
                checked={draftFilters.disponibilidad === availability}
                disabled={disabled}
                name="disponibilidad"
                onChange={updateTextFilter("disponibilidad")}
                type="radio"
                value={availability}
              />
              {formatOptionLabel(availability)}
            </label>
          ))}
        </fieldset>

        <Button className="h-10 w-full rounded-lg" disabled={disabled} type="submit">
          Aplicar filtros
        </Button>
      </form>
    </aside>
  );
}
