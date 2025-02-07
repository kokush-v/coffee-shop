import { Typography } from "@/src/components/ui/typography";

import { ProductImage } from "@/src/features/products/components/product-image";
import { ProductModal } from "@/src/features/products/components/product-modal";

import { Product } from "@/src/features/products/types/product";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <ProductModal product={product}>
      <div className="w-full max-sm:w-54">
        <ProductImage product={product} />
        <div className="px-2">
          <div className="flex flex-row justify-between items-center">
            <Typography className="max-sm:text-sm line-clamp-1 mr-2" variant="h3">
              {product.title}
            </Typography>
            <Typography className="text-sm font-semibold text-zinc-700 max-sm:text-xs text-nowrap">
              {product.price} грн.
            </Typography>
          </div>
          <Typography className="text-xs text-zinc-500 font-medium line-clamp-3">
            {product.description}
          </Typography>
        </div>
      </div>
    </ProductModal>
  );
};
