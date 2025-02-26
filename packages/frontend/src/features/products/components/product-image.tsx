import { useContext } from "react";
import { ProductContext } from "@/src/features/products/context/product-context";

import { Typography } from "@/src/components/ui/typography";
import { AnimateImage } from "@/src/components/ui/animate-image";

export const ProductImage = () => {
  const product = useContext(ProductContext);

  if (!product) return null;

  return (
    <div className="rounded-lg overflow-hidden mb-1 flex relative w-full h-[200px]">
      <Typography className="bg-white p-2 py-1 text-xs font-medium text-zinc-700 absolute top-2 right-2 rounded-lg">
        {product.product_weight} г.
      </Typography>
      <AnimateImage src={product.image_src} alt={product.title} width={300} height={400} />
    </div>
  );
};
