import { api } from "@/src/config/api";
import { useMutation } from "@tanstack/react-query";

export const useCreateSupportSession = () => {
  return useMutation({
    mutationKey: ["create", "support-session"],
    mutationFn: async () => {
      const { data } = await api.post("/chat/sessions/create/");

      return data;
    },
  });
};
