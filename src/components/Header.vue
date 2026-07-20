<script setup>
import { onBeforeUnmount, onMounted, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { store } from '../store.js';
import CartDrawer from './CartDrawer.vue';
import Searchbar from './Searchbar.vue';

defineOptions({
    name: 'SiteHeader',
});

const route = useRoute();
const { cartId, quantity: cartQuantity } = useCart();
const { count: wishlistQuantity } = useWishlist();
const isProfilePopoverOpen = ref(false);
const isSearchOpen = ref(false);
let miniCartTimer = null;

const isCartPage = computed(() => route.path === '/cart');

watch(isCartPage, (onCartPage) => {
    if (onCartPage) {
        store.closeCartDrawer();
    }
});

watch(() => store.cartDrawerOpen, (isOpen) => {
    if (miniCartTimer) {
        clearTimeout(miniCartTimer);
    }

    if (isOpen) {
        miniCartTimer = setTimeout(() => {
            store.closeCartDrawer();
        }, 5000);
    }
});

watch(() => route.fullPath, () => {
    isSearchOpen.value = false;
});

function openCartDrawerOnHover() {
    if (isCartPage.value) {
        store.closeCartDrawer();
        return;
    }

    store.openCartDrawer();
}

function keepMiniCartOpen() {
    if (miniCartTimer) {
        clearTimeout(miniCartTimer);
    }
}

function restartMiniCartTimer() {
    if (!store.cartDrawerOpen) {
        return;
    }
    miniCartTimer = setTimeout(() => {
        store.closeCartDrawer();
    }, 1200);
}

function openSearch() {
    isSearchOpen.value = true;
}

function closeSearchOnOutsideClick(event) {
    if (!isSearchOpen.value) {
        return;
    }

    if (event.target.closest('.headerSearchOverlay, .headerSearchToggle')) {
        return;
    }

    isSearchOpen.value = false;
}

onMounted(() => {
    document.addEventListener('pointerdown', closeSearchOnOutsideClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', closeSearchOnOutsideClick);
});

</script>

<template>
    <header>
        <nav>
            <div :class="['header', { searchActive: isSearchOpen }]">
                <!-- Company logo -->
                <router-link to="/">
                    <h3 id="logo"><span>Toyz</span>Store</h3>
                </router-link>

                <!-- Catalogue -->
                <div class="catalogue">
                    <router-link to="/new">New Collection</router-link>
                    <router-link to="/products">Products</router-link>
                    <router-link to="/sale">Sale %</router-link>
                    <router-link to="/gift-sets">Gift Sets</router-link>
                </div>
                
                <!-- User section -->
                <div class="userSection">
                    <Transition name="searchUnwrap">
                        <Searchbar
                            v-if="isSearchOpen"
                            class="headerSearchOverlay"
                            auto-focus
                            @close="isSearchOpen = false"
                            @submitted="isSearchOpen = false"
                        />
                    </Transition>
                    <button
                        type="button"
                        class="headerSearchToggle"
                        :aria-expanded="isSearchOpen"
                        aria-label="Search products"
                        @click="openSearch"
                    >
                        <span class="material-symbols-outlined">search</span>
                    </button>
                    <router-link to="/">
                        <span class="material-symbols-outlined">
                            home
                        </span>
                    </router-link>
                    <div
                        class="profileMenu"
                        @mouseenter="isProfilePopoverOpen = true"
                        @mouseleave="isProfilePopoverOpen = false"
                        @focusin="isProfilePopoverOpen = true"
                        @focusout="isProfilePopoverOpen = false"
                    >
                        <router-link to="/profile" class="profileIconLink">
                            <span class="material-symbols-outlined">
                                person
                            </span>
                        </router-link>

                        <div
                            v-if="isProfilePopoverOpen"
                            class="profilePopover"
                        >
                            <div class="profilePopoverHeader">
                                {{ store.loggedIn ? `Hi, ${store.loggedInUser.first_name}` : 'Your account' }}
                            </div>

                            <router-link to="/profile">
                                {{ store.loggedIn ? 'My profile' : 'Log in' }}
                            </router-link>
                            <router-link to="/orders">Orders</router-link>
                            <router-link to="/wishlist">Wishlist</router-link>
                        </div>
                    </div>
                    <router-link to="/wishlist">
                        <span class="material-symbols-outlined">
                            favorite
                        </span>

                        <span v-if="store.loggedIn && wishlistQuantity"
                            class="quantityPreview"
                        >
                            {{ wishlistQuantity }}
                        </span>
                    </router-link>
                    <div
                        class="cartMenu"
                        @mouseenter="openCartDrawerOnHover"
                        @mouseleave="restartMiniCartTimer"
                    >
                        <router-link
                            to="/cart"
                            class="cartIconLink"
                            aria-label="Open cart page"
                            @click="store.closeCartDrawer()"
                        >
                            <span class="material-symbols-outlined">
                                shopping_bag
                            </span>
                            <span v-if="cartId && cartQuantity"
                                class="quantityPreview">
                                {{ cartQuantity }}
                            </span>
                        </router-link>
                    </div>
                </div>
            </div>
        </nav>
        <CartDrawer
            :keep-open="keepMiniCartOpen"
            :schedule-close="restartMiniCartTimer"
        />
    </header>
</template>
