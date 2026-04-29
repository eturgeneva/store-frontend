<script setup>
import { onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

onBeforeMount(async() => {
    await getProfile()
    console.log('cart id', store.cartId)
})

// Get profile (repeated in Profile and partly in Cart)
async function getProfile() {
    console.log('store loggedIn', store.loggedIn);
    console.log('store loggedInUser', store.loggedInUser);
    try {
        const user = await $api.getUser();
        if (user) {
            console.log('User object', user);
            console.log('User first name:', user.first_name);
            console.log('User cart ID:', user.cartId);

            store.setLoggedIn(user.id !== null);
            if (user.id !== null) {
                Object.assign(store.loggedInUser, user);
            }
            console.log('Store loggedIn', store.loggedIn);

            let cartId = user.cartId;
            store.setCartId(cartId);
            store.setCartIsLoading(true);

            const cart = await $api.getCart(cartId);

            if (cart) {
                store.setCart(cart);
                console.log('Store cart property:', store.cart.products);
            }
            store.setCartIsLoading(false);
        }
    } catch (err) {
        console.error(err);
    }
}

// Get cart 

</script>

<template>
    <header>
        <h3 id="logo"><span>Toyz</span>Store</h3>
        <nav>
            <router-link to="/">Home</router-link> |
            <router-link to="/products">Products</router-link> |
            <router-link to="/profile">{{ store.loggedIn ? 'Profile' : 'Log In' }}</router-link> |
            <router-link to="/cart">Cart</router-link>
            <!-- <div class="quantity-preview">{{ store.cartId ? store.cart.products.length: ''}}</div> -->
            <div class="quantity-preview">{{ store.cartId 
                ? store.cart.products.reduce((acc, {quantity}) => acc + quantity, 0)
                : ''}}</div>
        </nav>
    </header>
</template>