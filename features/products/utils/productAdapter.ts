import type { Product, ProductApiItem } from "@/features/products/types/product.types";

function formatProductCondition(condition: string | null): Product["condition"] {
  if (condition === "nuevo") {
    return "Nuevo";
  }

  if (condition === "usado_importado") {
    return "Usado importado";
  }

  return "Reacondicionado";
}

export function apiProductToProduct(product: ProductApiItem): Product {
  return {
    id: String(product.id),
    slug: product.slug,
    name: product.nombre,
    category: product.categoria_nombre ?? product.tipo_producto ?? "Producto",
    categoryColor: product.color_hex,
    categoryTextColor: product.color_texto_hex,
    description: [product.marca, product.modelo, product.tipo_producto]
      .filter(Boolean)
      .join(" · "),
    year: product.anio?.toString() ?? "Sin anio",
    price: Number(product.precio),
    image: product.imagen_principal,
    availability: product.proximamente ? "Proximamente" : "Disponible",
    condition: formatProductCondition(product.condicion),
  };
}
