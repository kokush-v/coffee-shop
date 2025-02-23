import { CartEmpty } from "@/src/features/cart/components/cart-empty";
import { CartProducts } from "@/src/features/cart/components/cart-items";

import { useAppSelector } from "@/src/store";

export const CartContent = () => {
  const { items } = useAppSelector((state) => state.cart);

  return (
    <div className="w-[420px] h-[340px] flex flex-col overflow-y-scroll scrollbar-hidden">
      {items.length !== 0 ? <CartProducts items={items} /> : <CartEmpty />}
    </div>
  );
};
