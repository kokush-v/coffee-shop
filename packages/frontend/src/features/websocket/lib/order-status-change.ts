import { toast } from "sonner";

import { OrderStatus } from "@/src/features/admin/const/order-status";

import { AdminOrderResult } from "@/src/features/admin/types/admin-orders";

// NOTE: until we don't have event_type property in websocket messaging
// we can't figure out for what reason it was sent

export const orderStatusChange = (payload: { order: AdminOrderResult; sender: string }) => {
  if (payload.sender == "Система") {
    toast("Статус замовлення змінено", {
      description: `Ваше замовлення ${OrderStatus[payload.order.status].toLowerCase()}.`,
    });
  }
};
