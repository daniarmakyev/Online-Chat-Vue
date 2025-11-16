<template>
    <div :class="$style.chatView">
        <ChatWindow :channelId="channelId" />
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import ChatWindow from '../components/Chat/ChatWindow.vue';

const route = useRoute();
const channelId = route.params.channelId as string;
</script>

<style module lang="scss">
.chatView {
    width: 100%;
    height: 100vh;
}
</style>