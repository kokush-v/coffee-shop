import { Typography } from "@/src/components/ui/typography";

import { Weight } from "lucide-react";
import Image from "next/image";

import { CartItem } from "@/src/features/cart/types/cart";

export const OrdersItemProduct = ({ item }: { item: CartItem }) => {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={item.product.image_src}
        alt={item.product.title}
        width={128}
        height={128}
        className="rounded-lg shrink-0 w-24 h-24 object-cover"
      />
      <div className="flex items-center flex-1">
        <div className="flex flex-col gap-0.5">
          <Typography variant="h4">
            {item.quantity} <span className="text-zinc-500">x</span> {item.product.title}
          </Typography>
          <Typography className="text-xs text-zinc-500 font-semibold flex items-center text-nowrap gap-1">
            <Weight size={14} /> {Math.round(item.product.product_weight)} г.
          </Typography>
          <Typography className="line-clamp-1 text-xs font-medium text-zinc-400">
            {item.product.description}
          </Typography>
        </div>
        <aside className="text-sm font-medium text-zinc-500 ml-auto text-nowrap">
          {item.product.price * item.quantity} грн.
        </aside>
      </div>
    </div>
  );
};
