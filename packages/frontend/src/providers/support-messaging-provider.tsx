"use client";

import { createContext, useCallback, useState } from "react";

interface SupportMessagingContextType {
  sessionId: string | null;
  updateSessionId: (sessionId: string) => void;
  leaveChatSession: () => void;
}

export const SupportMessagingContext =
  createContext<SupportMessagingContextType>({
    sessionId: null,
    updateSessionId: () => {},
    leaveChatSession: () => {},
  });

export const SupportMessagingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sessionId, setSessionId] = useState<string | null>(
    localStorage.getItem("session-id")
  );

  const updateSessionId = useCallback((sessionId: string) => {
    setSessionId(sessionId);
    localStorage.setItem("session-id", sessionId);
  }, []);

  const leaveChatSession = useCallback(() => {
    setSessionId(null);
    localStorage.removeItem("session-id");
  }, []);

  return (
    <SupportMessagingContext.Provider
      value={{ sessionId, updateSessionId, leaveChatSession }}
    >
      {children}
    </SupportMessagingContext.Provider>
  );
};
