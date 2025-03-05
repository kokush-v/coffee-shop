import { Order } from "@/src/features/orders/types/orders";

export type WebsocketOrder = {
  order: Order;
  sender: string;
  order_type: "new_order" | "changed_order";
};
