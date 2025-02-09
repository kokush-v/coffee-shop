import { CartProduct } from "@/src/features/cart/components/cart-product";

import { useAppSelector } from "@/src/store";

export const CartProducts = () => {
  const { items } = useAppSelector((state) => state.cart);

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <CartProduct key={item.product.id} item={item} />
      ))}
    </div>
  );
};
