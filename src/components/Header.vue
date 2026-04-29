<script setup>
import { store } from '../store.js';

</script>

<template>
    <header>
        <h3 id="logo"><span>Toyz</span>Store</h3>
        <nav>
            <router-link to="/">Home</router-link> |
            <router-link to="/products">Products</router-link> |
            <router-link to="/profile">{{ store.loggedIn ? 'Profile' : 'Log In' }}</router-link> |
            <router-link to="/cart">Cart</router-link>
            <div class="quantity-preview">{{ store.cartId ? store.cart.products.length: ''}}</div>
        </nav>
    </header>
</template>