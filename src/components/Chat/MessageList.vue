<template>
    <div :class="$style.messageList" ref="messageListRef">
        <div v-if="chatStore.loading" :class="$style.loading">
            Loading messages...
        </div>

        <div v-else-if="chatStore.messages.length === 0" :class="$style.empty">
            No messages yet. Start the conversation!
        </div>

        <div v-else :class="$style.messages">
            <MessageItem v-for="message in chatStore.messages" :key="message._id" :message="message" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useChatStore } from '../../stores/chat.store';
import MessageItem from './MessageItem.vue';

const chatStore = useChatStore();
const messageListRef = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
    nextTick(() => {
        if (messageListRef.value) {
            messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
        }
    });
};


watch(
    () => chatStore.messages.length,
    () => {
        scrollToBottom();
    }
);
</script>

<style module lang="scss">
.messageList {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: white;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;

        &:hover {
            background: #555;
        }
    }
}

.loading,
.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
    font-size: 16px;
}

.messages {
    display: flex;
    flex-direction: column;
}
</style>