import { CartEmpty } from "@/src/features/cart/components/cart-empty";
import { CartProducts } from "@/src/features/cart/components/cart-items";

export const CartContent = () => {
  return (
    <div className="w-[420px] h-[340px] flex flex-col overflow-y-scroll">
      <CartEmpty />
      <CartProducts />
    </div>
  );
};
