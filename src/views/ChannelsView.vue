<template>
    <div :class="$style.channelsView">
        <div :class="$style.container">
            <div :class="$style.header">
                <h1 :class="$style.title">Channels</h1>
                <button @click="handleLogout" :class="$style.logoutBtn">
                    Logout
                </button>
            </div>

            <div :class="$style.content">
                <CreateChannel />
                <ChannelList />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import CreateChannel from '../components/Channel/CreateChannel.vue';
import ChannelList from '../components/Channel/ChannelList.vue';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
    authStore.logout();
    router.push('/auth');
};
</script>

<style module lang="scss">
.channelsView {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.title {
    font-size: 36px;
    font-weight: 700;
    color: white;
}

.logoutBtn {
    padding: 10px 20px;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
    }
}

.content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>