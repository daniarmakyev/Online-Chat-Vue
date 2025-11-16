<template>
    <div :class="$style.messageInput">
        <form @submit.prevent="handleSubmit" :class="$style.form">
            <textarea v-model="messageText" :class="$style.textarea" placeholder="Type a message..." rows="1"
                @keydown.enter.exact.prevent="handleSubmit" />
            <button type="submit" :class="$style.sendBtn" :disabled="!messageText.trim()">
                Send
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from '../../stores/chat.store';

interface Props {
    channelId: string;
}

const props = defineProps<Props>();

const chatStore = useChatStore();
const messageText = ref('');

const handleSubmit = () => {
    if (!messageText.value.trim()) return;

    chatStore.sendMessage(props.channelId, messageText.value.trim());
    messageText.value = '';
};
</script>

<style module lang="scss">
.messageInput {
    padding: 20px;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
}

.form {
    display: flex;
    gap: 12px;
    align-items: flex-end;
}

.textarea {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    resize: none;
    font-family: inherit;
    max-height: 120px;
    overflow-y: auto;

    &:focus {
        border-color: #4a90e2;
        outline: none;
    }

    &::placeholder {
        color: #999;
    }
}

.sendBtn {
    padding: 12px 24px;
    background-color: #4a90e2;
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
        background-color: #357abd;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>