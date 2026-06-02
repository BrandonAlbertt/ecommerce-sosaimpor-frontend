import { ProductPageContainer } from "@/components/compartidos/productos/ProductPageContainer";

type ProductosPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const { search } = await searchParams;

  return <ProductPageContainer initialSearch={search} />;
}
