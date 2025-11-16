<template>
    <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth.store';

const authStore = useAuthStore();

onMounted(() => {
    authStore.initAuth();
});
</script>

<style>
@import './assets/styles/global.scss';
</style>