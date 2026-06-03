<script setup>
import { watch } from 'vue';
import { store } from '@/store';

watch(() => store.toasts.length, () => {
    const latestToast = store.toasts[store.toasts.length - 1];

    if (!latestToast) {
        return;
    }

    setTimeout(() => {
        store.removeToast(latestToast.id);
    }, 3200);
});
</script>

<template>
    <div class="toastContainer">
        <div
            v-for="toast in store.toasts"
            :key="toast.id"
            :class="['toastNotification', toast.type]"
        >
            <span class="material-symbols-outlined">
                {{ toast.type === 'success' ? 'check_circle' : toast.type === 'warning' ? 'info' : 'favorite' }}
            </span>
            <p>{{ toast.message }}</p>
            <button
                type="button"
                class="toastClose"
                @click="store.removeToast(toast.id)"
            >
                <span class="material-symbols-outlined">
                    close
                </span>
            </button>
        </div>
    </div>
</template>
