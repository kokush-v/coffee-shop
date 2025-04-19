"use client";

import React, { useContext } from "react";

import { Typography } from "@/src/components/ui/typography";

import { ProductContext } from "@/src/features/products/context/product-context";

import { Text, Weight } from "lucide-react";
import { ProductModalFooter } from "@/src/features/products/components/product-modal-footer";
import Image from "next/image";
import { AspectRatio } from "@/src/components/ui/aspect-ratio";
import { CredenzaContent, CredenzaTitle } from "@/src/components/ui/credenza";

export const ProductModalContent = ({ setOpen }: { setOpen: (state: boolean) => void }) => {
  const product = useContext(ProductContext);

  if (!product) return null;

  return (
    <CredenzaContent className="min-[520px]:pt-10">
      <AspectRatio ratio={4 / 3}>
        <Image
          fill
          alt={product.title}
          src={product.image_src}
          className="rounded-lg object-scale-down mb-1.5 h-auto w-auto"
        />
      </AspectRatio>
      <CredenzaTitle className="mt-1 text-2xl font-bold">{product.title}</CredenzaTitle>
      <Typography className="text-sm text-zinc-500 font-medium flex-row flex items-center gap-1">
        <Weight size={14} />
        {product.product_weight} г.
      </Typography>
      <div className="h-[90%] flex-1 mb-1.5">
        <div className="flex items-center gap-1">
          <Text size={18} />
          <p className="text-sm font-medium">Опис</p>
        </div>
        <Typography variant="p" className="text-sm text-zinc-500 font-medium">
          {product.description}
        </Typography>
      </div>
      <ProductModalFooter setOpen={setOpen} />
    </CredenzaContent>
  );
};
