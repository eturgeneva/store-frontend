<script setup>
import { store } from '../store.js';

</script>

<template>
    <header>
        <h3>Logo</h3>
        <nav>
            <router-link to="/">Home</router-link> |
            <router-link to="/products">Products</router-link> |
            <router-link to="/profile">{{ store.loggedIn ? 'Profile' : 'Log In' }}</router-link> |
            <router-link to="/cart">Cart</router-link>
        </nav>
    </header>
</template>