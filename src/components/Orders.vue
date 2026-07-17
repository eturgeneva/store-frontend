<script setup>
import { onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';
import Item from './Item.vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

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
                    <p>Total price: {{ (order.total_price / 100).toFixed(2) }} €</p>
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
