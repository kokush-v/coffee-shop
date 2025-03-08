"use client";

import { ResponsiveDialog } from "@/src/components/ui/responsive-dialog";
import { Typography } from "@/src/components/ui/typography";

import { ProductImage } from "@/src/features/products/components/product-image";
import { ProductModalContent } from "@/src/features/products/components/product-modal-content";

import { ProductContext } from "@/src/features/products/context/product-context";

import { Product } from "@/src/features/products/types/product";
import { useState } from "react";

export const ProductCard = ({ product }: { product: Product }) => {
  const [open, setOpen] = useState(false);

  return (
    <ProductContext.Provider value={product}>
      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        trigger={
          <div className="w-full max-sm:w-54 cursor-pointer">
            <ProductImage />
            <div className="px-2">
              <div className="flex flex-row justify-between items-center">
                <Typography className="max-sm:text-sm line-clamp-1 mr-2 text-left" variant="h3">
                  {product.title}
                </Typography>
                <Typography className="text-sm font-semibold text-zinc-700 max-sm:text-xs text-nowrap">
                  {product.price} грн.
                </Typography>
              </div>
              <Typography className="text-xs text-zinc-500 font-medium line-clamp-3 text-left">
                {product.description}
              </Typography>
            </div>
          </div>
        }
      >
        <ProductModalContent setOpen={setOpen} />
      </ResponsiveDialog>
    </ProductContext.Provider>
  );
};
