# Guia tecnica: tema y botones interactivos en movil

Esta guia explica como funciona el cambio de tema en escritorio y movil, que archivos participan, y por que los botones moviles de tema y filtros podian fallar aunque otros botones como carrito siguieran navegando.

## Idea principal

El proyecto usa `next-themes` para cambiar entre modo claro y oscuro.

La configuracion global esta en:

- `providers/ThemeProvider.tsx`
- `app/providers.tsx`
- `app/layout.tsx`

Los botones que cambian tema son componentes cliente, porque necesitan ejecutar JavaScript en el navegador:

- Escritorio: `components/ui/ThemeToggle.tsx`
- Movil: `components/layout/mobile/MobileHeader.tsx`

El tema se aplica agregando o quitando la clase `dark` en el elemento `<html>`. Tailwind lee esa clase gracias a la configuracion de `app/globals.css`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Por eso las clases como `dark:bg-zinc-950` o `dark:text-zinc-100` cambian visualmente cuando existe `.dark`.

## Archivos completos que participan

### Proveedor de tema

Archivo:

- `providers/ThemeProvider.tsx`

Codigo relevante:

```tsx
"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
```

Puntos importantes:

- `attribute="class"` indica que el tema se controla con una clase CSS.
- `defaultTheme="light"` inicia en modo claro.
- `enableSystem={false}` evita depender del tema del sistema operativo.
- `disableTransitionOnChange` evita transiciones raras al cambiar tema.

### Providers globales

Archivo:

- `app/providers.tsx`

Codigo relevante:

```tsx
import type { ReactNode } from "react";

import { ThemeProvider } from "@/providers/ThemeProvider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
```

Este archivo envuelve la app con `ThemeProvider`, asi cualquier componente hijo puede usar `useTheme()`.

### Layout global

Archivo:

- `app/layout.tsx`

Codigo relevante:

```tsx
<Providers>
  <MobileFilterProvider>
    <MobileAppChrome />
    {children}
  </MobileFilterProvider>
</Providers>
```

Este orden es importante:

- `Providers` envuelve todo con el proveedor de tema.
- `MobileFilterProvider` envuelve el chrome movil y las paginas.
- `MobileAppChrome` monta el header movil, el drawer de filtros y la barra inferior.

Tambien existe:

```tsx
<html
  lang="es"
  suppressHydrationWarning
  className="h-full antialiased"
>
```

`suppressHydrationWarning` ayuda porque la clase del tema puede cambiar entre servidor y cliente cuando `next-themes` hidrata.

## Boton de tema en escritorio

El boton de escritorio vive en:

- `components/ui/ThemeToggle.tsx`

Y se usa dentro de:

- `components/layout/Header.tsx`

En `Header.tsx` aparece asi:

```tsx
<ThemeToggle />
```

Ese header de escritorio se muestra solo desde `md`:

```tsx
<header className="... hidden ... md:block">
```

### Logica del boton escritorio

Codigo principal:

```tsx
const { resolvedTheme, setTheme } = useTheme();
const isDark = resolvedTheme === "dark";

return (
  <Button
    aria-label="Cambiar tema"
    className="h-10 w-10 shrink-0 px-0 transition-colors duration-300"
    type="button"
    variant="secondary"
    onClick={() => setTheme(isDark ? "light" : "dark")}
  >
    {isDark ? (
      <Sun className="h-5 w-5 transition-transform duration-300" suppressHydrationWarning />
    ) : (
      <Moon className="h-5 w-5 transition-transform duration-300" suppressHydrationWarning />
    )}
    <span className="sr-only">Cambiar tema</span>
  </Button>
);
```

Que hace:

- Lee el tema actual con `resolvedTheme`.
- Calcula `isDark`.
- Al hacer click, llama `setTheme("light")` o `setTheme("dark")`.
- Mantiene los iconos `Sun` y `Moon`.

### Proteccion de hidratacion en escritorio

El componente de escritorio usa `useSyncExternalStore` para saber si ya esta en cliente:

```tsx
const mounted = useSyncExternalStore(
  subscribe,
  getClientSnapshot,
  getServerSnapshot,
);
```

