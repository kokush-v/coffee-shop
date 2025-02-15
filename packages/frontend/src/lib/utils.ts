import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { CartItem } from "@/src/features/cart/types/cart";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function overallPrice(items: CartItem[]) {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}
