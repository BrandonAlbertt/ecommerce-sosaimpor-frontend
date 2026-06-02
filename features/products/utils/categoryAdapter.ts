import type { FeaturedCategoryApiItem } from "@/features/products/types/category.types";
import type { CategoryItem } from "@/features/products/types/product.types";

const categoryBorderColors = [
  "border-t-blue-700",
  "border-t-amber-500",
  "border-t-slate-700",
  "border-t-teal-600",
  "border-t-red-700",
  "border-t-orange-900",
  "border-t-blue-800",
  "border-t-purple-700",
];

export function apiFeaturedCategoryToCategoryItem(
  category: FeaturedCategoryApiItem,
  index: number,
): CategoryItem {
  return {
    id: String(category.id),
    slug: category.slug,
    name: category.nombre,
    image: category.imagen_url,
    color: categoryBorderColors[index % categoryBorderColors.length],
    colorHex: category.color_hex,
    textColorHex: category.color_texto_hex,
  };
}

