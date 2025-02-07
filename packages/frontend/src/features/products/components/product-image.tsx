import { useContext } from "react";
import { ProductContext } from "@/src/features/products/context/product-context";

import { Typography } from "@/src/components/ui/typography";

import { weight } from "@/src/lib/utils";

export const ProductImage = () => {
  const product = useContext(ProductContext);

  if (!product) return null;

  return (
    <div className="rounded-lg overflow-hidden mb-1 flex relative w-full h-40">
      <Typography className="bg-white p-2 py-1 text-xs font-medium text-zinc-700 absolute top-2 right-2 rounded-lg">
        {weight(product.weight)}
      </Typography>
      <div className="flex-1 bg-zinc-100"></div>
    </div>
  );
};
