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

type QueryPayload = {
  pageParam: number;
  pages: AdminOrders[];
};

export const WebsocketMessagingProvider = ({ children }: { children?: React.ReactNode }) => {
  const client = useQueryClient();

  const router = useRouter();

  const { data: currentUser } = useProfileData();

  useEffect(() => {
    if (!currentUser) return;

    client.prefetchInfiniteQuery({
      queryKey: ["orders"],
      queryFn: async () => (await api.get("/orders/")).data,
      initialPageParam: 1,
    });

    websocketService.connect();

    websocketService.event((data: { order: AdminOrderResult; sender: string }) => {
      if (!currentUser.is_staff) return;

      client.setQueryData(["orders"], (prev: QueryPayload): QueryPayload => {
        const isOrderInLatestList = prev.pages.some(
          (page) => !!page.results.find((x) => x.id === data.order.id)
        );

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
    });

    return () => {
      websocketService.disconnect();
    };
  }, [currentUser, client, router]);

  return children;
};
