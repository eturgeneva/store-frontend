<script setup>
// My components
import UserLogin from './components/UserLogin.vue';
import UserRegister from './components/UserRegister.vue';
import Products from './components/Products.vue';
import Cart from './components/Cart.vue';
</script>

<template>
  <header>
  </header>

  <main>
    <UserLogin />
    <UserRegister />
    <!-- <Cart /> -->
    <Products />
  </main>
</template>

<style scoped>

header {
  line-height: 1.5;
}

</style>
