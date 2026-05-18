export type ProductCondition = "Usado importado" | "Usado local" | "Reacondicionado";

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
