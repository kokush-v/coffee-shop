"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import websocketService from "@/src/lib/websocket-service";
import { orderReceivedEvent, orderStatusChange } from "@/src/features/websocket";

import { api } from "@/src/config/api";
import { WebsocketOrder } from "@/src/features/websocket/type/websocket-order";

import { useProfileData } from "@/src/features/user/api/use-profile-data";

export const WebsocketMessagingProvider = ({ children }: { children?: React.ReactNode }) => {
  const client = useQueryClient();

  const router = useRouter();

  const { data: currentUser } = useProfileData();

  useEffect(() => {
    if (!currentUser) {
      return websocketService.disconnect();
    }

    websocketService.connect();

    client.prefetchInfiniteQuery({
      queryKey: ["user-orders"],
      queryFn: async () => {
        const { data } = await api.get("/orders/?staff_orders=false");

        return data;
      },
      initialPageParam: 1,
    });

    client.prefetchInfiniteQuery({
      queryKey: ["orders", "pending"],
      queryFn: async () => {
        const { data } = await api.get("/orders/?status=pending");

        return data;
      },
      initialPageParam: 1,
    });

    websocketService.event((data: WebsocketOrder) => {
      switch (data.order_type) {
        case "new_order":
          orderReceivedEvent(router, client, data);
        case "changed_order":
          orderStatusChange(client, data);
      }
    });

    return () => {
      websocketService.disconnect();
    };
  }, [currentUser, client, router]);

  return children;
};
