# Guia frontend de busqueda y filtros de productos

Esta guia explica como el frontend se conecta con las rutas publicas de productos de la API para:

- listar productos;
- paginar resultados;
- buscar desde una barra de busqueda;
- mostrar sugerencias mientras el usuario escribe;
- filtrar por una opcion;
- combinar varios filtros;
- llenar combobox con opciones reales del backend.

La idea principal es esta:

```txt
Componente TSX
   -> hook
      -> productsApi.ts
         -> axiosClient.ts
            -> ecommerce-sosaimpor-api
```

## Indice

1. [Archivos que participan](#1-archivos-que-participan)
2. [Idea simple del flujo](#2-idea-simple-del-flujo)
3. [Rutas del backend que usa el frontend](#3-rutas-del-backend-que-usa-el-frontend)
4. [Como trabaja `axiosClient.ts`](#4-como-trabaja-axiosclientts)
5. [Como trabaja `productsApi.ts`](#5-como-trabaja-productsapits)
6. [`useProducts.ts`: listar, buscar y filtrar](#6-useproductsts-listar-buscar-y-filtrar)
7. [Ejemplo TSX de filtros con `useProducts`](#7-ejemplo-tsx-de-filtros-con-useproducts)
8. [Ejemplo TSX de barra de busqueda](#8-ejemplo-tsx-de-barra-de-busqueda)
9. [Ejemplo TSX de sugerencias al escribir](#9-ejemplo-tsx-de-sugerencias-al-escribir)
10. [`useProductFilterOptions.ts`: opciones para combobox](#10-useproductfilteroptionsts-opciones-para-combobox)
11. [Ejemplo TSX de combobox de filtros](#11-ejemplo-tsx-de-combobox-de-filtros)
12. [Como se juntan combobox y productos filtrados](#12-como-se-juntan-combobox-y-productos-filtrados)
13. [Resumen rapido](#13-resumen-rapido)

## 1. Archivos que participan

### Frontend

| Archivo | Para que sirve |
| --- | --- |
| `lib/axiosClient.ts` | Base que arma la URL completa y hace la peticion HTTP |
| `features/products/api/productsApi.ts` | Decide que ruta de productos se consulta |
| `features/products/types/product.types.ts` | Describe la forma de filtros, productos, paginacion y opciones |
| `features/products/hooks/useProducts.ts` | Hook para listar, buscar y filtrar productos |
| `features/products/hooks/useProductFilterOptions.ts` | Hook para traer opciones de filtros |

### Backend consultado

La guia de rutas del backend esta en:

```txt
ecommerce-sosaimpor-api/documentacion/FILTRACION_Y_PAGINACION_PRODUCTOS.md
```

## 2. Idea simple del flujo

Piensa en dos trabajos distintos:

### Trabajo A: traer productos

Este trabajo usa:

```txt
useProducts.ts
```

Sirve para:

- listado del catalogo;
- paginacion;
- barra de busqueda;
- sugerencias;
- productos filtrados.

### Trabajo B: traer opciones para los filtros

Este trabajo usa:

```txt
useProductFilterOptions.ts
```

Sirve para llenar controles como:

- combobox de categorias;
- combobox de marcas;
- combobox de modelos;
- combobox de anios;
- opciones de condicion;
- rango de precios;
- disponibilidad.

El hook de opciones **no filtra productos por si solo**. Solo trae las opciones disponibles.

## 3. Rutas del backend que usa el frontend

### Ruta para productos

La API usa una misma ruta base:

```http
GET /api/productos
```

No se crean rutas distintas para cada filtro. Lo que cambia son los query params despues del signo `?`.

### Ejemplos

Listado paginado:

```http
GET /api/productos?page=1&limit=12
```

Busqueda:

```http
GET /api/productos?search=faro&page=1&limit=12
```

Un filtro:

```http
GET /api/productos?marca=Toyota&page=1&limit=12
```

Busqueda con varios filtros:

```http
GET /api/productos?categoria_id=1&marca=Toyota&search=faro&page=1&limit=12
```

### Ruta para opciones de filtros

Para llenar combobox y controles de filtros:

```http
GET /api/productos/filtros-opciones
```

Esa ruta devuelve un JSON con categorias, marcas, modelos, tipos de producto, condiciones, anios, precios y disponibilidad.

## 4. Como trabaja `axiosClient.ts`

Archivo:

```txt
lib/axiosClient.ts
```

Este archivo es la base para hablar con el backend.

Si el frontend pide esta ruta:

```txt
/api/productos
```

`axiosClient.ts` la une con la URL base:

```txt
http://localhost:3003
```

Resultado:

```txt
http://localhost:3003/api/productos
```

En produccion la base debe venir de:

```env
NEXT_PUBLIC_API_URL=https://tu-backend
```

`axiosClient.ts` tambien:

- agrega query params cuando hacen falta;
- hace la peticion con `fetch`;
- devuelve el JSON;
- lanza un error entendible si el backend responde mal.

## 5. Como trabaja `productsApi.ts`

Archivo:

```txt
features/products/api/productsApi.ts
```

Este archivo es el puente entre los hooks y el cliente HTTP.

### Parte 1: ruta base

```ts
const productsPath = "/api/productos";
```

Esa parte no cambia cuando buscas o filtras.

### Parte 2: armar el texto de filtros

La funcion importante es:

```ts
createProductsQueryString(params)
```

Ejemplo de entrada:

```ts
{
  search: "faro",
  marca: "Toyota",
  page: 1,
  limit: 12,
}
```

Ejemplo de salida:

```txt
search=faro&marca=Toyota&page=1&limit=12
```

### Parte 3: pegar los filtros a la ruta

Despues `getProductsByQueryString` arma la ruta final:

```txt
/api/productos?search=faro&marca=Toyota&page=1&limit=12
```

### Parte 4: pedir productos

Esta funcion se usa para productos:

```ts
getProducts(...)
```

Ejemplos:

```ts
getProducts({ page: 1, limit: 12 });
getProducts({ search: "faro", page: 1, limit: 12 });
getProducts({ marca: "Toyota", page: 1, limit: 12 });
getProducts({
  categoria_id: 1,
  marca: "Toyota",
  search: "faro",
  page: 1,
  limit: 12,
});
```

### Parte 5: pedir opciones para filtros

Esta funcion consulta la ruta de opciones:

```ts
getProductFilterOptions()
```

Ruta consultada:

```http
GET /api/productos/filtros-opciones
```

## 6. `useProducts.ts`: listar, buscar y filtrar

Archivo:

```txt
features/products/hooks/useProducts.ts
```

Este hook recibe los filtros desde un componente TSX.

Ejemplo:

```ts
const result = useProducts({
  search: "faro",
  marca: "Toyota",
  page: 1,
  limit: 12,
});
```

El hook devuelve:

| Dato | Significado |
| --- | --- |
| `products` | Productos que respondio la API |
| `pagination` | Pagina actual, total, paginas disponibles |
| `isLoading` | Dice si la consulta esta cargando |
| `error` | Mensaje si la API falla |

### Que tipos de uso cubre

Solo listado:

```ts
useProducts({ page: 1, limit: 12 });
```

Busqueda:

```ts
useProducts({ search: "faro", page: 1, limit: 12 });
```

Un filtro:

```ts
useProducts({ marca: "Toyota", page: 1, limit: 12 });
```

Varios filtros:

```ts
useProducts({
  categoria_id: 1,
  marca: "Toyota",
  modelo: "Hilux",
  precio_min: 100,
  precio_max: 800,
  page: 1,
  limit: 12,
});
```

Busqueda mas varios filtros:

```ts
useProducts({
  search: "faro",
  categoria_id: 1,
  marca: "Toyota",
  modelo: "Hilux",
  page: 1,
  limit: 12,
});
```

## 7. Ejemplo TSX de filtros con `useProducts`

Este ejemplo muestra una marca y una categoria seleccionadas desde estados del componente.

```tsx
"use client";

import { useState } from "react";

import { useProducts } from "@/features/products/hooks/useProducts";

export function FilteredProductsExample() {
  const [marca, setMarca] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const { products, pagination, isLoading, error } = useProducts({
    page: 1,
    limit: 12,
    marca: marca || undefined,
    categoria_id: categoriaId ? Number(categoriaId) : undefined,
  });

  return (
    <section>
      <div>
        <label>
          Marca
          <select value={marca} onChange={(event) => setMarca(event.target.value)}>
            <option value="">Todas</option>
            <option value="Toyota">Toyota</option>
            <option value="Nissan">Nissan</option>
          </select>
        </label>

        <label>
          Categoria
          <select value={categoriaId} onChange={(event) => setCategoriaId(event.target.value)}>
            <option value="">Todas</option>
            <option value="1">Faros</option>
            <option value="2">Motores</option>
          </select>
        </label>
      </div>

      {isLoading && <p>Cargando productos...</p>}
      {error && <p>{error}</p>}

      <p>Total encontrado: {pagination?.total ?? 0}</p>

      {products.map((product) => (
        <article key={product.id}>
          <h2>{product.nombre}</h2>
          <p>{product.marca}</p>
          <p>S/ {product.precio}</p>
        </article>
      ))}
    </section>
  );
}
```

Cuando `marca` vale `Toyota`, el hook puede consultar algo como:

```http
GET /api/productos?page=1&limit=12&marca=Toyota
```

Cuando tambien hay categoria, puede quedar:

```http
GET /api/productos?page=1&limit=12&marca=Toyota&categoria_id=1
```

## 8. Ejemplo TSX de barra de busqueda

Este ejemplo busca productos cuando el texto cambia.

```tsx
"use client";

import { useState } from "react";

import { useProducts } from "@/features/products/hooks/useProducts";

export function ProductSearchResultsExample() {
  const [search, setSearch] = useState("");

  const { products, isLoading, error } = useProducts({
    search: search || undefined,
    page: 1,
    limit: 12,
  });

  return (
    <section>
      <label>
        Buscar repuesto
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Escribe faro, Toyota, Hilux..."
        />
      </label>

      {isLoading && <p>Buscando...</p>}
      {error && <p>{error}</p>}

      {products.map((product) => (
        <article key={product.id}>
          <h2>{product.nombre}</h2>
          <p>{product.codigo_producto}</p>
        </article>
      ))}
    </section>
  );
}
```

Si el usuario escribe `faro`, el hook consulta una ruta como:

```http
GET /api/productos?search=faro&page=1&limit=12
```

## 9. Ejemplo TSX de sugerencias al escribir

Para sugerencias no conviene cargar todos los productos. Se consulta con un `limit` pequeno.

La API recomienda empezar desde 2 caracteres. Por eso este ejemplo:

- no consulta si el usuario escribio solo `t`;
- consulta si escribio `to`;
- consulta otra vez si escribio `toy`;
- trae pocas sugerencias con `limit: 4`.

```tsx
"use client";

import { useState } from "react";

import { useProducts } from "@/features/products/hooks/useProducts";

export function ProductSearchSuggestionsExample() {
  const [search, setSearch] = useState("");
  const cleanSearch = search.trim();

  const { products, isLoading, error } = useProducts(
    {
      search: cleanSearch,
      page: 1,
      limit: 4,
    },
    {
      enabled: cleanSearch.length >= 2,
    },
  );

  return (
    <div>
      <label>
        Buscar repuesto
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Escribe para buscar"
        />
      </label>

      {cleanSearch.length < 2 && <p>Escribe al menos 2 letras.</p>}
      {isLoading && <p>Buscando sugerencias...</p>}
      {error && <p>{error}</p>}

      <div>
        {products.map((product) => (
          <button key={product.id} type="button">
            <strong>{product.nombre}</strong>
            <span>{product.marca}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

Ejemplo del viaje de cada texto:

```txt
t
-> no consulta todavia

to
-> GET /api/productos?search=to&page=1&limit=4

toy
-> GET /api/productos?search=toy&page=1&limit=4
```

> Nota: este ejemplo consulta cuando cambia el texto y el hook cancela consultas viejas si el texto cambia rapido. Si despues se quiere esperar unos milisegundos antes de consultar, se puede agregar debounce en el componente o en un hook auxiliar.

## 10. `useProductFilterOptions.ts`: opciones para combobox

Archivo:

```txt
features/products/hooks/useProductFilterOptions.ts
```

Este hook consulta:

```http
GET /api/productos/filtros-opciones
```

Ejemplo:

```ts
const { options, isLoading, error } = useProductFilterOptions();
```

El dato `options` puede incluir:

```ts
options?.categorias;
options?.marcas;
options?.modelos;
options?.tipos_producto;
options?.condiciones;
options?.anios;
options?.precios;
options?.disponibilidad;
```

### Diferencia con `useProducts`

| Hook | Para que se usa |
| --- | --- |
| `useProducts` | Trae productos resultantes |
| `useProductFilterOptions` | Trae opciones para construir controles de filtros |

## 11. Ejemplo TSX de combobox de filtros

Este ejemplo arma combobox de marca y categoria con datos reales del backend.

```tsx
"use client";

import { useState } from "react";

import { useProductFilterOptions } from "@/features/products/hooks/useProductFilterOptions";

export function ProductFilterComboboxExample() {
  const [marca, setMarca] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const { options, isLoading, error } = useProductFilterOptions();

  if (isLoading) {
    return <p>Cargando opciones de filtros...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <label>
        Marca
        <select value={marca} onChange={(event) => setMarca(event.target.value)}>
          <option value="">Todas</option>
          {options?.marcas.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label>
        Categoria
        <select value={categoriaId} onChange={(event) => setCategoriaId(event.target.value)}>
          <option value="">Todas</option>
          {options?.categorias.map((option) => (
            <option key={option.id} value={option.id}>
              {option.nombre}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
```

En este ejemplo:

- `useProductFilterOptions` llena los combobox;
- `marca` y `categoriaId` guardan lo que eligio el usuario;
- todavia no se estan pidiendo productos filtrados.

## 12. Como se juntan combobox y productos filtrados

Este ejemplo une los dos hooks:

- `useProductFilterOptions` llena los combobox;
- `useProducts` usa la marca y categoria elegidas para consultar productos.

```tsx
"use client";

import { useState } from "react";

import { useProductFilterOptions } from "@/features/products/hooks/useProductFilterOptions";
import { useProducts } from "@/features/products/hooks/useProducts";

export function ProductsWithRealFilterOptionsExample() {
  const [marca, setMarca] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const filterOptions = useProductFilterOptions();

  const productResults = useProducts({
    page: 1,
    limit: 12,
    marca: marca || undefined,
    categoria_id: categoriaId ? Number(categoriaId) : undefined,
  });

  return (
    <section>
      <div>
        <label>
          Marca
          <select value={marca} onChange={(event) => setMarca(event.target.value)}>
            <option value="">Todas</option>
            {filterOptions.options?.marcas.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          Categoria
          <select value={categoriaId} onChange={(event) => setCategoriaId(event.target.value)}>
            <option value="">Todas</option>
            {filterOptions.options?.categorias.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filterOptions.isLoading && <p>Cargando opciones...</p>}
      {filterOptions.error && <p>{filterOptions.error}</p>}

      {productResults.isLoading && <p>Cargando productos...</p>}
      {productResults.error && <p>{productResults.error}</p>}

      {productResults.products.map((product) => (
        <article key={product.id}>
          <h2>{product.nombre}</h2>
          <p>{product.categoria_nombre}</p>
          <p>{product.marca}</p>
        </article>
      ))}
    </section>
  );
}
```

Si el usuario selecciona:

```txt
Categoria: 1
Marca: Toyota
```

`useProducts` termina consultando una ruta parecida a:

```http
GET /api/productos?page=1&limit=12&marca=Toyota&categoria_id=1
```

## 13. Resumen rapido

### Para traer productos

Usa:

```ts
useProducts(...)
```

Sirve para:

- listado;
- paginacion;
- filtros;
- busqueda;
- sugerencias.

### Para llenar filtros

Usa:

```ts
useProductFilterOptions()
```

Sirve para:

- categorias;
- marcas;
- modelos;
- condiciones;
- anios;
- disponibilidad;
- precios.

### Regla mental final

```txt
useProductFilterOptions
-> llena los controles de filtro

useProducts
-> trae los productos que coinciden con los filtros elegidos
```
