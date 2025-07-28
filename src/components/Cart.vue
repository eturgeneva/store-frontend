<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

// const props = defineProps(['api']);

const productQuantity = ref(null);

onBeforeMount(async () => {
    console.log('231123123', store.cartId);
    if (!store.cartId) {
        return;
    }
    store.setCartIsLoading(true);
    console.log('Store cart property:', store.cart.products);
    const cart = await $api.getCart(store.cartId);
    // const cart = await props.api.getCart();
    if (cart) {
        store.setCart(cart);
        console.log('Store cart property:', store.cart.products);
    }
    store.setCartIsLoading(false);
});

</script>

<template>
    <main>
        <div class="userCart">
            <h3>Cart</h3>
            <div v-if="store.cart.products.length === 0">Your cart is empty</div>
            <div v-else-if="store.cartIsLoading">Cart is loading...</div>
            <div v-else>
                <div v-for="product in store.cart.products" 
                :key="product.product_id"
                class="product">
                    <div>{{ product.name }}</div>
                    <div>{{ product.quantity }}</div>
                    <div class="buttonContainer">
                        <button type="button">+</button>
                        <input v-model="product.quantity"></input>
                        <button type="button">-</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>