# AUDITORIA DE FRONTEND, SEGURIDAD, OPTIMIZACION Y DEPLOY

Fecha de revision: 2026-05-30

Proyecto: `ecommerce-sosaimpor-frontend`

## 1. Estado general

La aplicacion esta en buen estado para continuar hacia despliegue en Vercel + backend/API gratuito. Ya tiene optimizaciones de busqueda, cache temporal, validacion de entorno de produccion y restriccion de dominios de imagenes.

Validaciones ejecutadas:

```txt
pnpm lint                OK
pnpm exec tsc --noEmit   OK
pnpm build               OK
pnpm audit --prod        1 vulnerabilidad moderada
```

Resultado de build:

```txt
/                  static
/_not-found        static
/carrito           static
/productos         dynamic
/productos/[slug]  dynamic
```

La app compila correctamente con Next 16.2.6 y Turbopack.

## 2. Hallazgos importantes

### Alta prioridad antes de produccion

#### 1. Vulnerabilidad moderada en dependencia transitiva

`pnpm audit --prod` reporta:

```txt
Package: postcss
Version vulnerable: <8.5.10
Ruta: next > postcss
Severidad: moderate
Motivo: XSS via Unescaped </style> in CSS Stringify Output
```

`pnpm why postcss` muestra dos versiones:

```txt
postcss@8.4.31 -> next@16.2.6
postcss@8.5.15 -> @tailwindcss/postcss@4.3.0
```

Recomendacion:

- Actualizar Next cuando exista version que resuelva su dependencia interna de `postcss`.
- Revisar con:

```txt
pnpm audit --prod
pnpm add next@latest eslint-config-next@latest
```

Se intento actualizar `next` y `eslint-config-next`, pero el registry disponible mantuvo `16.2.6` como version actual. No conviene editar manualmente el lockfile ni forzar una version no disponible.

#### 2. `NEXT_PUBLIC_API_URL` es obligatorio en produccion

El cliente HTTP ahora valida produccion:

```ts
NEXT_PUBLIC_API_URL es obligatoria en produccion
NEXT_PUBLIC_API_URL no puede apuntar a localhost en produccion
```

En desarrollo puede usar `http://localhost:3003` como fallback. En produccion falla con un error claro si falta la variable o si apunta a localhost.

Recomendacion:

- Configurar en el panel del hosting:

```txt
NEXT_PUBLIC_API_URL=https://tu-backend-produccion.com
NEXT_PUBLIC_IMAGE_HOSTNAME=dominio-de-imagenes.com
NEXT_PUBLIC_STORE_ADDRESS=...
NEXT_PUBLIC_STORE_MAP_URL=...
NEXT_PUBLIC_STORE_MAP_EMBED_URL=...
```

- Confirmar que el backend permita CORS desde el dominio real del frontend.

#### 3. Imagenes remotas restringidas

Antes `next.config.ts` permitia:

```ts
hostname: "**"
```

Ahora se elimino el wildcard. Los hosts permitidos salen de:

```txt
NEXT_PUBLIC_IMAGE_HOSTNAME
NEXT_PUBLIC_API_URL
localhost/127.0.0.1 solo en desarrollo
```

Tambien se agrego:

```txt
images.minimumCacheTTL = 7 dias
```

Recomendacion:

- En Vercel configurar `NEXT_PUBLIC_IMAGE_HOSTNAME` si las imagenes vienen de Cloudinary, S3, Supabase Storage u otro host distinto al backend.
- Si las imagenes vienen del mismo host del backend, basta con `NEXT_PUBLIC_API_URL`.

Ejemplo:

```txt
NEXT_PUBLIC_IMAGE_HOSTNAME=res.cloudinary.com
```

#### 4. Imagen principal con prioridad

Se agrego `priority` solo a imagenes principales de detalle:

```txt
ProductGallery
MobileProductDetail
```

Las cards/listados siguen con lazy loading por defecto para no cargar imagenes innecesarias.

## 3. Optimizacion actual de requests

La parte mas critica ya fue mejorada.

### ProductSearch

Estado actual:

