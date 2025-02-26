import { useInfiniteQuery } from "@tanstack/react-query";

import { OrdersResponse, OrderStatus } from "@/src/features/orders/types/orders";

import { api } from "@/src/config/api";

export const useOrdersAPI = (initialData?: OrdersResponse, status: OrderStatus = "pending") => {
  return useInfiniteQuery({
    queryKey: ["orders", status],
    initialPageParam: 1,
    queryFn: async ({ pageParam }): Promise<OrdersResponse> => {
      return (await api.get(`/orders/?page=${pageParam}&status=${status}`)).data;
    },
    initialData:
      status == "pending"
        ? {
            pageParams: [1],
            pages: [initialData],
          }
        : undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.next) {
        return allPages.length + 1;
      }

      return undefined;
    },
    staleTime: 1000 * 60 * 60 * 0.1,
  });
};
