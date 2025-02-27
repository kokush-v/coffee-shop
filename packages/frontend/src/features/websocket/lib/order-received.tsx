import { QueryClient } from "@tanstack/react-query";
import { overallPrice } from "@/src/lib/utils";
import { toast } from "sonner";

import { Order } from "@/src/features/orders/types/orders";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PaginatedResponse } from "@/src/types/paginated-api-response";

type QueryPayload = {
  pageParam: number;
  pages: PaginatedResponse<Order[]>[];
};

export const orderReceivedEvent = (
  router: AppRouterInstance,
  client: QueryClient,
  data: { order: Order; sender: string }
) => {
  client.setQueryData(["orders", "pending"], (prev: QueryPayload): QueryPayload => {
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

    const productTitle = data.order.products[0].product.title;
    const productsLen = data.order.products.reduce((prev, cur) => prev + cur.quantity, 0) - 1;
    const orderPrice = `${overallPrice(data.order.products)} грн.`;

    const description =
      productsLen == 0 ? (
        <p className="font-medium text-primary/60">
          <span className="font-semibold text-primary/80">{productTitle}</span> вартістю{" "}
          {orderPrice}
        </p>
      ) : (
        <p className="font-medium text-primary/60">
          <span className="font-semibold text-primary/80">{productTitle}</span> та ще {productsLen}{" "}
          позиції вартістю {orderPrice}
        </p>
      );

    toast.info("Отримано замовлення", {
      duration: Infinity,
      description,
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
