<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

onBeforeMount(async () => {
    await loadOrders();
});

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
    <div class="orders" v-if="store.loggedInUser.orders">
        <div v-for="order in store.loggedInUser.orders" :key="order.id" class="orderPreview">
            <div>Order #{{  order.id  }}</div>
            <div>Items: {{  order.product_count }}</div>
            <div>Status: {{ order.status }}</div>
            <div>Total price: {{ order.total_price }}</div>

            <router-link :to="`/orders/${order.id}`">Show details</router-link>
        </div>
    </div>
</template>