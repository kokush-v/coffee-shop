import { Typography } from "@/src/components/ui/typography";

import { Product } from "@/src/features/products/types/product";

export const ProductImage = ({ product }: { product: Product }) => {
  return (
    <div className="rounded-lg overflow-hidden mb-1 flex relative w-full h-40">
      <Typography className="bg-white p-2 py-1 text-xs font-medium text-zinc-700 absolute top-2 right-2 rounded-lg">
        {product.weight} г.
      </Typography>
      <div className="flex-1 bg-zinc-100"></div>
    </div>
  );
};
