import { ProductsLayout } from "@/src/features/products/ui/products-layout";

import productsService from "@/src/features/products/api/product-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await productsService.getProducts();

  return <ProductsLayout initialData={products} />;
}
