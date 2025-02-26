import { useInfiniteQuery } from "@tanstack/react-query";

import { PaginatedResponse } from "@/src/types/paginated-api-response";
import { Order } from "@/src/features/orders/types/orders";

import { api } from "@/src/config/api";

export const useUserOrdersAPI = () => {
  return useInfiniteQuery({
    queryKey: ["user-orders"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }): Promise<PaginatedResponse<Order[]>> => {
      return (await api.get(`/orders/?page=${pageParam}&staff_orders=false`)).data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.next) {
        return allPages.length + 1;
      }

      return undefined;
    },
    staleTime: 1000 * 60 * 60 * 1,
  });
};
