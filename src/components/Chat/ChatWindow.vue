<template>
    <div :class="$style.chatWindow">
        <div :class="$style.header">
            <div :class="$style.headerLeft">
                <button @click="handleBack" :class="$style.backBtn">
                    ← Back
                </button>
                <h2 :class="$style.channelName">
                    {{ channelStore.currentChannel?.name }}
                </h2>
            </div>
            <button @click="showParticipants = !showParticipants" :class="$style.participantsBtn">
                👥 Participants
            </button>
        </div>

        <div :class="$style.content">
            <MessageList />

            <div v-if="showParticipants" :class="$style.sidebar">
                <ParticipantsList :channelId="channelId" />
            </div>
        </div>

        <MessageInput :channelId="channelId" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useChannelStore } from '../../stores/channel.store';
import { useChatStore } from '../../stores/chat.store';
import socketService from '../../socket/socket';
import MessageList from './MessageList.vue';
import MessageInput from './MessageInput.vue';
import ParticipantsList from '../User/ParticipantsList.vue';

interface Props {
    channelId: string;
}

const props = defineProps<Props>();

const router = useRouter();
const channelStore = useChannelStore();
const chatStore = useChatStore();
const showParticipants = ref(false);

onMounted(async () => {
    try {

        await chatStore.fetchMessages(props.channelId);

        socketService.joinChannel(props.channelId);

        chatStore.setupSocketListeners();
    } catch (error) {
        chatStore.error = chatStore.error || "Cant load chat";
    }
});

onUnmounted(() => {

    socketService.leaveChannel(props.channelId);

    chatStore.removeSocketListeners();

    chatStore.clearMessages();
});

const handleBack = () => {
    router.push('/channels');
};
</script>

<style module lang="scss">
.chatWindow {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: white;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background-color: #4a90e2;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.headerLeft {
    display: flex;
    align-items: center;
    gap: 16px;
}

.backBtn {
    padding: 8px 16px;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
    }
}

.channelName {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.participantsBtn {
    padding: 8px 16px;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
    }
}

.content {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.sidebar {
    width: 300px;
    border-left: 1px solid #ddd;
    background-color: #f9f9f9;
    overflow-y: auto;
}
</style>