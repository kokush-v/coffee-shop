"use client";

import { useQuery } from "@tanstack/react-query";

import { getCookie } from "@/src/lib/cookie";
import { api } from "@/src/config/api";

import { User } from "@/src/features/user/types/user";
import websocketService from "@/src/lib/websocket-service";
import { AxiosError } from "axios";

export const useProfileData = () => {
  const token = getCookie("access-token");

  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      if (!token) {
        throw "No cookie provided";
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const req = await api.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (websocketService.websocket?.readyState == websocketService.websocket?.CLOSED) {
          websocketService.connect();
        }

        return req.data;
      } catch (e) {
        const error = e as unknown as AxiosError;

        if (error.status == 401) {
          document.cookie = "access-token=;path=/";
          api.defaults.headers["Authorization"] = null;

          return null;
        }

        throw "Something went wrong";
      }
    },
    staleTime: 1000 * 60 * 60 * 5,
  });
};
