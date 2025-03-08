import { getCookie } from "@/src/lib/cookie";

class WebsocketService {
  public websocket?: WebSocket;

  public connect() {
    const cookie = getCookie("access-token");

    if (!cookie) return;

    if (this.websocket?.readyState === this.websocket?.CLOSED) {
      this.websocket = new WebSocket(
        process.env.NEXT_PUBLIC_WEBSOCKET_URL + `/orders/?token=${cookie}`
      );
    }
  }

  public event<T>(fun: (data: T) => void) {
    if (this.websocket) {
      this.websocket.onmessage = (event) => {
        fun(JSON.parse(event.data));
      };
    }
  }

  public disconnect() {
    this.websocket?.close();
  }
}

export default new WebsocketService();
