<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store.js';
import Item from './Item.vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

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

// Maybe enable only for admin
async function cancelOrder(orderId) {
    try {
        const response = await $api.cancelOrderById(orderId);
        if (response) {
            orderDetails.value.status = 'cancelled';
            console.log('selected order status', orderDetails.value.status);
        }
    } catch (err) {
        console.error(err);
    }
}

</script>

<template>
    <div class="orderContainer" v-if="orderDetails">
        <div class="orderContent">
            <!-- <div v-for="item in orderDetails.items" 
                :key="item.product_id" 
                class="orderItem">
                <img :src="productImgURL + item.name + '.png'" class="orderItemImage">
                <div class="orderItemInfo">
                    <div>
                        <router-link :to="`/products/${item.product_id}`" class="productLink">
                            {{ item.name }}
                        </router-link>
                    </div>
                    <div>{{  item.brand }}</div>
                    <div>Quantity: {{ item.quantity }}</div>
                    <div>Price: {{ item.price_cents }}</div>
                </div>
            </div>
            <div class="orderSummary">
                <div>Total price: {{ parseInt(orderDetails.priceTotal).toFixed(2) }}</div>
                <div>Status: {{ orderDetails.status }}</div>
                <div>Order ID: {{ orderDetails.orderId }}</div>
                <div>Placed: {{ new Date(orderDetails.placedAt).toLocaleString() }}</div>
            </div> -->
            <Item :items="orderDetails.items"/>
        </div>

        <button v-if="orderDetails.status !== 'cancelled'"
                type="button"
                @click="cancelOrder(orderDetails.orderId)">
            Cancel order
        </button>
    </div>

</template>

<style scoped>

</style>