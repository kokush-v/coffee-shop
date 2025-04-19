import { Profile } from "@/src/features/user/ui/header-profile";

import { CartTrigger } from "@/src/features/cart/components/cart-root";

export const Header = () => {
  return (
    <header className="flex flex-row justify-between items-center py-2 layout-spacing-rule shadow-sm bg-zinc-50">
      <a href="/">
        <h2 className="text-2xl font-bold text-zinc-900 max-sm:text-lg">Coffee Shop</h2>
        <p className="text-sm font-medium text-zinc-400">Магазин кавових зерен</p>
      </a>
      <div className="flex flex-row items-center gap-3">
        <CartTrigger />
        <Profile />
      </div>
    </header>
  );
};
