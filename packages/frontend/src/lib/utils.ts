import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { CartItem } from "@/src/features/cart/types/cart";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function overallPrice(items: CartItem[]) {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

export const pluralization = (n: number, titles: string[]) => {
  const cases = [2, 0, 1, 1, 1, 2];
  const res = titles[n % 100 > 4 && n % 100 < 20 ? 2 : cases[n % 10 < 5 ? n % 10 : 5]];

  return `${n} ${res}`;
};
