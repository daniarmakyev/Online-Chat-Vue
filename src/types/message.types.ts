import { type User } from "./auth.types";

export interface Message {
	_id: string;
	channelId: string;
	sender: User;
	text: string;
	createdAt: string;
}

export interface SendMessageData {
	channelId: string;
	text: string;
}
