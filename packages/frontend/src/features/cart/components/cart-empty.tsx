import { ShoppingBasket } from "lucide-react";

export const CartEmpty = () => {
  return (
    <div className="flex-1 text-center items-center justify-center flex text-sm text-zinc-400 flex-col gap-2">
      <ShoppingBasket size={64} strokeWidth={1.2} />
      <span className="font-medium">Кошик порожній</span>
    </div>
  );
};