- No consulta con 1 o 2 letras.
- Consulta desde 3 letras.
- Usa debounce de 350 ms.
- Ya no dispara la consulta duplicada `results` que no se usaba.

Ejemplo esperado:

```txt
f    -> no consulta
fa   -> no consulta
far  -> consulta despues de 350 ms
far  -> si se repite pronto, usa cache
```

### Cache temporal en memoria

Se implemento cache en memoria con `Map` en:

```txt
features/products/cache/productRequestCache.ts
```

No usa:

```txt
Provider
Context
Redux
Zustand
localStorage
sessionStorage
archivos JSON de cache
```

Tiempos actuales:

| Dato | Tiempo |
| --- | --- |
| Configuracion | 7 dias |
| Categorias destacadas | 1 dia |
| Filtros-opciones | 1 dia |
| Listado productos | 3 minutos |
| Sugerencias | 3 minutos |
| Detalle producto | 2 minutos |
| Relacionados | 5 minutos |

Tambien tiene limpieza para que no crezca demasiado:

```txt
maximo 150 entradas
primero elimina expiradas
si sigue superando el limite, elimina las mas antiguas
no elimina promesas en curso
```

Esto ayuda mucho para hosting/API gratis.

Importante:

Esta cache es temporal del navegador/proceso. No reemplaza la frescura real del backend. Si cambia stock, precio o activo, puede tardar unos minutos en reflejarse segun el tipo de request.

### Payload usado por listados

El adapter de cards/listados ahora evita construir la galeria completa en memoria. Para listados usa:

```txt
imagen_principal
nombre
precio
marca/modelo/anio
categoria
condicion
disponibilidad
```

La galeria completa se arma solo en detalle de producto.

Importante:

El frontend no puede impedir por si solo que el backend envie campos pesados. Para reducir payload real de red, el backend debe hacer que `GET /api/productos` no incluya descripcion larga, especificaciones completas ni todas las imagenes.

## 4. Seguridad frontend

### Puntos positivos

No se encontraron patrones peligrosos comunes:

```txt
dangerouslySetInnerHTML
innerHTML manual
eval()
localStorage/sessionStorage para productos
document.cookie manual
console.log de produccion
```

Los formularios de sugerencias tienen validacion en frontend:

```txt
minimo de palabras
minimo de caracteres
maximo de palabras
control de palabras repetidas
control de texto sospechoso
```

El envio usa `AbortController`, lo que evita dejar requests abiertos si se cierra el modal o se reenvia.

### Riesgos que dependen del backend

El frontend no puede proteger por si solo:

- Rate limit de busqueda.
- Rate limit de comentarios.
- Sanitizacion definitiva de comentarios.
- Validacion de filtros.
- Proteccion contra abuso de endpoints publicos.
- Indices y limites SQL.

Recomendacion backend para servidor gratuito:

```txt
limitar requests por IP
limitar POST /api/comentarios
validar y sanitizar texto en backend
limitar limit/page maximos
agregar indices en PostgreSQL
usar CORS con dominios permitidos
```

## 5. Organizacion del proyecto

La organizacion es clara y mantenible:

```txt
app/          rutas Next
components/   UI separada por movil, escritorio y compartidos
features/     logica por dominio: products, home, comments, cart
lib/          cliente HTTP y utilidades
providers/    provider de tema
public/       assets
documentacion/ documentacion tecnica
```

Puntos positivos:

- Separacion por dominio en `features`.
- Componentes separados por `movil`, `escritorio` y `compartidos`.
- Tipos TypeScript por feature.
- Cliente HTTP centralizado.
- Hooks reutilizables.

Riesgos leves:

- Hay muchos comentarios didacticos en el codigo. Ayudan a entender, pero a largo plazo pueden hacer archivos mas largos.
- `ProductPageContainer` concentra mucha logica. Funciona, pero podria crecer demasiado si se agregan mas features.
- Existen cambios sin commitear en muchas areas; antes de deploy conviene limpiar estado Git y hacer un commit estable.

## 6. Performance y servidor gratuito

### Bien actualmente

