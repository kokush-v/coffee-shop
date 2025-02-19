import { Product } from "@/src/features/products/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
};
