import { useInfiniteQuery } from "@tanstack/react-query";

import { AdminOrders } from "@/src/features/admin/types/admin-orders";

import { api } from "@/src/config/api";

export const useOrdersAPI = (initialData?: AdminOrders) => {
  return useInfiniteQuery({
    queryKey: ["orders"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }): Promise<AdminOrders> => {
      return (await api.get(`/orders/?page=${pageParam}`)).data;
    },
    initialData: {
      pageParams: [1],
      pages: [initialData],
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.next) {
        return allPages.length + 1;
      }

      return undefined;
    },
    staleTime: 1000 * 60 * 60 * 0.1,
  });
};
