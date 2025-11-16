<template>
    <div :class="$style.participantsList">
        <h3 :class="$style.title">Members</h3>

        <div v-if="channelStore.loading" :class="$style.loading">
            Loading...
        </div>

        <div v-else :class="$style.list">
            <div :class="$style.section">
                <h4 :class="$style.sectionTitle">Owner</h4>
                <div :class="$style.participant">
                    <span :class="$style.participantName">
                        {{ channelStore.participants?.owner.username }}
                    </span>
                    <span :class="$style.badge">Owner</span>
                </div>
            </div>

            <div v-if="channelStore.participants?.participants.length" :class="$style.section">
                <h4 :class="$style.sectionTitle">Members</h4>
                <div v-for="participant in channelStore.participants.participants" :key="participant._id"
                    :class="$style.participant">
                    <span :class="$style.participantName">
                        {{ participant.username }}
                    </span>
                    <button v-if="isOwner" @click="handleRemove(participant._id)" :class="$style.removeBtn"
                        :disabled="channelStore.loading">
                        Remove
                    </button>
                </div>
            </div>

            <div v-else :class="$style.empty">
                No other members yet
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useChannelStore } from '../../stores/channel.store';
import { useAuthStore } from '../../stores/auth.store';

interface Props {
    channelId: string;
}

const props = defineProps<Props>();

const channelStore = useChannelStore();
const authStore = useAuthStore();

const isOwner = computed(() => {
    return channelStore.participants?.owner._id === authStore.user?._id;
});

onMounted(async () => {
    await channelStore.fetchParticipants(props.channelId);
});

const handleRemove = async (participantId: string) => {
    if (confirm('Are you sure you want to remove this participant?')) {
        try {
            await channelStore.removeParticipant(props.channelId, participantId);
        } catch (error) {
            channelStore.error = channelStore.error || "Cant remove participant";
        }
    }
};
</script>

<style module lang="scss">
.participantsList {
    padding: 20px;
}

.title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
}

.loading {
    text-align: center;
    color: #888;
    padding: 20px;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.sectionTitle {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.participant {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.participantName {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.badge {
    padding: 4px 8px;
    background-color: #4a90e2;
    color: white;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}

.removeBtn {
    padding: 6px 12px;
    background-color: #ff4444;
    color: white;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
        background-color: #cc0000;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.empty {
    text-align: center;
    color: #888;
    padding: 20px;
    font-size: 14px;
}
</style>