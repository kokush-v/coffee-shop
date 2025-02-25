import { ScrollArea } from "@/src/components/ui/scroll-area";
import { CartClearButton } from "@/src/features/cart/components/cart-clear-button";
import { CartEmpty } from "@/src/features/cart/components/cart-empty";
import { CartProducts } from "@/src/features/cart/components/cart-items";

import { CartOrderButton } from "@/src/features/cart/components/cart-order-button";

import { useAppSelector } from "@/src/store";

export const CartContent = () => {
  const { items } = useAppSelector((state) => state.cart);

  return (
    <div className="flex-1 flex flex-col overflow-y-scroll scrollbar-hidden">
      {items.length !== 0 ? (
        <>
          <ScrollArea className="flex-1 mb-4">
            <CartProducts items={items} />
          </ScrollArea>
          <section className="flex items-center gap-2">
            <CartClearButton />
            <CartOrderButton className="flex-1" />
          </section>
        </>
      ) : (
        <CartEmpty />
      )}
    </div>
  );
};
