import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/src/config/api";

import { OrderActionPayload } from "@/src/features/admin/types/admin-orders";

export const useOrdersAction = ({ orderId, status }: OrderActionPayload) => {
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["order-action", orderId, status],
    mutationFn: async () =>
      await api.put(`/orders/${orderId}/`, {
        status,
      }),
    onSuccess: () => {
      client.refetchQueries({
        queryKey: ["orders"],
      });
    },
  });
};
