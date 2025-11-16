<template>
    <div :class="$style.authView">
        <div :class="$style.container">
            <LoginForm v-if="!showRegister" @switch="showRegister = true" />
            <RegisterForm v-else @switch="showRegister = false" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from '../components/Auth/LoginForm.vue';
import RegisterForm from '../components/Auth/RegisterForm.vue';

const showRegister = ref(false);
</script>

<style module lang="scss">
.authView {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
    width: 100%;
    max-width: 400px;
    padding: 20px;
}
</style>