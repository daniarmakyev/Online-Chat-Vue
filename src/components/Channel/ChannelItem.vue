<template>
    <div :class="[$style.channelItem, { [$style.active]: isActive }]" @click="handleClick">
        <div :class="$style.channelInfo">
            <h4 :class="$style.channelName">{{ channel.name }}</h4>
            <p :class="$style.channelOwner">
                Owner: {{ getOwnerName }}
            </p>
        </div>

        <div :class="$style.actions">
            <button v-if="!isMember" @click.stop="handleJoin" :class="$style.joinBtn" :disabled="channelStore.loading">
                Join
            </button>

            <button v-else-if="!isActive" @click.stop="handleOpen" :class="$style.openBtn">
                Open
            </button>

            <button v-if="isOwner && isMember" @click.stop="handleDelete" :class="$style.deleteBtn"
                :disabled="channelStore.loading">
                Delete
            </button>

            <button v-else-if="isMember && !isOwner" @click.stop="handleLeave" :class="$style.leaveBtn"
                :disabled="channelStore.loading">
                Leave
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useChannelStore } from '../../stores/channel.store';
import { useAuthStore } from '../../stores/auth.store';
import type { Channel } from '../../types/channel.types';

interface Props {
    channel: Channel;
    isActive?: boolean;
}

const props = defineProps<Props>();

const router = useRouter();
const channelStore = useChannelStore();
const authStore = useAuthStore();


const getOwnerName = computed(() => {
    if (typeof props.channel.owner === 'string') {
        return props.channel.owner;
    }
    return props.channel.owner.username || props.channel.owner.email;
});

const getOwnerId = computed(() => {
    if (typeof props.channel.owner === 'string') {
        return props.channel.owner;
    }
    return props.channel.owner._id;
});

const isOwner = computed(() => {
    return getOwnerId.value === authStore.user?._id;
});

const isMember = computed(() => {
    const currentUserId = authStore.user?._id;


    if (!currentUserId) {
        return false;
    }


    if (!props.channel.participants || !Array.isArray(props.channel.participants)) {
        return isOwner.value;
    }


    const participantIds = props.channel.participants.map(p => {
        if (typeof p === 'string') {
            return p;
        }
        return p._id;
    });

    return participantIds.includes(currentUserId);
});


const handleClick = () => {
    if (isMember.value) {
        handleOpen();
    }
};

const handleOpen = () => {
    channelStore.setCurrentChannel(props.channel);
    router.push(`/chat/${props.channel._id}`);
};

const handleJoin = async () => {
    try {
        await channelStore.joinChannel(props.channel._id);
        await channelStore.fetchChannels();
        const updatedChannel = channelStore.channels.find(ch => ch._id === props.channel._id);
        if (updatedChannel) {
            channelStore.setCurrentChannel(updatedChannel);
            router.push(`/chat/${updatedChannel._id}`);
        }
    } catch (error) {
        channelStore.error = channelStore.error || "Cant join channel";
    }
};

const handleLeave = async () => {
    if (confirm(`Are you sure you want to leave "${props.channel.name}"?`)) {
        try {
            await channelStore.leaveChannel(props.channel._id);
        } catch (error) {
            channelStore.error = channelStore.error || "Cant leave channel";
        }
    }
};

const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${props.channel.name}"?`)) {
        try {
            await channelStore.deleteChannel(props.channel._id);
        } catch (error) {
            channelStore.error = channelStore.error || "Cant delete channel";
        }
    }
};


</script>

<style module lang="scss">
.channelItem {
    padding: 16px;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 2px solid transparent;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.active {
        border-color: #4a90e2;
        background-color: #f0f7ff;
    }
}

.channelInfo {
    flex: 1;
}

.channelName {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.channelOwner {
    font-size: 12px;
    color: #888;
}

.actions {
    display: flex;
    gap: 8px;
}

.joinBtn,
.openBtn,
.leaveBtn,
.deleteBtn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.joinBtn {
    background-color: #4a90e2;
    color: white;

    &:hover:not(:disabled) {
        background-color: #357abd;
    }
}

.openBtn {
    background-color: #52c41a;
    color: white;

    &:hover {
        background-color: #3fa015;
    }
}

.leaveBtn {
    background-color: #f5f5f5;
    color: #666;

    &:hover:not(:disabled) {
        background-color: #e0e0e0;
    }
}

.deleteBtn {
    background-color: #ff4444;
    color: white;

    &:hover:not(:disabled) {
        background-color: #cc0000;
    }
}
</style>