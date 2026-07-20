<script setup>
import { onBeforeMount } from 'vue';
import { useApi } from '@/api';
import { formatPrice } from '@/utils/currency';
import { store } from '../store.js';
import Item from './Item.vue';
import PageHero from './PageHero.vue';

const $api = useApi();

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
        <PageHero
            eyebrow="Purchase history"
            title="Your Orders"
            description="Browse your order history, check delivery status and access receipts whenever you need them"
        />

        <div class="ordersContainer" v-if="store.loggedInUser.orders">
            <Item
                v-for="order in store.loggedInUser.orders"
                :key="order.id"
                :item="order"
                :title="`Order #${order.id}`"
                :subtitle="order.status"
                variant="order"
            >
                <template #meta>
                    <p>Items: {{ order.product_count }}</p>
                    <p>Total price: {{ formatPrice(order.total_price) }}</p>
                    <p>Placed: {{ new Date(order.placed_at).toLocaleString() }}</p>
                </template>
                <template #actions>
                    <router-link :to="`/orders/${order.id}`">
                        <button type="button" class="orderDetailsButton">View details</button>
                    </router-link>
                </template>
            </Item>
        </div>
    </main>
</template>
