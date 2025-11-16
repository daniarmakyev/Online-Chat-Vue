<template>
    <div :class="$style.userSearch">
        <input v-model="searchQuery" type="text" :class="$style.input" placeholder="Search users..."
            @input="handleSearch" />

        <div v-if="loading" :class="$style.loading">
            Searching...
        </div>

        <div v-else-if="users.length > 0" :class="$style.results">
            <div v-for="user in users" :key="user._id" :class="$style.userItem">
                <span :class="$style.username">{{ user.username }}</span>
                <span :class="$style.email">{{ user.email }}</span>
            </div>
        </div>

        <div v-else-if="searchQuery && !loading" :class="$style.empty">
            No users found
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { userAPI } from '../../api/user.api';
import type { User } from '../../types/auth.types';

const searchQuery = ref('');
const users = ref<User[]>([]);
const loading = ref(false);

let searchTimeout: ReturnType<typeof setTimeout>;

const handleSearch = async () => {
    clearTimeout(searchTimeout);

    if (!searchQuery.value.trim()) {
        users.value = [];
        return;
    }

    searchTimeout = setTimeout(async () => {
        loading.value = true;
        try {
            const response = await userAPI.searchUsers(searchQuery.value);
            users.value = response.users;
        } catch (error) {
            users.value = [];
        } finally {
            loading.value = false;
        }
    }, 300);
};
</script>

<style module lang="scss">
.userSearch {
    width: 100%;
}

.input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;

    &:focus {
        border-color: #4a90e2;
    }
}

.loading,
.empty {
    padding: 20px;
    text-align: center;
    color: #888;
    font-size: 14px;
}

.results {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.userItem {
    padding: 12px;
    background-color: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.username {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.email {
    font-size: 12px;
    color: #888;
}
</style>