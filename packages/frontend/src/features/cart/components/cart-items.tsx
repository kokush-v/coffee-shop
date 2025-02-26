import { CartProduct } from "@/src/features/cart/components/cart-product";
import { CartItem } from "@/src/features/cart/types/cart";

export const CartProducts = ({ items }: { items: CartItem[] }) => {
  return (
    <div className="space-y-3 flex-1">
      {items.map((item) => (
        <CartProduct key={item.product.id} item={item} />
      ))}
    </div>
  );
};
