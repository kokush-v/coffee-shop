"use client";

import { Modal } from "antd";
import React, { useState } from "react";

import { ProductModalFooter } from "@/src/features/products/components/product-modal-footer";
import { Typography } from "@/src/components/ui/typography";

import { Product } from "@/src/features/products/types/product";

export const ProductModal = ({
  children,
  product,
}: {
  product: Product;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Modal
        footer={() => <ProductModalFooter />}
        centered
        onCancel={() => setOpen(false)}
        open={open}
        closable={false}
      >
        <div className="bg-zinc-100 w-full h-[240px] mb-2 rounded-lg"></div>

        <div className="flex flex-row justify-between items-baseline">
          <Typography variant="h2">{product.title}</Typography>
          <Typography variant="h4" className="text-nowrap">
            {product.price} грн.
          </Typography>
        </div>
        <Typography className="text-sm text-zinc-500 font-medium">
          {product.weight} г.
        </Typography>
        <Typography variant="p" className="text-sm mt-1 text-zinc-700">
          {product.description}
        </Typography>
      </Modal>
    </>
  );
};
