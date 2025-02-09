import Image from "next/image";

import { useContext } from "react";
import { ProductContext } from "@/src/features/products/context/product-context";

import { Typography } from "@/src/components/ui/typography";

export const ProductImage = () => {
  const product = useContext(ProductContext);

  if (!product) return null;

  return (
    <div className="rounded-lg overflow-hidden mb-1 flex relative w-full h-40">
      <Typography className="bg-white p-2 py-1 text-xs font-medium text-zinc-700 absolute top-2 right-2 rounded-lg">
        {product.product_weight} г.
      </Typography>
      <Image src={product.image_src} alt={product.title} width={300} height={400} className="flex-1 bg-zinc-100" />
    </div>
  );
};
