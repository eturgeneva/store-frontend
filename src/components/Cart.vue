<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

// const props = defineProps(['api']);

onBeforeMount(async () => {
    if (!store.cartId) {
        return;
    }
    store.setCartIsLoading(true);
    console.log('Store cart property:', store.cart.products);
    const cart = await $api.getCart();
    // const cart = await props.api.getCart();
    if (cart) {
        store.setCart(cart);
        console.log('Store cart property:', store.cart.products);
    }
    store.setCartIsLoading(false);
});

</script>

<template>
    <div class="userCart">
        <h3>Cart</h3>
        <div v-if="store.cart.products.length === 0">Your cart is empty</div>
        <div v-else-if="store.cartIsLoading">Cart is loading...</div>
        <div v-else>
            <div v-for="product in store.cart.products" :key="product.product_id">
                <div>{{ product.name }}</div>
            </div>
        </div>
    </div>
</template>