import { Product } from "@/src/features/products/types/product";
import { createContext } from "react";

type ProductContextType = Product | null;

export const ProductContext = createContext<ProductContextType>(null);
