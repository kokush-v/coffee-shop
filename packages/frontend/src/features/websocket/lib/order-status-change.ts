import { toast } from "sonner";

import { QueryClient } from "@tanstack/react-query";

import { PaginatedResponse } from "@/src/types/paginated-api-response";

import { WebsocketOrder } from "@/src/features/websocket/type/websocket-order";

import { OrderStatus } from "@/src/features/admin/const/order-status";
import { Order } from "@/src/features/orders/types/orders";

import { User } from "@/src/features/user/types/user";

type QueryPayload = {
  pageParam: number;
  pages: PaginatedResponse<Order[]>[];
};

export const orderStatusChange = (client: QueryClient, data: WebsocketOrder) => {
  const user = client.getQueryData<User>(["user"]);

  if (!user || data.sender !== "Система" || data.sender == user.username) return;

  client.setQueryData(["orders", "pending"], (prev: QueryPayload): QueryPayload => {
    toast.info("Статус замовлення змінено", {
      description: `Ваше замовлення ${OrderStatus[data.order.status].toLowerCase()}.`,
    });

    return {
      ...prev,
      pages: prev.pages.map((page) => ({
        ...page,
        results: page.results.map((x) => (x.id == data.order.id ? data.order : x)),
      })),
    };
  });
};
