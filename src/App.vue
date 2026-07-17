<script setup>
import Header from './components/Header.vue';
import ToastNotifications from './components/ToastNotifications.vue';
import { useSession } from '@/session';

const { initializeSession, isInitialized } = useSession();
initializeSession();
</script>

<template>
  <ToastNotifications />
  <template v-if="isInitialized">
    <Header />
    <router-view />
  </template>
</template>

<style scoped>

</style>
