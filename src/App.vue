<script setup>
import { ref, computed } from 'vue';

import Homepage from './components/Homepage.vue';
import UserLogin from './components/UserLogin.vue';
import UserRegister from './components/UserRegister.vue';
import Products from './components/Products.vue';
import Cart from './components/Cart.vue';

const routes = {
  '/': Homepage,
  '/products': Products,
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
