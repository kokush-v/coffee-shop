"use client";

import { useQuery } from "@tanstack/react-query";

import { getCookie } from "@/src/lib/cookie";
import { api } from "@/src/config/api";

import { User } from "@/src/features/user/types/user";

export const useProfileData = () => {
  const token = getCookie("access-token");

  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      if (!token) return null;

      const req = await api.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return req.data;
    },
  });
};
