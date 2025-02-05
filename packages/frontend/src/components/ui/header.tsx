import { CartTrigger } from "@/src/features/cart/components/cart-trigger";
import { Avatar } from "antd";

export const Header = () => {
  return (
    <header className="flex flex-row justify-between items-center py-2 layout-spacing-rule shadow-sm bg-zinc-50">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Coffee Shop</h2>
        <p className="text-sm font-medium text-zinc-400">Магазин кавових зерен</p>
      </div>
      <div className="flex flex-row items-center gap-3">
        <CartTrigger />
        <Avatar size={36} />
      </div>
    </header>
  );
};
