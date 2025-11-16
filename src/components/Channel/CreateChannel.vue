<template>
    <div :class="$style.createChannel">
        <button @click="showModal = true" :class="$style.createBtn">
            + Create Channel
        </button>

        <div v-if="showModal" :class="$style.modal" @click="closeModal">
            <div :class="$style.modalContent" @click.stop>
                <h3 :class="$style.modalTitle">Create New Channel</h3>

                <form @submit.prevent="handleSubmit" :class="$style.form">
                    <div :class="$style.formGroup">
                        <label :class="$style.label">Channel Name</label>
                        <input v-model="channelName" type="text" :class="$style.input" placeholder="Enter channel name"
                            required />
                    </div>

                    <div v-if="channelStore.error" :class="$style.error">
                        {{ channelStore.error }}
                    </div>

                    <div :class="$style.buttons">
                        <button type="button" @click="closeModal" :class="$style.cancelBtn">
                            Cancel
                        </button>
                        <button type="submit" :class="$style.submitBtn" :disabled="channelStore.loading">
                            {{ channelStore.loading ? 'Creating...' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChannelStore } from '../../stores/channel.store';

const channelStore = useChannelStore();

const showModal = ref(false);
const channelName = ref('');

const closeModal = () => {
    showModal.value = false;
    channelName.value = '';
};

const handleSubmit = async () => {
    try {
        await channelStore.createChannel({ name: channelName.value });
        closeModal();
    } catch (error) {
        channelStore.error = channelStore.error || "Cant create channel";
    }
};
</script>

<style module lang="scss">
.createChannel {
    width: 100%;
}

.createBtn {
    width: 100%;
    padding: 14px;
    background-color: #4a90e2;
    color: white;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    transition: background-color 0.2s;

    &:hover {
        background-color: #357abd;
    }
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modalContent {
    background: white;
    padding: 30px;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modalTitle {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
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

.buttons {
    display: flex;
    gap: 10px;
}

.cancelBtn {
    flex: 1;
    padding: 12px;
    background-color: #f5f5f5;
    color: #666;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.2s;

    &:hover {
        background-color: #e0e0e0;
    }
}

.submitBtn {
    flex: 1;
    padding: 12px;
    background-color: #4a90e2;
    color: white;
    border-radius: 8px;
    font-size: 14px;
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
</style>