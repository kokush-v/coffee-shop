import { getCookie } from "@/src/lib/cookie";

class AdminService {
  public websocket?: WebSocket;

  constructor() {
    this.websocket?.addEventListener("open", () => console.log("connected"));
  }

  public connect() {
    const cookie = getCookie("access-token");

    if (!cookie) return;

    if (this.websocket?.readyState === this.websocket?.CLOSED) {
      this.websocket = new WebSocket(
        process.env.NEXT_PUBLIC_WEBSOCKET_URL + `/orders/?token=${cookie}`
      );
    }

    this.websocket?.addEventListener("order_event", (event) => {
      console.log(event);
    });
  }

  public close() {
    this.websocket?.close();

    this.websocket?.removeEventListener("message", () => {});
  }
}

export default new AdminService();
