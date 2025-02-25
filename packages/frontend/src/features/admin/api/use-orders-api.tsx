import { useQuery } from "@tanstack/react-query";

import { AdminOrders } from "@/src/features/admin/types/admin-orders";

import { api } from "@/src/config/api";

export const useOrdersAPI = (initialData?: AdminOrders) => {
  return useQuery<AdminOrders>({
    queryKey: ["orders"],
    queryFn: async () => (await api.get("/orders/")).data,
    initialData,
    staleTime: 1000 * 60 * 60 * 0.1,
  });
};
