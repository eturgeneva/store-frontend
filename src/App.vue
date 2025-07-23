<script setup>
// import { ref, computed } from 'vue';
import Header from './components/Header.vue';

// Hashchange routing
// const routes = {
//   '/': Homepage,
//   '/products': Products,
//   '/profile': Profile,
// }

// const currentPath = ref(window.location.hash);

// window.addEventListener('hashchange', () => {
//   currentPath.value = window.location.hash;
// });

// const currentView = computed(() => {
//   //  removes the #
//   return routes[currentPath.value.slice(1) || '/'];
// });

</script>

<template>
  <!-- Vue Router -->
  <!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/products">Products</router-link> |
      <router-link to="/profile">Profile</router-link> -->
      <Header />
      <router-view />
  <!-- </nav> -->

  <!-- Hashchange routing -->
  <!-- <div>
    <a href="#/">Homepage</a>
    <a href="#/products">Products</a>
    <a href="#/profile">Profile</a>
  </div>
  <component :is="currentView" /> -->
</template>

<style scoped>

header {
  line-height: 1.5;
}

</style>
