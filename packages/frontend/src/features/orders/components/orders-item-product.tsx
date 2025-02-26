import { Typography } from "@/src/components/ui/typography";

import { Weight } from "lucide-react";
import Image from "next/image";

import { OrderProduct } from "@/src/features/orders/types/orders";

export const OrdersItemProduct = ({ product }: { product: OrderProduct }) => {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={product.product.image_src}
        alt={product.product.title}
        width={128}
        height={128}
        className="rounded-lg shrink-0 w-24 h-24 object-cover"
      />
      <div className="flex items-center flex-1">
        <div className="flex flex-col gap-0.5">
          <Typography variant="h4" className="max-sm:text-sm">
            {product.product.title}{" "}
            <span className="text-xs font-medium text-foreground/60 text-nowrap">
              {product.quantity} шт.
            </span>
          </Typography>
          <Typography className="text-xs text-zinc-500 font-semibold flex items-center text-nowrap gap-1">
            <Weight size={14} /> {Math.round(product.product.product_weight)} г.
          </Typography>
          <Typography className="line-clamp-1 text-xs font-medium text-zinc-400">
            {product.product.description}
          </Typography>
        </div>
        <aside className="text-sm font-medium text-zinc-500 ml-auto text-nowrap">
          {product.product.price * product.quantity} грн.
        </aside>
      </div>
    </div>
  );
};
