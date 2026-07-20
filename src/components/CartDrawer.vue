<script setup>
import { store } from '../store.js';
import Drawer from './Drawer.vue';
import { useCart } from '@/composables/useCart';
import { formatPrice } from '@/utils/currency';
import { getProductImageUrl } from '@/utils/products';

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

const {
    cart,
    isLoading,
    quantity: cartQuantity,
    removeItem,
    subtotal: cartSubtotal,
} = useCart();
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
            v-if="isLoading"
            class="emptyState drawerEmptyState"
        >
            Cart is loading...
        </div>

        <div
            v-else-if="cart.products.length === 0"
            class="emptyState drawerEmptyState"
        >
            <b>Your cart is empty.</b>
            <p>Add a toy to start your order.</p>
        </div>

        <article
            v-for="item in cart.products"
            v-else
            :key="item.product_id"
            class="drawerItem"
        >
            <img
                :src="getProductImageUrl(item)"
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
                    {{ formatPrice(item.price_cents * (item.quantity || 1)) }}
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
            v-if="cart.products.length > 0"
            #footer
        >
            <div class="drawerSubtotal">
                <span>Subtotal</span>
                <strong>{{ formatPrice(cartSubtotal) }}</strong>
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
