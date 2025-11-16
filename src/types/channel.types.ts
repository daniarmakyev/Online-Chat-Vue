import { User } from "./auth.types";

export interface Channel {
	_id: string;
	name: string;
	owner: User | string;
	participants: User[] | string[];
	createdAt: string;
}

export interface CreateChannelData {
	name: string;
}
