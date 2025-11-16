<template>
    <div :class="[$style.messageItem, { [$style.own]: isOwnMessage }]">
        <div :class="$style.messageContent">
            <div :class="$style.messageHeader">
                <span :class="$style.sender">{{ message.sender.username }}</span>
                <span :class="$style.time">{{ formattedTime }}</span>
            </div>
            <p :class="$style.text">{{ message.text }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import type { Message } from '../../types/message.types';

interface Props {
    message: Message;
}

const props = defineProps<Props>();

const authStore = useAuthStore();

const isOwnMessage = computed(() => {
    return props.message.sender._id === authStore.user?._id;
});

const formattedTime = computed(() => {
    const date = new Date(props.message.createdAt);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
});
</script>

<style module lang="scss">
.messageItem {
    display: flex;
    margin-bottom: 16px;

    &.own {
        justify-content: flex-end;

        .messageContent {
            background-color: #4a90e2;
            color: white;

            .sender {
                color: rgba(255, 255, 255, 0.9);
            }

            .time {
                color: rgba(255, 255, 255, 0.7);
            }
        }
    }
}

.messageContent {
    max-width: 70%;
    padding: 12px 16px;
    background-color: #f5f5f5;
    border-radius: 12px;
    word-wrap: break-word;
}

.messageHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    gap: 12px;
}

.sender {
    font-size: 12px;
    font-weight: 600;
    color: #666;
}

.time {
    font-size: 11px;
    color: #999;
}

.text {
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    margin: 0;
}

.own .text {
    color: white;
}
</style>