import { createContext } from "react";

import { CartItem } from "@/src/features/cart/types/cart";

type ProductContextType = CartItem | null;

export const CartProductContext = createContext<ProductContextType>(null);
