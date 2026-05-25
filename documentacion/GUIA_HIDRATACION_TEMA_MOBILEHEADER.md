# Guia visual: hidratacion del tema en MobileHeader

Esta guia resume como interactuan `MobileHeader` y `ThemeProvider`, y cual es el patron usado para evitar errores de hidratacion cuando el tema se resuelve en el navegador.

## Componentes involucrados

```mermaid
flowchart TD
  Layout["app/layout.tsx<br/>RootLayout"]
  Providers["app/providers.tsx<br/>Providers"]
  ThemeProvider["providers/ThemeProvider.tsx<br/>NextThemeProvider"]
  MobileFilterProvider["MobileFilterProvider"]
  Page["Paginas y componentes"]
  MobileHeader["components/movil/layout/MobileHeader.tsx"]
  UseTheme["useTheme()<br/>resolvedTheme + setTheme"]
  Html["html.dark<br/>clase aplicada por next-themes"]
  Tailwind["Tailwind dark:*<br/>estilos oscuros"]

  Layout --> Providers
  Providers --> ThemeProvider
  ThemeProvider --> MobileFilterProvider
  MobileFilterProvider --> Page
  Page --> MobileHeader
  ThemeProvider --> UseTheme
  MobileHeader --> UseTheme
  UseTheme --> Html
  Html --> Tailwind
```

## Flujo de render

El servidor no conoce el tema guardado en el navegador. Por eso el primer render debe ser estable y no depender de `resolvedTheme`.

```mermaid
sequenceDiagram
  participant SSR as Servidor
  participant Browser as Navegador
  participant Header as MobileHeader
  participant Themes as next-themes
  participant Html as html

  SSR->>Header: Render inicial
  Header-->>SSR: mounted = false, icono fallback
  SSR-->>Browser: HTML inicial estable

  Browser->>Header: Hidratacion React
  Header-->>Browser: Primer render cliente igual al servidor
  Browser->>Header: useSyncExternalStore cambia mounted a true
  Header->>Themes: Lee resolvedTheme
  Themes->>Html: Aplica o quita clase dark
  Header-->>Browser: Render dinamico con Sun/Moon y boton activo
```

## Patron anti-hidratacion

```mermaid
flowchart LR
  A["Render inicial"] --> B{"mounted?"}
  B -- "false" --> C["No leer tema para decidir UI<br/>Mostrar fallback estable<br/>Deshabilitar cambio de tema"]
  B -- "true" --> D["Leer resolvedTheme<br/>Calcular isDark<br/>Permitir setTheme"]
  D --> E["Actualizar clase dark en html"]
```

Codigo clave en `MobileHeader`:

```tsx
const mounted = useSyncExternalStore(
  subscribe,
  getClientSnapshot,
  getServerSnapshot,
);

const { resolvedTheme, setTheme } = useTheme();
const isDark = mounted && resolvedTheme === "dark";

function handleThemeToggle() {
  if (!mounted) {
    return;
  }

  setTheme(isDark ? "light" : "dark");
}
```

## Reglas para nuevos componentes de tema

- No uses `resolvedTheme`, `theme`, `localStorage` o `matchMedia` para decidir el HTML del primer render.
- Usa un estado de montaje estable antes de mostrar UI dependiente del tema.
- Mientras `mounted` sea `false`, renderiza un fallback fijo.
- Ejecuta `setTheme` solo despues de que `mounted` sea `true`.
- Mantener `suppressHydrationWarning` en `<html>` ayuda porque `next-themes` puede cambiar la clase `dark` durante la hidratacion.

## Resumen

`ThemeProvider` controla la clase `dark` en `<html>`. `MobileHeader` consume `useTheme()`, pero solo aplica logica dinamica cuando el componente ya esta montado en cliente. Ese retraso intencional evita que el HTML generado por el servidor sea distinto al primer render del navegador.
