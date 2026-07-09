<script setup>
import { computed, getCurrentInstance } from 'vue';
import { store } from '../store.js';
import Drawer from './Drawer.vue';

defineProps({
    keepOpen: {
        type: Function,
        required: true,
    },
    scheduleClose: {
        type: Function,
        required: true,
    },
});

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const cartQuantity = computed(() => {
    return store.cart.products.reduce((acc, item) => acc + item.quantity, 0);
});

const cartSubtotal = computed(() => {
    return store.cart.products.reduce((acc, item) => {
        return acc + (item.price_cents * (item.quantity || 1));
    }, 0);
});

async function removeItem(productId) {
    try {
        const updatedCart = await $api.setQuantityInCart(store.cartId, productId, 0);
        if (updatedCart) {
            store.setCart(updatedCart);
        }
    } catch (err) {
        console.error(err);
    }
}
</script>

<template>
    <Drawer
        :open="store.cartDrawerOpen"
        title="cart"
        labelled-by="cart-drawer-title"
        @close="store.closeCartDrawer()"
        @mouseenter="keepOpen"
        @mouseleave="scheduleClose"
    >
        <template #title>
            Your cart <span>({{ cartQuantity }})</span>
        </template>

        <div
            v-if="store.cartIsLoading"
            class="emptyState drawerEmptyState"
        >
            Cart is loading...
        </div>

        <div
            v-else-if="store.cart.products.length === 0"
            class="emptyState drawerEmptyState"
        >
            <b>Your cart is empty.</b>
            <p>Add a toy to start your order.</p>
        </div>

        <article
            v-for="item in store.cart.products"
            v-else
            :key="item.product_id"
            class="drawerItem"
        >
            <img
                :src="productImgURL + item.name + '.png'"
                :alt="item.name"
                @error="e => e.target.style.display = 'none'"
            >

            <div>
                <h3>
                    <router-link
                        :to="`/products/${item.product_id}`"
                        @click="store.closeCartDrawer()"
                    >
                        {{ item.name }}
                    </router-link>
                </h3>
                <p>
                    {{ item.brand }} · Qty {{ item.quantity }}<br>
                    {{ ((item.price_cents * (item.quantity || 1)) / 100).toFixed(2) + ' €' }}
                </p>
            </div>

            <button
                type="button"
                :aria-label="`Remove ${item.name}`"
                @click="removeItem(item.product_id)"
            >
                <span class="material-symbols-outlined">close</span>
            </button>
        </article>

        <template
            v-if="store.cart.products.length > 0"
            #footer
        >
            <div class="drawerSubtotal">
                <span>Subtotal</span>
                <strong>{{ (cartSubtotal / 100).toFixed(2) + ' €' }}</strong>
            </div>

            <router-link
                to="/cart"
                class="drawerCheckoutButton"
                @click="store.closeCartDrawer()"
            >
                Checkout
            </router-link>

            <p>Review your cart before placing the order.</p>
        </template>
    </Drawer>
</template>
