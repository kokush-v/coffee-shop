"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { orderReceivedEvent, orderStatusChange } from "@/src/hooks/websocket";

import { api } from "@/src/config/api";
import { WebsocketOrder } from "@/src/hooks/websocket/type/websocket-order";

import { useProfileData } from "@/src/features/user/api/use-profile-data";
import WebSocketService from "@/src/services/websocket-service";

export const WebsocketMessagingProvider = ({ children }: { children?: React.ReactNode }) => {
	const client = useQueryClient();

	const router = useRouter();

	const { data: currentUser } = useProfileData();

	const orderWebSocket = new WebSocketService<WebsocketOrder>("orders");

	useEffect(() => {
		if (!currentUser) {
			return orderWebSocket.disconnect();
		}

		orderWebSocket.connect();

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

		orderWebSocket.onMessage((data: WebsocketOrder) => {
			switch (data.order_type) {
				case "new_order":
					orderReceivedEvent(router, client, data);
				case "changed_order":
					orderStatusChange(client, data);
			}
		});

		return () => {
			orderWebSocket.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser, client, router]);

	return children;
};
