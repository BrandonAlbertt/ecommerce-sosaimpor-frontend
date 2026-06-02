import { ProductDetailContainer } from "@/components/compartidos/product-detail/ProductDetailContainer";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  return <ProductDetailContainer slug={slug} />;
}
