import { Product } from "@/src/features/products/types/product";

export type AdminOrders = {
  id: number;
  count: number;
  results: AdminOrderResult[];
};

type OrderStatus = "pending";

export type AdminOrderResult = {
  id: number;
  status: OrderStatus;
  created_at: string;
  note: string;
  total_price: number;
  products: {
    product: Product;
    quantity: number;
  }[];
};
