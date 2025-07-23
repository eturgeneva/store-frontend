<script setup>
import { ref, computed } from 'vue';

import Homepage from './components/Homepage.vue';
import Profile from './components/Profile.vue';
import UserLogin from './components/Profile.vue';
import UserRegister from './components/UserRegister.vue';
import Products from './components/Products.vue';
import Cart from './components/Cart.vue';

const routes = {
  '/': Homepage,
  '/products': Products,
  '/profile': Profile,
}

const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  //  removes the #
  return routes[currentPath.value.slice(1) || '/'];
});

</script>

<template>
  <div>
    <a href="#/">Homepage</a>
    <a href="#/products">Products</a>
    <a href="#/profile">Profile</a>
  </div>

  <component :is="currentView" />
</template>

<!-- <template>
  <header>
  </header>

  <main>
    <UserLogin />
    <UserRegister />
    <Products />
  </main>
</template> -->

<style scoped>

header {
  line-height: 1.5;
}

</style>
