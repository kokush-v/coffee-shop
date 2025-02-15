"use client";

import { Typography } from "@/src/components/ui/typography";
import { OrdersItem } from "@/src/features/user/components/orders-item";

import { useAppSelector } from "@/src/store";

export const Orders = () => {
  const cart = useAppSelector((state) => state.cart);
  return (
    <div>
      <Typography variant="h2" className="text-zinc-700">
        Мої замовлення
      </Typography>
      <main className="space-y-2">
        <OrdersItem items={cart.items} />
        <OrdersItem items={cart.items} />
        <OrdersItem items={cart.items} />
        <OrdersItem items={cart.items} />
        <OrdersItem items={cart.items} />
      </main>
    </div>
  );
};
