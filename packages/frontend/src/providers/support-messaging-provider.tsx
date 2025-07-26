"use client";

import { createContext, useCallback, useEffect, useState } from "react";

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
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSessionId = window.localStorage.getItem("session-id");
      if (storedSessionId) {
        setSessionId(storedSessionId);
      }
    }
  }, []);

  const updateSessionId = useCallback((sessionId: string) => {
    setSessionId(sessionId);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("session-id", sessionId);
    }
  }, []);

  const leaveChatSession = useCallback(() => {
    setSessionId(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("session-id");
    }
  }, []);

  return (
    <SupportMessagingContext.Provider
      value={{ sessionId, updateSessionId, leaveChatSession }}
    >
      {children}
    </SupportMessagingContext.Provider>
  );
};