- Build correcto.
- TypeScript limpio.
- Lint limpio.
- Busqueda optimizada con debounce y minimo de caracteres.
- Cache temporal para requests repetidos.
- Filtros siguen consultando al aplicar, no por cada checkbox.
- Paginacion pide paginas concretas.
- Scroll movil tiene bloqueo para evitar disparos repetidos.
- Dominios de imagenes remotas restringidos.
- Cache de imagenes de Next configurada a 7 dias.
- Variables de produccion validadas para evitar localhost.

### Pendiente recomendado

#### 1. Reducir payload de listados desde backend

Para cards/listado solo deberian venir:

```txt
id
slug
nombre
precio
stock
marca
modelo
anio
condicion
imagen_principal
```

Detalle de producto si puede traer:

```txt
descripcion completa
imagenes
especificaciones
datos extendidos
```

Si `/api/productos` trae descripcion larga, todas las imagenes o especificaciones, el servidor gratuito trabajara de mas.

#### 2. Ordenar desde backend

El frontend tiene un comentario indicando que el orden por precio deberia venir desde SQL.

Para paginacion correcta, el backend debe hacer:

```sql
ORDER BY precio ASC/DESC
LIMIT ...
OFFSET ...
```

Si se ordena solo en frontend, se ordena la pagina actual, no todo el catalogo.

#### 3. Indices PostgreSQL

Minimo recomendado:

```sql
CREATE UNIQUE INDEX idx_productos_slug ON productos(slug);
CREATE INDEX idx_productos_categoria_id ON productos(categoria_id);
CREATE INDEX idx_productos_marca ON productos(marca);
CREATE INDEX idx_productos_modelo ON productos(modelo);
CREATE INDEX idx_productos_condicion ON productos(condicion);
CREATE INDEX idx_productos_anio ON productos(anio);
CREATE INDEX idx_productos_precio ON productos(precio);
```

Para busqueda textual:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_productos_nombre_trgm
ON productos USING gin (nombre gin_trgm_ops);
```

## 7. Checklist antes de desplegar

### Frontend

- Configurar `NEXT_PUBLIC_API_URL` real.
- Configurar variables publicas de mapa/direccion.
- Configurar `NEXT_PUBLIC_IMAGE_HOSTNAME` si el host de imagenes es distinto al backend.
- Confirmar que `images.remotePatterns` permite solo hosts reales.
- Ejecutar:

```txt
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm audit --prod
```

- Resolver cuando Next publique version con `postcss` parcheado o aceptar conscientemente la vulnerabilidad moderada transitiva.
- Confirmar que no se sube `.env`.
- Confirmar que `node_modules`, `.next`, `.pnpm-store`, `certificates` y `.env*` siguen ignorados.

### Backend/API

- CORS solo para el dominio real del frontend.
- Rate limit para busqueda y comentarios.
- Validaciones backend equivalentes a las del frontend.
- Sanitizacion de texto recibido.
- Limite maximo de `limit`.
- Indices SQL.
- Cache-Control para configuracion, categorias y filtros si aplica.

### Manual QA

- Buscar con 1 y 2 letras: no debe consultar.
- Buscar con 3 letras: consulta despues del debounce.
- Repetir busqueda: debe usar cache temporal.
- Filtros: solo consultan al presionar aplicar.
- Paginacion desktop funciona.
- Scroll movil funciona.
- Detalle de producto funciona.
- Relacionados funcionan.
- Modo claro/oscuro funciona.
- Responsive movil/escritorio no se rompe.
- Imagenes cargan desde el host final permitido.

## 8. Veredicto

La aplicacion puede prepararse para deploy en hosting gratuito, pero no deberia publicarse definitivamente sin estos puntos:

1. Configurar `NEXT_PUBLIC_API_URL` de produccion.
2. Configurar dominio real de imagenes si aplica.
3. Revisar la vulnerabilidad moderada de `postcss` transitiva de Next cuando haya update disponible.
4. Confirmar CORS, rate limit e indices en backend.
5. Verificar que el listado de productos no traiga payload excesivo.

Con esos puntos cubiertos, el frontend esta razonablemente optimizado para un servidor/API gratuito.
