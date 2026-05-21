// ============================================================
// TIPOS DE PRODUCTOS
// ============================================================
// Un type es un mapa que explica que forma tienen los datos.
// Ayuda a que TypeScript avise si usamos un campo que no existe.

// Tipo usado por los productos mock que ya existian en las cards del frontend.
export type ProductCondition = "Usado importado" | "Usado local" | "Reacondicionado";

// Este Product describe la forma vieja/local que hoy usan algunas cards mock.
// Se conserva para no romper la UI mientras se conecta la API real por partes.
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  year: string;
  price: number;
  availability: "Disponible" | "Proximamente";
  condition: ProductCondition;
};

// Valores que entiende el backend para filtrar disponibilidad.
export type ProductAvailabilityFilter = "disponible" | "proximamente";

// >>> TIPO IMPORTANTE: PRODUCTO QUE LLEGA DE LA API <<<
// Estos nombres vienen del backend y de PostgreSQL.
// Por eso aqui se usa nombre, descripcion, precio e imagen_principal.
export type ProductApiItem = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  tipo_producto: string | null;
  marca: string | null;
  modelo: string | null;
  anio: number | null;
  codigo_producto: string | null;
  condicion: string | null;
  precio: string;
  stock: number;
  proximamente: boolean;
  destacado: boolean;
  categoria_id: number;
  categoria_nombre: string | null;
  imagen_principal: string | null;
};

// >>> TIPO IMPORTANTE: FILTROS QUE PUEDE ENVIAR EL FRONTEND <<<
// Cada campo opcional puede viajar como query param hacia GET /api/productos.
// Ejemplo: search, marca, precio_min o categoria_id.
export type ProductListParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoria_id?: number;
  marca?: string;
  modelo?: string;
  tipo_producto?: string;
  condicion?: string;
  anio?: number;
  anio_min?: number;
  anio_max?: number;
  precio_min?: number;
  precio_max?: number;
  disponibilidad?: ProductAvailabilityFilter;
  stock?: number;
  destacado?: boolean;
};

// Informacion que devuelve la API para saber cuantas paginas existen.
export type ProductPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

// >>> TIPO IMPORTANTE: RESPUESTA DEL LISTADO DE PRODUCTOS <<<
// data trae los productos y pagination trae el estado de la paginacion.
export type ProductListResponse = {
  ok: true;
  data: ProductApiItem[];
  pagination: ProductPagination;
};

// Forma de una categoria dentro de las opciones para filtros.
export type ProductFilterCategory = {
  id: number;
  nombre: string;
  slug: string;
};

// >>> TIPO IMPORTANTE: OPCIONES DEL FORMULARIO DE FILTROS <<<
// Este objeto llena selects y controles del frontend sin escribir opciones a mano.
export type ProductFilterOptions = {
  categorias: ProductFilterCategory[];
  marcas: string[];
  modelos: string[];
  tipos_producto: string[];
  condiciones: string[];
  anios: number[];
  precios: {
    precio_min: string | null;
    precio_max: string | null;
  };
  disponibilidad: ProductAvailabilityFilter[];
};

// Respuesta de GET /api/productos/filtros-opciones.
export type ProductFilterOptionsResponse = {
  ok: true;
  data: ProductFilterOptions;
  pagination: null;
};
