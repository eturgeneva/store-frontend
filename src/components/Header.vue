<script setup>
import { ref, computed, watch, onBeforeMount, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store.js';
import CartDrawer from './CartDrawer.vue';

defineOptions({
    name: 'SiteHeader',
});

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;
const route = useRoute();
const isProfilePopoverOpen = ref(false);
let miniCartTimer = null;

const cartQuantity = computed(() => {
    return store.cart.products.reduce((acc, { quantity }) => acc + quantity, 0);
});

const isCartPage = computed(() => route.path === '/cart');

onBeforeMount(async() => {
    await getProfile()
    console.log('cart id', store.cartId)
})

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

// Get profile (repeated in Profile and partly in Cart)
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

// Get cart 

</script>

<template>
    <header>
        <nav>
            <div class="header">
                <!-- Company logo -->
                <router-link to="/">
                    <h3 id="logo"><span>Toyz</span>Store</h3>
                </router-link>

                <!-- Searchbar -->
                <!-- <Searchbar /> -->

                <!-- Catalogue -->
                <div class="catalogue">
                    <router-link to="/new">New Collection</router-link>
                    <router-link to="/products">Products</router-link>
                    <router-link to="/sale">Sale %</router-link>
                    <router-link to="/gift-sets">Gift Sets</router-link>
                </div>
                
                <!-- User section -->
                <div class="userSection">
                    <span class="material-symbols-outlined">
                        search
                    </span>
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
                            <span v-if="store.cartId && cartQuantity"
                                class="quantityPreview">
                                {{ cartQuantity }}
                            </span>
                        </router-link>
                    </div>
                </div>
            </div>
            <!-- <div class="catalogue">
                    <router-link to="/new">New Collection</router-link>
                    <router-link to="/products">Products</router-link>
                    <router-link to="/sale">Sale %</router-link>
                    <router-link to="/gift-sets">Gift Sets</router-link>
            </div> -->
        </nav>
        <CartDrawer
            :keep-open="keepMiniCartOpen"
            :schedule-close="restartMiniCartTimer"
        />
    </header>
</template>
