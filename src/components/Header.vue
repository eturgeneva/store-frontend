<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;
const isProfilePopoverOpen = ref(false);

onBeforeMount(async() => {
    await getProfile()
    console.log('cart id', store.cartId)
})

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
            <div class="headerTop">
                <h3 id="logo"><span>Toyz</span>Store</h3>
                <div class="userSection">
                    <router-link to="/">
                        <span class="material-symbols-outlined">
                            home
                        </span>
                    </router-link>
                    <!-- <router-link to="/profile">{{ store.loggedIn ? 'Profile' : 'Log In' }}</router-link> | -->
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
                    <router-link to="/cart">
                        <span class="material-symbols-outlined">
                            shopping_bag
                        </span>
                    </router-link>
                    <div class="quantity-preview">{{ store.cartId 
                        ? store.cart.products.reduce((acc, {quantity}) => acc + quantity, 0)
                        : ''}}
                    </div>
                </div>
            </div>
            <div class="catalogue">
                    <router-link to="/new">New</router-link>
                    <router-link to="/products">Products</router-link>
                    <router-link to="/sale">Sale %</router-link>
                    <router-link to="/gift-sets">Gift Sets</router-link>
            </div>
        </nav>
    </header>
</template>