Mientras no esta montado, devuelve un boton deshabilitado con icono `Sun`. Esto evita que el servidor pinte un icono y el cliente pinte otro durante la hidratacion.

## Boton de tema en movil

El boton movil vive en:

- `components/layout/mobile/MobileHeader.tsx`

Este header solo se muestra en movil:

```tsx
<header className="... md:hidden">
```

### Logica actual del boton movil

Codigo relevante:

```tsx
const { resolvedTheme, setTheme } = useTheme();
const isDark = resolvedTheme === "dark";
const nextTheme = isDark ? "light" : "dark";

function handleThemeToggle() {
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  setTheme(nextTheme);
}
```

Y el boton:

```tsx
<button
  aria-label="Cambiar tema"
  className={iconButtonClass}
  onClick={handleThemeToggle}
  type="button"
>
  {isDark ? (
    <Sun size={18} suppressHydrationWarning />
  ) : (
    <Moon size={18} suppressHydrationWarning />
  )}
</button>
```

Que hace:

- Mantiene los iconos `Sun` y `Moon`.
- Calcula el siguiente tema.
- Aplica inmediatamente la clase `dark` en `<html>` con `document.documentElement.classList.toggle`.
- Luego sincroniza el estado oficial de `next-themes` con `setTheme(nextTheme)`.

La actualizacion manual de `document.documentElement.classList` hace que el cambio sea inmediato en movil, incluso antes de que `next-themes` termine su sincronizacion interna.

### Clases tactiles del boton movil

Los botones del header movil usan:

```tsx
const iconButtonClass =
  "relative z-[70] flex h-10 w-10 touch-manipulation items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100";
```

Puntos importantes:

- `relative z-[70]` los pone encima de capas cercanas.
- `touch-manipulation` mejora el comportamiento tactil en moviles.
- Las clases `dark:*` cambian cuando existe la clase `dark` en `<html>`.

## Boton de filtros en movil

El boton de filtros del header movil tambien vive en:

- `components/layout/mobile/MobileHeader.tsx`

Codigo relevante:

```tsx
const { openFilters } = useMobileFilter();
```

Boton:

```tsx
<button
  aria-label="Abrir categorias y filtros"
  className={iconButtonClass}
  onClick={openFilters}
  type="button"
>
  <Menu size={19} suppressHydrationWarning />
</button>
```

Ese boton no navega. Depende de React y de un `onClick`.

## Estado del drawer de filtros

El estado vive en:

- `components/layout/mobile/MobileFilterContext.tsx`

Codigo relevante:

```tsx
const [filtersOpen, setFiltersOpen] = useState(false);

const value = useMemo(
  () => ({
    filtersOpen,
    openFilters: () => setFiltersOpen(true),
    closeFilters: () => setFiltersOpen(false),
  }),
  [filtersOpen],
);
```

Este contexto expone:

- `filtersOpen`: dice si el drawer esta abierto.
- `openFilters`: abre el drawer.
- `closeFilters`: cierra el drawer.

## Donde se monta el drawer movil

Archivo:

- `components/layout/mobile/MobileAppChrome.tsx`

Codigo relevante:

```tsx
export function MobileAppChrome() {
  const { closeFilters, filtersOpen } = useMobileFilter();

  return (
    <>
      <MobileHeader />
      <MobileFilterDrawer open={filtersOpen} onClose={closeFilters} />
      <MobileBottomNav />
    </>
  );
}
```

Esto significa:

- `MobileHeader` abre el drawer.
- `MobileAppChrome` lee `filtersOpen`.
- `MobileFilterDrawer` aparece solo si `open` es `true`.

## Campos de filtracion en movil

Archivo:

- `app/productos/components/mobile/MobileFilterDrawer.tsx`

Codigo relevante:

```tsx
export function MobileFilterDrawer({ open, onClose }: MobileFilterDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      ...
      <aside className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-2xl border-t border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        ...
        <ProductFilters />
      </aside>
    </div>
  );
}
```

Puntos importantes:

- Si `open` es `false`, retorna `null`, por eso no hay drawer.
- Si `open` es `true`, renderiza un panel fijo desde abajo.
- Usa `md:hidden`, asi solo aparece en movil.
- Ahora usa `<ProductFilters />` sin variante especial, para mostrar los mismos campos que escritorio.

