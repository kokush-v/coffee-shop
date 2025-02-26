import { Product } from "@/src/features/products/types/product";

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
};

export type OrderProduct = {
  product: Product;
  quantity: number;
};

type OrderStatus = "pending" | "ready" | "canceled";
