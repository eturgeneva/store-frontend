<script setup>
import { ref, computed } from 'vue';

import Homepage from './components/Homepage.vue';
import UserLogin from './components/UserLogin.vue';
import UserRegister from './components/UserRegister.vue';
import Products from './components/Products.vue';
import Cart from './components/Cart.vue';

const routes = {
  '/': Homepage,
}

const currentPath = ref(window.location.hash);

</script>

<!-- <template>
  <header>
  </header>

  <main>
    <UserLogin />
    <UserRegister />
    <Products />
  </main>
</template> -->

<template>



</template>

<style scoped>

header {
  line-height: 1.5;
}

</style>
