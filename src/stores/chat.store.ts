import { defineStore } from "pinia";
import { ref } from "vue";
import { channelAPI } from "../api/channel.api";
import type { Message } from "../types/message.types";
import socketService from "../socket/socket";

export const useChatStore = defineStore("chat", () => {
	const messages = ref<Message[]>([]);
	const loading = ref<boolean>(false);
	const error = ref<string | null>(null);

	const fetchMessages = async (channelId: string) => {
		loading.value = true;
		error.value = null;
		try {
			const response = await channelAPI.getChannelMessages(channelId);
			messages.value = response.messages;
		} catch (err: any) {
			error.value = err.response?.data?.message || "Cant get messages";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const sendMessage = (channelId: string, text: string) => {
		if (!text.trim()) return;
		socketService.sendMessage(channelId, text);
	};

	const addMessage = (message: Message) => {
		messages.value.push(message);
	};

	const clearMessages = () => {
		messages.value = [];
	};

	const setupSocketListeners = () => {
		socketService.onNewMessage((data: { message: Message }) => {
			addMessage(data.message);
		});
	};

	const removeSocketListeners = () => {
		socketService.offNewMessage();
		socketService.offUserJoined();
		socketService.offUserLeft();
	};

	return {
		messages,
		loading,
		error,
		fetchMessages,
		sendMessage,
		addMessage,
		clearMessages,
		setupSocketListeners,
		removeSocketListeners,
	};
});
