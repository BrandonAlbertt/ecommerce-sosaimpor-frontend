# Guia rapida: error "Failed to construct URL: Invalid base URL"

## Que error era

<span style="color:#dc2626"><strong>Error:</strong></span>

```txt
Failed to construct URL: Invalid base URL
```

Significa que el frontend intento crear una URL para llamar al backend, pero la
base de la API no tenia formato valido.

## Causa

En `.env` estaba asi:

```env
NEXT_PUBLIC_API_URL=ecommerce-sosaimpor-api-production.up.railway.app/
```

<span style="color:#dc2626"><strong>Problema:</strong></span> falta `https://`.

JavaScript necesita una URL completa para que esto funcione:

```ts
new URL("/api/productos", `${baseURL}/`)
```

## Solucion

Debe quedar asi:

```env
NEXT_PUBLIC_API_URL=https://ecommerce-sosaimpor-api-production.up.railway.app
```

<span style="color:#16a34a"><strong>Correcto:</strong></span> tiene protocolo
`https://` y no depende de una IP local.

## Diagrama

```txt
[Frontend Next.js]
        |
        | lee NEXT_PUBLIC_API_URL
        v
[https://ecommerce-sosaimpor-api-production.up.railway.app]
        |
        | agrega ruta publica
        v
[https://ecommerce-sosaimpor-api-production.up.railway.app/api/productos]
        |
        v
[Backend Railway]
```

## En Vercel

En **Environment Variables** configurar:

```txt
Key:   NEXT_PUBLIC_API_URL
Value: https://ecommerce-sosaimpor-api-production.up.railway.app
```

Luego hacer **Redeploy**. Si el deploy anterior salio con la variable mala,
Vercel no lo arregla hasta desplegar otra vez.

## Como levantar el proyecto local

1. Confirmar que `.env` tenga:

```env
NEXT_PUBLIC_API_URL=https://ecommerce-sosaimpor-api-production.up.railway.app
```

2. Instalar dependencias si hace falta:

```bash
pnpm install
```

3. Levantar el frontend:

```bash
pnpm dev
```

4. Abrir:

```txt
http://localhost:3000
```

## Checklist rapido

- <span style="color:#16a34a">OK</span> La URL empieza con `https://`.
- <span style="color:#16a34a">OK</span> No apunta a `localhost`.
- <span style="color:#16a34a">OK</span> No apunta a `192.168.x.x`.
- <span style="color:#16a34a">OK</span> En Vercel se hizo redeploy despues de cambiar la variable.

