// ============================================================
// TIPOS DE CATEGORIAS DESTACADAS
// ============================================================
// Estos tipos describen la respuesta publica de categorias destacadas.
// Ruta usada por el frontend:
// GET /api/categorias/destacadas

export type FeaturedCategoryApiItem = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_url: string | null;
  color_hex: string | null;
  color_texto_hex: string | null;
  destacada: boolean;
  orden_destacado?: number | null;
  orden?: number | null;
};

export type FeaturedCategoryListResponse = {
  ok: true;
  data: FeaturedCategoryApiItem[];
  pagination: null;
};

