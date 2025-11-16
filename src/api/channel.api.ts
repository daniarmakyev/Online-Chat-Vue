import axios from "./axios";
import type { Channel, CreateChannelData } from "../types/channel.types";
import type { User } from "../types/auth.types";

export const channelAPI = {
	createChannel: async (data: CreateChannelData) => {
		const response = await axios.post("/channel/create", data);
		return response.data;
	},

	getChannelList: async (): Promise<{ channels: Channel[] }> => {
		const response = await axios.get("/channel/list");
		return response.data;
	},

	joinChannel: async (channelId: string) => {
		const response = await axios.post(`/channel/${channelId}/join`);
		return response.data;
	},

	leaveChannel: async (channelId: string) => {
		const response = await axios.post(`/channel/${channelId}/leave`);
		return response.data;
	},

	deleteChannel: async (channelId: string) => {
		const response = await axios.delete(`/channel/${channelId}`);
		return response.data;
	},

	removeParticipant: async (channelId: string, participantId: string) => {
		const response = await axios.delete(
			`/channel/${channelId}/participants/${participantId}`,
		);
		return response.data;
	},

	getChannelMessages: async (channelId: string) => {
		const response = await axios.get(`/channel/${channelId}/messages`);
		return response.data;
	},

	getChannelParticipants: async (
		channelId: string,
	): Promise<{ owner: User; participants: User[] }> => {
		const response = await axios.get(`/channel/${channelId}/participants`);
		return response.data;
	},
};
