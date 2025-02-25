"use client";

import { useQuery } from "@tanstack/react-query";

import { getCookie } from "@/src/lib/cookie";
import { api } from "@/src/config/api";

import { User } from "@/src/features/user/types/user";
import websocketService from "@/src/lib/websocket-service";

export const useProfileData = () => {
  const token = getCookie("access-token");

  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      if (!token) return null;

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const req = await api.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (websocketService.websocket?.readyState == websocketService.websocket?.CLOSED) {
        websocketService.connect();
      }

      return req.data;
    },
    staleTime: 1000 * 60 * 60 * 5,
  });
};
