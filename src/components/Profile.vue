<script setup>
import { ref, computed, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';
import UserLogin from './UserLogin.vue';
import UserRegister from './UserRegister.vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const cartQuantity = computed(() => {
    return store.cart.products.reduce((acc, item) => acc + item.quantity, 0);
});

const wishlistQuantity = computed(() => {
    return store.loggedInUser.wishlist.length;
});

onBeforeMount(async () => {
    try {
        await getProfile();
        await loadOrders();
        await loadRecentOrder();

        const wishlist = await $api.getWishlist();
        if (wishlist) {
                store.loggedInUser.wishlist = wishlist;
                console.log('user object from Profile',store.loggedInUser);
        } else {
                console.log('Failed to fetch wishlist');
        }
        } catch (err) {
            console.error(err);
    }
});

// Get profile
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

// Get recent order:
async function loadRecentOrder() {
    if (!store.loggedIn || !store.loggedInUser) {
        console.log('Unable to load orders');
        return;
    }
    const recentOrderId = store.loggedInUser.orders.at(-1).id;
    try {
        const recentOrder = await $api.getOrderById(recentOrderId);
        if (recentOrder) {
            store.loggedInUser.recentOrder = recentOrder;
        } else {
            console.log('Failed to fetch recent order');
        }
    } catch (err) {
        console.error(err);
    }
}

// Logout User:
async function logoutUser() {
    try {
        const response = await $api.logoutUser();
        if (response) {
            store.setLoggedIn(false);
            console.log('loggedIn global state after logout', store.loggedIn);
        } else {
            console.log('Failed to log out');
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
                <p class="eyebrow">Welcome back</p>
                <h1>Your profile</h1>
                <p>Manage your personal information, orders and account settings in one place</p>
            </div>
        </section>
        <div class="userLogin" v-if="!store.loggedIn">
            <UserLogin :onLogin="getProfile"/>
            <UserRegister />
        </div>

        <section class="userProfile" v-if="store.loggedIn">
            <aside class="profileNav">
                <router-link to="/profile/details">Personal details</router-link>
                <router-link to="/orders">My orders</router-link>
                <router-link to="/wishlist">Wishlist</router-link>
                <div class="buttons">    
                    <button class="logoutButton" @click="logoutUser">Log Out</button>
                </div> 
            </aside>
            
            <div class="profileOverview">
                <section class="profileCard profilePanel">
                    <div class="profileMetrics">
                        <div class="profileMetric">
                            <div class="profileAvatar">
                                {{ store.loggedInUser.first_name?.charAt(0) || 'U' }}
                            </div>
                            <h2>{{ store.loggedInUser.first_name }}</h2>
                            <p>{{ store.loggedInUser.email }}</p>
                        </div>
                        <div class="profileMetric">
                            <h4>Saved</h4>
                             <strong>{{ wishlistQuantity }}</strong>
                             <p>Items in your wishlist</p>
                        </div>
                        <div class="profileMetric">
                            <h4>Bag</h4>

                            <strong>{{ cartQuantity }}</strong>
                            <p>Items waiting for checkout</p>
                        </div>
                    </div>
                </section>

                <div class="profileCard">
                    <div class="profileCardHeading">
                        <div>
                            <h2>Recent concept order</h2>
                        </div>
                    </div>
                    <div class="recentOrderItem">
                        <div class="recentOrderImage">
                            <img 
                                :src="productImgURL + store.loggedInUser.recentOrder.items[0].name + '.png'"
                                :alt="store.loggedInUser.recentOrder.items[0].name"
                            >
                        </div>
                        <div class="recentOrderDetails">
                            <p>{{ store.loggedInUser.recentOrder.items[0].brand}}</p>
                            <h3>{{ store.loggedInUser.recentOrder.items[0].name}}</h3>
                            <span>
                                <p>Placed: {{ new Date(store.loggedInUser.recentOrder.placedAt).toLocaleString() }}</p>
                            </span>
                        </div>
                        <div>
                            <!-- need to calculate each item quantity -->
                            <p>+ {{ store.loggedInUser.recentOrder.items.length - 1 }} more item(s)</p>
                        </div>

                        <button type="button" class="orderDetailsButton">View details</button>
                    </div>
                </div>
                <div class="profileCard">
                    <div class="profileCardHeading">
                        <div>
                            <h2>Your saved pieces</h2>
                        </div>
                    </div>
                    <div class="wishlistFirstItem">
                        <div class="wishlistFirstImage">
                            <img 
                                :src="productImgURL + store.loggedInUser.wishlist[0].name + '.png'"
                                :alt="store.loggedInUser.wishlist[0].name"
                            >
                        </div>
                        <div class="wishlistFirstDetails">
                            <p>{{ store.loggedInUser.wishlist[0].brand}}</p>
                            <h3>{{ store.loggedInUser.wishlist[0].name}}</h3>
                        </div>
                        <div>
                            <p>+ {{ store.loggedInUser.wishlist.length - 1 }} more item(s)</p>
                        </div>
                        <router-link to="/wishlist">
                            <button type="button" class="wishlistViewButton">View wishlist</button>
                        </router-link>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
