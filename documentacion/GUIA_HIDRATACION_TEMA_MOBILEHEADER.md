# GUIA DE HIDRATACION DEL TEMA EN MOBILEHEADER

## IDEA GENERAL

El tema claro/oscuro lo controla `next-themes`. En Next.js, el servidor renderiza antes de conocer el tema real del navegador; por eso `MobileHeader` espera a estar montado antes de cambiar el icono de tema.

```mermaid
flowchart TD
  A[app/layout.tsx] --> B[app/providers.tsx]
  B --> C[ThemeProvider]
  C --> D[next-themes]
  D --> E[Clase dark en html]
  E --> F[Tailwind dark:*]
  A --> G[MobileFilterProvider]
  G --> H[ProductPageContainer]
  H --> I[MobileAppChrome]
  I --> J[MobileHeader]
  J --> D
```

## PROBLEMA QUE SE EVITA

```mermaid
flowchart LR
  A[Servidor] --> B[HTML inicial]
  C[Navegador] --> D[Primer render cliente]
  B --> E{Coinciden?}
  D --> E
  E -- Si --> F[Hidratacion correcta]
  E -- No --> G[Warning o error de hidratacion]
```

Si el servidor pinta un icono y el cliente pinta otro en el primer render, React detecta diferencia. Por eso el componente usa un estado estable antes de leer `resolvedTheme`.

## ARCHIVOS QUE PARTICIPAN

| Archivo | Funcion |
| --- | --- |
| `providers/ThemeProvider.tsx` | Configura `next-themes`. |
| `app/providers.tsx` | Monta el provider de tema. |
| `app/layout.tsx` | Usa `suppressHydrationWarning` en `<html>`. |
| `components/movil/layout/MobileHeader.tsx` | Lee tema y cambia el boton movil. |
| `components/compartidos/layout/ThemeToggle.tsx` | Aplica el mismo patron en escritorio. |

## FLUJO DE HIDRATACION

```mermaid
sequenceDiagram
  participant SSR as Servidor
  participant Browser as Navegador
  participant Header as MobileHeader
  participant Theme as next-themes
  participant Html as html

  SSR->>Header: Render inicial
  Header-->>SSR: mounted = false
  SSR-->>Browser: HTML estable
  Browser->>Header: React hidrata
  Header-->>Browser: Primer render igual
  Browser->>Header: mounted = true
  Header->>Theme: Lee resolvedTheme
  Theme->>Html: Aplica clase dark si corresponde
  Header-->>Browser: Muestra Sun o Moon
```

## PATRON USADO

```mermaid
flowchart TD
  A[Render MobileHeader] --> B{mounted?}
  B -- No --> C[Icono fijo<br/>boton disabled]
  B -- Si --> D[Leer resolvedTheme]
  D --> E{Tema oscuro?}
  E -- Si --> F[Mostrar Sun<br/>siguiente light]
  E -- No --> G[Mostrar Moon<br/>siguiente dark]
```

## REGLAS DE MANTENIMIENTO

- No usar `resolvedTheme` para decidir HTML antes de montar.
- Mantener `suppressHydrationWarning` en el `<html>` global.
- Si se crea otro boton de tema, debe seguir el mismo patron.
- El provider de tema debe envolver cualquier componente que use `useTheme`.

