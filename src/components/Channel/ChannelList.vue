<template>
    <div :class="$style.channelList">
        <div v-if="channelStore.loading" :class="$style.loading">
            Loading channels...
        </div>

        <div v-else-if="channelStore.channels.length === 0" :class="$style.empty">
            No channels available. Create one!
        </div>

        <div v-else :class="$style.list">
            <ChannelItem v-for="channel in channelStore.channels" :key="channel._id" :channel="channel"
                :isActive="channelStore.currentChannel?._id === channel._id" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useChannelStore } from '../../stores/channel.store';
import ChannelItem from './ChannelItem.vue';

const channelStore = useChannelStore();

onMounted(async () => {
    await channelStore.fetchChannels();
});
</script>

<style module lang="scss">
.channelList {
    width: 100%;
}

.loading,
.empty {
    padding: 40px 20px;
    text-align: center;
    color: #888;
    font-size: 16px;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>