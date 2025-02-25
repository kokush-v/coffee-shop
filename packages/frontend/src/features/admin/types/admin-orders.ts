import { Product } from "@/src/features/products/types/product";

export type AdminOrders = {
  count: number;
  next: string | null;
  results: AdminOrderResult[];
};

export enum OrderStatusPayload {
  PENDING = "pending",
  READY = "ready",
  CANCELLED = "canceled",
}

type OrderStatus = "pending" | "ready" | "canceled";

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

export type OrderActionPayload = {
  orderId: AdminOrderResult["id"];
  status: OrderStatusPayload;
};
