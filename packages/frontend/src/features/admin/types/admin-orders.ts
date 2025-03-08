import { Order } from "@/src/features/orders/types/orders";

export type OrderActionPayload = {
  orderId: Order["id"];
  status: OrderStatusPayload;
};

export enum OrderStatusPayload {
  PENDING = "pending",
  READY = "ready",
  CANCELLED = "canceled",
}
