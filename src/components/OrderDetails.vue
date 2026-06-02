<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import Item from './Item.vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

// const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

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
        <div class="order">
            <Item 
                :items="orderDetails.items"
                show-summary/>
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