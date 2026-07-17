<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

onBeforeMount(async () => {
    await getProfile();
    await loadOrders();
});

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

            // If a cart exists
            if (cartId) {
                store.setCartIsLoading(true);
                const cart = await $api.getCart(cartId);
                store.setCart(cart);
                console.log('Store cart property:', store.cart.products);
            } 
            store.setCartIsLoading(false);
        }
    } catch (err) {
        console.error(err);
    }
}

// Get orders by user:
async function loadOrders() {
    if (!store.loggedIn || !store.loggedInUser) {
        console.log('Unable to load orders');
        return;
    }

    try {
        const ordersResponse = await $api.getOrdersByUserId(store.loggedInUser.id);
        if (ordersResponse) {
            store.loggedInUser.orders = ordersResponse.orders;

            console.log('Store logged in user', store.loggedInUser);
        } else {
            console.log('Failed to fetch oder details');
        }
    } catch (err) {
        console.error(err);
    }
}

</script>

<template>
    <main>
        <section class="hero">
            <div class="heroInner">
                <p class="eyebrow">Purchase history</p>
                <h1>Your Orders</h1>
                <p>Browse your order history, check delivery status and access receipts whenever you need them</p>
            </div>
        </section>

        <div class="ordersContainer" v-if="store.loggedInUser.orders">

            <div v-for="order in store.loggedInUser.orders" :key="order.id" class="orderPreview">
                <h3>Order #{{  order.id  }}</h3>
                <p>Items: {{  order.product_count }}</p>
                <p>Status: {{ order.status }}</p>
                <p>Total price: {{ order.total_price / 100 + ' €'}}</p>
                <p>Placed: {{ new Date(order.placed_at).toLocaleString() }}</p>
    
                <router-link :to="`/orders/${order.id}`">Show details</router-link>
            </div>
        </div>
    </main>
</template>