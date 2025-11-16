<template>
    <div :class="$style.loginForm">
        <h2 :class="$style.title">Login</h2>

        <form @submit.prevent="handleSubmit" :class="$style.form">
            <div :class="$style.formGroup">
                <label :class="$style.label">Email</label>
                <input v-model="formData.email" type="email" :class="$style.input" placeholder="Enter your email"
                    required />
            </div>

            <div :class="$style.formGroup">
                <label :class="$style.label">Password</label>
                <input v-model="formData.password" type="password" :class="$style.input"
                    placeholder="Enter your password" required />
            </div>

            <div v-if="authStore.error" :class="$style.error">
                {{ authStore.error }}
            </div>

            <button type="submit" :class="$style.submitBtn" :disabled="authStore.loading">
                {{ authStore.loading ? 'Loading...' : 'Login' }}
            </button>
        </form>

        <p :class="$style.switchText">
            Don't have an account?
            <span @click="$emit('switch')" :class="$style.switchLink">
                Register
            </span>
        </p>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAuthStore } from '../../stores/auth.store';
import { useRouter } from 'vue-router';

const emit = defineEmits(['switch']);

const authStore = useAuthStore();
const router = useRouter();

const formData = reactive({
    email: '',
    password: '',
});

const handleSubmit = async () => {
    try {
        await authStore.login(formData);
        router.push('/channels');
    } catch (error) {
        authStore.error = authStore.error || "Login error, try again";
    }
};
</script>

<style module lang="scss">
.loginForm {
    width: 100%;
    max-width: 400px;
    padding: 40px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
    font-size: 28px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.formGroup {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.label {
    font-size: 14px;
    font-weight: 500;
    color: #555;
}

.input {
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;

    &:focus {
        border-color: #4a90e2;
    }
}

.error {
    padding: 12px;
    background-color: #fee;
    color: #c33;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
}

.submitBtn {
    padding: 14px;
    background-color: #4a90e2;
    color: white;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
        background-color: #357abd;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.switchText {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #666;
}

.switchLink {
    color: #4a90e2;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
}
</style>