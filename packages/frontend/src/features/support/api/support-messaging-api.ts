import { api } from "@/src/config/api";
import { SupportCreateSessionResponse } from "@/src/features/support/types/Support";

export class SupportMessagingAPI {
  public sessionId: string | null = null;

  constructor() {
    this.sessionId = localStorage.getItem("session-id");
  }

  public updateSessionId(sessionId: string) {
    this.sessionId = sessionId;

    localStorage.setItem("session-id", sessionId);
  }

  public leaveChatSession() {
    this.sessionId = null;

    localStorage.removeItem("session-id");
  }

  public sendMessage = async (message: string) => {
    if (!this.sessionId) {
      const { data } = await api.post<SupportCreateSessionResponse>(
        "/chat/sessions/create/"
      );

      this.updateSessionId(data.customer_id);
    }

    await api.post(`/chat/messages/send/`, {
      message,
      session_id: this.sessionId,
    });
  };
}
