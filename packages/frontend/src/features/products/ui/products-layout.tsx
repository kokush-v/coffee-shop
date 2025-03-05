import { ProductCard } from "@/src/features/products/components/product-card";

import productsService from "@/src/features/products/api/product-service";

export const ProductsLayout = async () => {
  const products = await productsService.getProducts();

  return (
    <div className="px-2 mx-auto grid gap-4 grid-cols-1 min-[500px]:grid-cols-2 min-[710px]:grid-cols-3 my-4 max-w-[880px] items-start">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};
