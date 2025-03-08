import { Product } from "@/src/features/products/types/product";
import { User } from "@/src/features/user/types/user";

export type OrdersResponse = {
  count: number;
  next: string | null;
  results: Order[];
};

export type Order = {
  id: number;
  status: OrderStatus;
  created_at: string;
  note: string;
  total_price: number;
  products: OrderProduct[];
  user: User;
};

export type OrderProduct = {
  product: Product;
  quantity: number;
};

export type OrderStatus = "pending" | "ready" | "canceled";
