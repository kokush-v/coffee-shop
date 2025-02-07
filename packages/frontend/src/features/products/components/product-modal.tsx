"use client";

import { Modal } from "antd";
import React, { useContext, useState } from "react";

import { ProductModalFooter } from "@/src/features/products/components/product-modal-footer";
import { Typography } from "@/src/components/ui/typography";

import { ProductContext } from "@/src/features/products/context/product-context";

import { weight } from "@/src/lib/utils";
import { Weight } from "lucide-react";

export const ProductModal = ({ children }: { children: React.ReactNode }) => {
  const product = useContext(ProductContext);

  const [open, setOpen] = useState(false);

  if (!product) return null;

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Modal
        footer={() => <ProductModalFooter setOpen={setOpen} />}
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
        <Typography className="text-sm text-zinc-500 font-medium flex-row flex items-center gap-1">
          <Weight size={14} />
          {weight(product.weight)}
        </Typography>
        <Typography variant="p" className="text-sm mt-1 text-zinc-700">
          {product.description}
        </Typography>
      </Modal>
    </>
  );
};
