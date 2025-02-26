import { ScrollArea } from "@/src/components/ui/scroll-area";
import { CartEmpty } from "@/src/features/cart/ui/cart-empty";
import { CartProducts } from "@/src/features/cart/components/cart-items";

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
        </>
      ) : (
        <CartEmpty />
      )}
    </div>
  );
};