Los campos reales viven en:

- `app/productos/components/ProductFilters.tsx`

Campos actuales:

- Categoria
- Marca
- Modelo
- Combustible
- Transmision
- Año desde / hasta
- Condicion
- Rango de precio
- Disponibilidad
- Aplicar filtros

## Por que otros botones si funcionaban

Los botones como carrito o elementos del footer pueden funcionar aunque React no este bien hidratado porque muchos son enlaces.

Ejemplo:

```tsx
<Link href="/carrito">
  ...
</Link>
```

En el navegador, eso termina comportandose como un enlace HTML. Aunque JavaScript falle, el navegador todavia puede navegar a otra URL.

En cambio estos botones dependen 100% de JavaScript:

```tsx
onClick={handleThemeToggle}
onClick={openFilters}
```

Si React no hidrata o si el script de Next no carga correctamente, esos `onClick` no existen en el navegador. Visualmente el boton se ve, pero tocarlo no hace nada.

## Por que fallaron antes

Hubo dos causas probables:

### 1. Hidratacion o scripts bloqueados en desarrollo por IP

En Next.js 16, el servidor de desarrollo bloquea por seguridad algunos recursos internos de `/_next` si vienen desde un origen no permitido.

Cuando abres la app desde un celular usando la IP de la PC, por ejemplo:

```txt
http://192.168.18.9:3000
```

el navegador movil puede recibir HTML y CSS, pero si Next bloquea los scripts internos, React no hidrata la pagina.

Consecuencia:

- Los enlaces siguen navegando.
- Los botones con `onClick` no responden.
- El cambio de tema no funciona.
- El drawer de filtros no abre.

La solucion esta en:

- `next.config.ts`

Codigo actual:

```ts
const localNetworkDevOrigins = [
  "192.168.*.*",
  "10.*.*.*",
  "172.*.*.*",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: localNetworkDevOrigins,
  turbopack: {
    root: __dirname,
  },
};
```

Esto permite redes locales comunes durante desarrollo.

Importante: despues de cambiar `next.config.ts`, hay que reiniciar el servidor:

```bash
pnpm.cmd dev
```

### 2. Boton movil demasiado dependiente de montaje

Antes el boton movil usaba una logica parecida a la de escritorio con `useSyncExternalStore` para manejar montaje.

Eso puede proteger contra errores de hidratacion, pero tambien puede dejar el boton deshabilitado o demasiado dependiente del estado de montaje.

La version movil actual es mas directa:

```tsx
function handleThemeToggle() {
  document.documentElement.classList.toggle("dark", nextTheme === "dark");
  setTheme(nextTheme);
}
```

Con esto el toque en movil cambia la clase visual de inmediato y luego actualiza `next-themes`.

## Por que ahora funciona

Ahora funciona porque:

- `next.config.ts` permite origenes de red local en desarrollo.
- El boton movil de tema no queda deshabilitado por montaje.
- El boton movil de filtros llama directamente a `openFilters` desde `useMobileFilter`.
- `MobileAppChrome` monta el drawer y lee `filtersOpen` desde el mismo contexto.
- `MobileFilterDrawer` usa los mismos campos de `ProductFilters` que escritorio.
- Los botones moviles tienen `relative z-[70]` y `touch-manipulation` para mejorar el toque en celular.

## Como probar correctamente

1. Reiniciar el servidor despues de cambios en `next.config.ts`:

```bash
pnpm.cmd dev
```

2. Abrir desde el celular:

```txt
http://IP-DE-LA-PC:3000
```

3. Cerrar y volver a abrir la pestaña del celular si estaba cacheada.

4. Probar:

- Boton de tema del header movil.
- Boton de menu/filtros del header movil.
- Boton "Filtrar productos" dentro de la pagina.

5. Si vuelve a fallar, revisar la terminal de Next buscando un mensaje como:

```txt
Blocked cross-origin request to Next.js dev resource
```

Ese mensaje indica que el navegador movil no pudo cargar algun recurso interno de Next y React puede quedar sin hidratar.
