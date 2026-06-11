import type { Product, ProductApiItem, ProductDetail } from "@/features/products/types/product.types";

function getProductImages(product: ProductApiItem) {
  return (product.imagenes ?? [])
    .map((image) => ({
      id: String(image.id),
      url: image.imagen_url,
      principal: image.principal,
      order: image.orden,
    }))
    .sort((firstImage, secondImage) => {
      if (firstImage.principal !== secondImage.principal) {
        return firstImage.principal ? -1 : 1;
      }

      return firstImage.order - secondImage.order;
    });
}

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
    year: product.anio?.toString() ?? "Sin año",
    price: Number(product.precio),
    image: product.imagen_principal,
    // Los listados solo usan imagen_principal. La galeria completa se arma solo en el detalle.
    images: [],
    availability: product.proximamente ? "Próximamente" : "Disponible",
    condition: formatProductCondition(product.condicion),
  };
}

export function apiProductToProductDetail(product: ProductApiItem): ProductDetail {
  const baseProduct = apiProductToProduct(product);

  return {
    ...baseProduct,
    brand: product.marca,
    code: product.codigo_producto,
    description: product.descripcion || baseProduct.description,
    featured: product.destacado,
    images: getProductImages(product),
    model: product.modelo,
    productType: product.tipo_producto,
    rawDescription: product.descripcion,
    specifications: (product.especificaciones ?? []).map((specification) => ({
      id: String(specification.id),
      name: specification.nombre,
      value: specification.valor,
    })),
    stock: product.stock,
  };
}
