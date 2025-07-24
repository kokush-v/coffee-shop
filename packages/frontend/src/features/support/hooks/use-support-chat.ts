import { useContext, useRef, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/config/api";
import { SupportMessagingContext } from "@/src/providers/support-messaging-provider";
import { useProfileData } from "@/src/features/user/api/use-profile-data";
import { SupportMessage as SupportMessageType } from "@/src/features/support/types/Support";

export function useSupportChat() {
  const { sessionId, updateSessionId, leaveChatSession } = useContext(
    SupportMessagingContext
  );
  const { data: user } = useProfileData();
  const client = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  const { data: messages } = useQuery({
    queryKey: ["support", "messages", sessionId],
    queryFn: async () => {
      const { data } = await api.get<SupportMessageType[]>(
        `/chat/sessions/${sessionId}/messages/`
      );
      return data;
    },
    enabled: !!sessionId,
  });

  const { mutate: sendMessage } = useMutation({
    mutationKey: ["support", "messages", "send"],
    mutationFn: async (message: string) => {
      if (!sessionId) {
        const { data } = await api.post<{ customer_id: string }>(
          "/chat/sessions/create/"
        );
        updateSessionId(data.customer_id);
      }
      await api.post(`/chat/messages/send/`, {
        message,
        session_id: sessionId || localStorage.getItem("session-id"),
      });
    },
    onMutate: (inputValue) => {
      client.setQueryData<SupportMessageType[]>(
        ["support", "messages", sessionId],
        (prev) => {
          if (!prev) return [];
          return [
            ...prev,
            {
              id: -1,
              message: inputValue,
              sender: user!,
              sender_name: user!.username,
              is_staff_message: false,
              timestamp: new Date("1970-01-01").toISOString(),
            },
          ];
        }
      );
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["support", "messages", sessionId],
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
    sessionId,
    updateSessionId,
    leaveChatSession,
    user,
    messages,
    sendMessage,
    inputValue,
    setInputValue,
    messagesEndRef,
  };
}
