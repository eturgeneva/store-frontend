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
    <main>
        <section class="hero">
            <div class="heroInner">
                <p class="eyebrow">Purchase overview</p>
                <h1>Order details</h1>
                <p>Review your purchase, track delivery progress and access all the details of your order whenever you need them</p>
            </div>
        </section>
    
        <div class="orderContainer" v-if="orderDetails">
            <div class="order">
                <div class="orderHeading">
                    <div>
                        <h2>Order number</h2>
                    </div>
                    <span>{{ orderId }}3445454359900</span>
                </div>
                <Item 
                    :items="orderDetails.items"
                    show-summary/>
            </div>
    
            <button v-if="orderDetails.status !== 'cancelled'"
                    type="button"
                    class="cancelOrderButton"
                    @click="cancelOrder(orderDetails.orderId)">
                Cancel order
            </button>
        </div>
    </main>
</template>

<style scoped>

</style>