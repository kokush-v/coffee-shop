import { Typography } from "@/src/components/ui/typography";
import { CartProductsNote } from "@/src/features/cart/components/cart-products-note";

import { useAppSelector } from "@/src/store";

import { overallPrice } from "@/src/lib/utils";

export const PopoverTitle = () => {
  const items = useAppSelector((state) => state.cart.items);

  const price: number = overallPrice(items);

  return (
    <div className="flex flex-row justify-between items-center">
      <Typography variant="h2" className="text-lg font-semibold">
        Кошик
      </Typography>
      <div className="flex flex-row items-center gap-1.5">
        <Typography variant="p" className="font-semibold text-zinc-700">
          Вартість: {price} грн.
        </Typography>
        <CartProductsNote />
      </div>
    </div>
  );
};
