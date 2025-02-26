import { CartClearButton } from "@/src/features/cart/components/cart-clear-button";
import { CartOrderButton } from "@/src/features/cart/components/cart-order-button";
import { CartProductsNote } from "@/src/features/cart/components/cart-products-note";

import { overallPrice } from "@/src/lib/utils";

import { useAppSelector } from "@/src/store";

export const CartFooter = () => {
  const cart = useAppSelector((state) => state.cart);

  const price: number = overallPrice(cart.items);

  if (cart.items.length == 0) return null;

  return (
    <div className="flex flex-col flex-1">
      <p className="text-right mb-2 text-sm font-medium text-primary/80">
        До сплати <span className="font-semibold text-primary/90">{price} грн.</span>
      </p>
      <section className="flex items-center gap-2">
        <CartClearButton />
        <CartProductsNote />
        <CartOrderButton className="flex-1" />
      </section>
    </div>
  );
};
