import { QueryClient } from "@tanstack/react-query";
import { overallPrice, pluralization } from "@/src/lib/utils";
import { toast } from "sonner";

import { Order } from "@/src/features/orders/types/orders";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PaginatedResponse } from "@/src/types/paginated-api-response";
import { WebsocketOrder } from "@/src/features/websocket/type/websocket-order";
import { User } from "@/src/features/user/types/user";

type QueryPayload = {
  pageParam: number;
  pages: PaginatedResponse<Order[]>[];
};

export const orderReceivedEvent = (
  router: AppRouterInstance,
  client: QueryClient,
  data: WebsocketOrder
) => {
  const user = client.getQueryData<User>(["user"]);
  if (data.sender != "Система") return;

  client.setQueryData(["orders", "pending"], (prev: QueryPayload): QueryPayload => {
    const productTitle = data.order.products[0].product.title;
    const productsLen = data.order.products.reduce((prev, cur) => prev + cur.quantity, 0) - 1;
    const orderPrice = `${overallPrice(data.order.products)} грн.`;
    const count = pluralization(productsLen, ["позиція", "позиції", "позицій"]);

    const description =
      productsLen == 0 ? (
        <p className="font-medium text-primary/60">
          <span className="font-semibold text-primary/80">{productTitle}</span> вартістю{" "}
          {orderPrice}
        </p>
      ) : (
        <p className="font-medium text-primary/60">
          <span className="font-semibold text-primary/80">{productTitle}</span> та ще {count}{" "}
          вартістю {orderPrice}
        </p>
      );

    if (data.order.user.username != user?.username) {
      toast.info("Отримано замовлення", {
        duration: Infinity,
        description,
        action: {
          label: "Переглянути",
          onClick: () => router.push("/my/orders/manage"),
        },
      });
    }

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
