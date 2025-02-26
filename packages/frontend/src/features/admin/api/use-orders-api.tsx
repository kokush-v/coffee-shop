import { useInfiniteQuery } from "@tanstack/react-query";

import { Order, OrderStatus } from "@/src/features/orders/types/orders";

import { api } from "@/src/config/api";
import { PaginatedResponse } from "@/src/types/paginated-api-response";

export const useOrdersAPI = (
  initialData?: PaginatedResponse<Order[]>,
  status: OrderStatus = "pending"
) => {
  return useInfiniteQuery({
    queryKey: ["orders", status],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<PaginatedResponse<Order[]>>(
        `/orders/?page=${pageParam}&status=${status}`
      );

      return data;
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
