<script setup>
// import { ref, computed } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import Homepage from './components/Homepage.vue';
import Profile from './components/Profile.vue';
import UserRegister from './components/UserRegister.vue';
import Products from './components/Products.vue';
import Cart from './components/Cart.vue';

// Vue Router
const routes = [
  { path: '/', component: Homepage },
  { path: '/products', component: Products },
  { path: '/profile', component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes
})


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
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/products">Products</router-link> |
      <router-link to="/profile">Profile</router-link>

      <router-view />
    </nav>
  </div>


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
