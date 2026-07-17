<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useApi } from '@/api';
import { formatPrice } from '@/utils/currency';
import { useRoute } from 'vue-router';
import Item from './Item.vue';

const $api = useApi();

const route = useRoute();
const orderId = route.params.id;

const orderDetails = ref(null);
const totalPrice = computed(() => orderDetails.value?.items.reduce(
    (total, item) => total + item.price_cents * (item.quantity || 1), 0
) || 0);

onBeforeMount(async () => {
    await showOrderDetails(orderId);
})

// Show oder details (get oder by order ID)
async function showOrderDetails(orderId) {
    try {
        const response = await $api.getOrderById(orderId);
        if (response) {
            orderDetails.value = response;
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
                    v-for="item in orderDetails.items"
                    :key="item.product_id"
                    :item="item"
                    :title="item.name"
                    :subtitle="item.brand"
                    :image-src="`https://eturgeneva.github.io/toy-store-assets/${item.name}.png`"
                    :to="`/products/${item.product_id}`"
                >
                    <template #meta>
                        <p>Quantity: {{ item.quantity || 1 }}</p>
                        <p>Price: {{ formatPrice(item.price_cents) }}</p>
                    </template>
                </Item>
                <div class="itemSummary">
                    <div class="itemSummaryLines">
                        <div><span>Subtotal</span><strong>{{ formatPrice(totalPrice) }}</strong></div>
                        <div><span>Shipping</span><strong>free</strong></div>
                    </div>
                    <div class="itemSummaryTotal">
                        <span>Total</span><strong>{{ formatPrice(totalPrice) }}</strong>
                    </div>
                </div>
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
