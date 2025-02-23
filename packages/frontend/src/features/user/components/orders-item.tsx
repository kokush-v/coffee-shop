import { OrdersItemProduct } from "@/src/features/user/components/orders-item-product";
import { Typography } from "@/src/components/ui/typography";

import { CartItem } from "@/src/features/cart/types/cart";

import { overallPrice } from "@/src/lib/utils";

export const OrdersItem = ({ items }: { items: CartItem[] }) => {
  const price: number = overallPrice(items);

  return (
    <div>
      <div className="flex flex-row items-center">
        <Typography variant="h3" className="text-zinc-600">
          Замовлення #1
        </Typography>
        <Typography className="text-zinc-600 font-semibold ml-auto">{price} грн.</Typography>
      </div>
      <section className="space-y-2">
        {items.map((product, index) => (
          <OrdersItemProduct key={index} item={product} />
        ))}
      </section>
    </div>
  );
};
