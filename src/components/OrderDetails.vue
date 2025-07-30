<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const route = useRoute();
const orderId = route.params.id;

const orderDetails = ref(null);

onBeforeMount(async () => {
    await showOrderDetails(orderId);
})

// Show oder details (get oder by order ID)
async function showOrderDetails(orderId) {
    try {
        const response = await $api.getOrderById(orderId);
        if (response) {
            orderDetails.value = response;
            console.log('selected Order Details', orderDetails.value);
        }
    } catch (err) {
        console.error(err);
    }
}
</script>

<template>
    <div v-if="orderDetails">
        <h2>Order ID: {{ orderDetails.orderId }}</h2>
        <div v-for="item in orderDetails.items" :key="item.product_id" class="orderItem">
            <div>Product ID: {{ item.product_id }}</div>
            <div>Product: {{ item.name }}</div>
            <div>Brand: {{  item.brand }}</div>
            <div>Quantity: {{ item.quantity }}</div>
            <div>Price per item: {{ item.price_cents }}</div>
        </div>
        <div>Total price: {{ orderDetails.priceTotal }}</div>
    </div>

</template>

<style scoped>
.orderItem {
    margin: 1rem;
    background-color: rgb(57, 57, 57);
    width: 40%;
}

</style>