<script setup>
import { ref, computed, watch, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';
import Searchbar from './Searchbar.vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;
const isProfilePopoverOpen = ref(false);
let miniCartTimer = null;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const cartQuantity = computed(() => {
    return store.cart.products.reduce((acc, { quantity }) => acc + quantity, 0);
});

const cartSubtotal = computed(() => {
    return store.cart.products.reduce((acc, item) => {
        return acc + (item.price_cents * (item.quantity || 1));
    }, 0);
});

const miniCartItems = computed(() => {
    return [...store.cart.products].slice(-3).reverse();
});

onBeforeMount(async() => {
    await getProfile()
    console.log('cart id', store.cartId)
})

watch(() => store.miniCartOpen, (isOpen) => {
    if (miniCartTimer) {
        clearTimeout(miniCartTimer);
    }

    if (isOpen) {
        miniCartTimer = setTimeout(() => {
            store.hideMiniCart();
        }, 5000);
    }
});

function keepMiniCartOpen() {
    if (miniCartTimer) {
        clearTimeout(miniCartTimer);
    }
}

function restartMiniCartTimer() {
    if (!store.miniCartOpen) {
        return;
    }
    miniCartTimer = setTimeout(() => {
        store.hideMiniCart();
    }, 3000);
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
                        @mouseenter="keepMiniCartOpen"
                        @mouseleave="restartMiniCartTimer"
                    >
                        <router-link to="/cart" class="cartIconLink">
                            <span class="material-symbols-outlined">
                                shopping_bag
                            </span>
                            <span v-if="store.cartId && cartQuantity"
                                class="quantityPreview">
                                {{ cartQuantity }}
                            </span>
                        </router-link>

                        <div
                            v-if="store.miniCartOpen"
                            class="miniCartPopover"
                        >
                            <div class="miniCartHeader">
                                <span>Added to cart</span>
                                <button
                                    type="button"
                                    class="miniCartClose"
                                    @click="store.hideMiniCart()"
                                >
                                    <span class="material-symbols-outlined">
                                        close
                                    </span>
                                </button>
                            </div>

                            <div v-if="miniCartItems.length" class="miniCartItems">
                                <div
                                    v-for="item in miniCartItems"
                                    :key="item.product_id"
                                    class="miniCartItem"
                                >
                                    <img
                                        :src="productImgURL + item.name + '.png'"
                                        :alt="item.name"
                                        @error="e => e.target.style.display = 'none'"
                                    >
                                    <div class="miniCartItemInfo">
                                        <router-link
                                            :to="`/products/${item.product_id}`"
                                            @click="store.hideMiniCart()"
                                        >
                                            {{ item.name }}
                                        </router-link>
                                        <span>Qty {{ item.quantity }}</span>
                                    </div>
                                    <div class="miniCartItemPrice">
                                        {{ ((item.price_cents * (item.quantity || 1)) / 100).toFixed(2) + ' €' }}
                                    </div>
                                </div>
                            </div>

                            <div class="miniCartSummary">
                                <span>{{ cartQuantity }} item{{ cartQuantity === 1 ? '' : 's' }}</span>
                                <strong>{{ (cartSubtotal / 100).toFixed(2) + ' €' }}</strong>
                            </div>

                            <div class="miniCartActions">
                                <router-link
                                    to="/cart"
                                    class="miniCartPrimary"
                                    @click="store.hideMiniCart()"
                                >
                                    View cart
                                </router-link>
                                <button
                                    type="button"
                                    class="miniCartSecondary"
                                    @click="store.hideMiniCart()"
                                >
                                    Continue shopping
                                </button>
                            </div>
                        </div>
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
    </header>
</template>
