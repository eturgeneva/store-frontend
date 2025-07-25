<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

// const props = defineProps(['api']);
// console.log(store.cartId.value);
onBeforeMount(async () => {
    console.log('231123123', store.cartId);
    if (!store.cartId.value) {
        return;
    }
    store.setCartIsLoading(true);
    console.log('Store cart property:', store.cart.products);
    const cart = await $api.getCart(store.cartId.value);
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
        <div v-if="store.cart.value.products.length === 0">Your cart is empty</div>
        <div v-else-if="store.cartIsLoading.value">Cart is loading...</div>
        <div v-else>
            <div v-for="product in store.cart.value.products" :key="product.product_id">
                <div>{{ product.name }}</div>
            </div>
        </div>
    </div>
</template>