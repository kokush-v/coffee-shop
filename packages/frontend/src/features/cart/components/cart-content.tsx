import { CartEmpty } from "@/src/features/cart/components/cart-empty";

export const CartContent = () => {
  return (
    <div className="w-[420px] h-[240px] flex flex-col">
      <CartEmpty />
    </div>
  );
};
