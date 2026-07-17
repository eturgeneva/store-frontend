<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';
import ToastNotifications from './components/ToastNotifications.vue';
import { useSession } from '@/session';
import { useWishlist } from '@/composables/useWishlist';
import { useCart } from '@/composables/useCart';

const { initializeSession } = useSession();
const { loadWishlist } = useWishlist();
const { loadCart } = useCart();
const isReady = ref(false);

async function initializeApp() {
  try {
    await initializeSession();
    await Promise.all([loadCart(), loadWishlist()]);
  } finally {
    isReady.value = true;
  }
}

initializeApp();
</script>

<template>
  <ToastNotifications />
  <template v-if="isReady">
    <Header />
    <router-view />
  </template>
</template>

<style scoped>

</style>
