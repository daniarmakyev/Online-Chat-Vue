import { defineStore } from "pinia";
import { ref } from "vue";
import { channelAPI } from "../api/channel.api";
import type { Channel, CreateChannelData } from "../types/channel.types";
import type { User } from "../types/auth.types";

export const useChannelStore = defineStore("channel", () => {
	const channels = ref<Channel[]>([]);
	const currentChannel = ref<Channel | null>(null);
	const participants = ref<{ owner: User; participants: User[] } | null>(null);
	const loading = ref<boolean>(false);
	const error = ref<string | null>(null);

	const fetchChannels = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await channelAPI.getChannelList();
			channels.value = response.channels;
		} catch (err: any) {
			error.value = err.response?.data?.message || "Cant get channels";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const createChannel = async (data: CreateChannelData) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await channelAPI.createChannel(data);
			await fetchChannels();

			const newChannel = channels.value.find((ch) => ch.name === data.name);
			if (newChannel) {
				currentChannel.value = newChannel;
			}

			return response;
		} catch (err: any) {
			error.value = err.response?.data?.message || "Cant create channel";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const joinChannel = async (channelId: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await channelAPI.joinChannel(channelId);
			await fetchChannels();
			return response;
		} catch (err: any) {
			error.value = err.response?.data?.message || "Cant join channel";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const leaveChannel = async (channelId: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await channelAPI.leaveChannel(channelId);
			await fetchChannels();
			if (currentChannel.value?._id === channelId) {
				currentChannel.value = null;
			}
			return response;
		} catch (err: any) {
			error.value = err.response?.data?.message || "Cant leave channel";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const deleteChannel = async (channelId: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await channelAPI.deleteChannel(channelId);
			await fetchChannels();
			if (currentChannel.value?._id === channelId) {
				currentChannel.value = null;
			}
			return response;
		} catch (err: any) {
			error.value = err.response?.data?.message || "Cant delete channel";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const removeParticipant = async (
		channelId: string,
		participantId: string,
	) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await channelAPI.removeParticipant(
				channelId,
				participantId,
			);
			await fetchParticipants(channelId);
			return response;
		} catch (err: any) {
			error.value = err.response?.data?.message || "Cant remove participant";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const fetchParticipants = async (channelId: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await channelAPI.getChannelParticipants(channelId);
			participants.value = response;
		} catch (err: any) {
			error.value = err.response?.data?.message || "Cant get participants";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const setCurrentChannel = (channel: Channel) => {
		currentChannel.value = channel;
	};

	return {
		channels,
		currentChannel,
		participants,
		loading,
		error,
		fetchChannels,
		createChannel,
		joinChannel,
		leaveChannel,
		deleteChannel,
		removeParticipant,
		fetchParticipants,
		setCurrentChannel,
	};
});
