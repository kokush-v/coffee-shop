"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useProfileData } from "@/src/features/user/api/use-profile-data";

import { Order } from "@/src/features/orders/types/orders";

import websocketService from "@/src/lib/websocket-service";
import { orderReceivedEvent } from "@/src/features/websocket";

import { api } from "@/src/config/api";

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

    websocketService.event((data: { order: Order; sender: string }) => {
      if (!currentUser.is_staff) return;

      orderReceivedEvent(router, client, data);
    });

    return () => {
      websocketService.disconnect();
    };
  }, [currentUser, client, router]);

  return children;
};
