import { QueryClient } from "@tanstack/react-query";
import { overallPrice } from "@/src/lib/utils";
import { toast } from "sonner";

import { Order, OrdersResponse } from "@/src/features/orders/types/orders";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type QueryPayload = {
  pageParam: number;
  pages: OrdersResponse[];
};

export const orderReceivedEvent = (
  router: AppRouterInstance,
  client: QueryClient,
  data: { order: Order; sender: string }
) => {
  client.setQueryData(["orders"], (prev: QueryPayload): QueryPayload => {
    const isOrderInLatestList = prev.pages.some(
      (page) => !!page.results.find((x) => x.id === data.order.id)
    );

    // websocket is also sending message when order status has changed,
    // should be in separate function
    if (isOrderInLatestList) {
      return {
        ...prev,
        pages: prev.pages.map((page) => ({
          ...page,
          results: page.results.map((x) => (x.id == data.order.id ? data.order : x)),
        })),
      };
    }

    toast.info("Отримано замовлення", {
      description: `Замовлення на ${data.order.products.length} позицій вартістю ${overallPrice(
        data.order.products
      )} грн.`,
      action: {
        label: "Переглянути",
        onClick: () => router.push("/my/orders/manage"),
      },
    });

    return {
      ...prev,
      pages: prev.pages.map((page, index) =>
        index == 0
          ? { ...page, count: page.count + 1, results: [data.order, ...page.results] }
          : page
      ),
    };
  });
};
