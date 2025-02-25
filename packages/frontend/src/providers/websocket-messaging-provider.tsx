"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { AdminOrderResult, AdminOrders } from "@/src/features/admin/types/admin-orders";

import websocketService from "@/src/lib/websocket-service";

import { api } from "@/src/config/api";
import { overallPrice } from "@/src/lib/utils";

import { toast } from "sonner";

import { useProfileData } from "@/src/features/user/api/use-profile-data";

export const WebsocketMessagingProvider = ({ children }: { children?: React.ReactNode }) => {
  const client = useQueryClient();

  const router = useRouter();

  const { data: currentUser } = useProfileData();

  useEffect(() => {
    if (!currentUser) return;

    client.prefetchQuery({
      queryKey: ["orders"],
      queryFn: async () => (await api.get("/orders/")).data,
    });

    websocketService.connect();

    websocketService.event((data: { order: AdminOrderResult; sender: string }) => {
      if (!currentUser.is_staff) return;

      client.setQueryData(["orders"], (prev: AdminOrders) => {
        return {
          count: prev.results.length + 1,
          results: [data.order, ...prev.results],
        };
      });

      toast.success("Отримано замовлення", {
        description: `Замовлення на ${data.order.products.length} позицій вартістю ${overallPrice(
          data.order.products
        )} грн.`,
        action: {
          label: "Переглянути",
          onClick: () => router.push("/my/orders/manage"),
        },
      });
    });

    return () => {
      websocketService.disconnect();
    };
  }, [currentUser, client, router]);

  return children;
};
