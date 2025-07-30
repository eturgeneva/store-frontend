<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const route = useRoute();
const orderId = route.params.id;

const selectedOrderDetails = ref(null);

onBeforeMount(async () => {
    await showOrderDetails(orderId);
})

// Show oder details (get oder by order ID)
async function showOrderDetails(orderId) {
    try {
        const response = await $api.getOrderById(orderId);
        if (response) {
            selectedOrderDetails.value = response.orderDetails;
            console.log('selected Order Details', selectedOrderDetails.value);
        }
    } catch (err) {
        console.error(err);
    }
}
</script>

<template>
    <div>
        <div v-for="detail in selectedOrderDetails" :key="detail.product_id" class="orderItem">
            <div>Order ID: {{ detail.order_id }}</div>
            <div>Product ID: {{ detail.product_id }}</div>
            <div>Price: {{ detail.price_cents }}</div>
        </div>
    </div>

</template>

<style scoped>
.orderItem {
    margin: 1rem;
    background-color: rgb(57, 57, 57);
    width: 40%;
}

</style>