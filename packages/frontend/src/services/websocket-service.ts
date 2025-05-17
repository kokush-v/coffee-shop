import { getCookie } from "@/src/lib/cookie";

type MessageHandler<T> = (data: T) => void;

class WebSocketService<T> {
	private websocket?: WebSocket;
	private messageHandler?: MessageHandler<T>;
	private host = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

	constructor(private url: string) {}

	public connect() {
		const token = getCookie("access-token");
		if (!token) return;

		if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
			const params = new URLSearchParams({
				token,
			});

			this.websocket = new WebSocket(`${this.host}/${this.url}/?${params.toString()}`);
			this.websocket.onmessage = (event) => {
				if (this.messageHandler) {
					this.messageHandler(JSON.parse(event.data));
				}
			};
		}
	}

	public onMessage(handler: MessageHandler<T>) {
		this.messageHandler = handler;
		if (this.websocket) {
			this.websocket.onmessage = (event) => {
				handler(JSON.parse(event.data));
			};
		}
	}

	public send(data: T) {
		if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
			this.websocket.send(JSON.stringify(data));
		}
	}

	public disconnect() {
		this.websocket?.close();
		this.websocket = undefined;
	}
}

export default WebSocketService;
