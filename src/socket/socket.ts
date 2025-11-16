import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3012";

class SocketService {
	private socket: Socket | null = null;

	connect(token: string) {
		this.socket = io(SOCKET_URL, {
			auth: {
				token,
			},
		});

		return this.socket;
	}

	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	getSocket(): Socket | null {
		return this.socket;
	}

	joinChannel(channelId: string) {
		if (this.socket) {
			this.socket.emit("join_channel", channelId);
		}
	}

	leaveChannel(channelId: string) {
		if (this.socket) {
			this.socket.emit("leave_channel", channelId);
		}
	}

	sendMessage(channelId: string, text: string) {
		if (this.socket) {
			this.socket.emit("send_message", { channelId, text });
		}
	}

	onNewMessage(callback: (data: any) => void) {
		if (this.socket) {
			this.socket.on("new_message", callback);
		}
	}

	onUserJoined(callback: (data: any) => void) {
		if (this.socket) {
			this.socket.on("user_joined_channel", callback);
		}
	}

	onUserLeft(callback: (data: any) => void) {
		if (this.socket) {
			this.socket.on("user_left_channel", callback);
		}
	}

	offNewMessage() {
		if (this.socket) {
			this.socket.off("new_message");
		}
	}

	offUserJoined() {
		if (this.socket) {
			this.socket.off("user_joined_channel");
		}
	}

	offUserLeft() {
		if (this.socket) {
			this.socket.off("user_left_channel");
		}
	}
}

export default new SocketService();
