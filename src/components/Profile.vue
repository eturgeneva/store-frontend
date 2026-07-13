<script setup>
import { ref, computed, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';
import UserLogin from './UserLogin.vue';
import UserRegister from './UserRegister.vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

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
                <!-- <h1>Welcome {{ store.loggedInUser.first_name }}</h1> -->

                <section class="profileCard profilePanel">
                    <div class="profileCardHeading profilePanelHeading">
                        <div>
                            <!-- <p class="eyebrow">Overview</p> -->
                            <!-- <h2>Today's toy edit</h2> -->
                        </div>
                    </div>
                    <div class="profileMetrics">
                        <div class="profileMetric">
                            <div class="profileAvatar">
                                {{ store.loggedInUser.first_name?.charAt(0) || 'U' }}
                            </div>
                            <!-- <p class="eyebrow">Concept member</p> -->
                            <h2>{{ store.loggedInUser.first_name }}</h2>
                            <p>{{ store.loggedInUser.email }}</p>
                        </div>
                        <div class="profileMetric">
                            <h4>Saved</h4>
                            <!-- <p><span>{{ wishlistQuantity }} {{ wishlistQuantity === 1 ? 'item' : 'items' }}</span> in your wishlist</p> -->
                             <strong>{{ wishlistQuantity }}</strong>
                             <p>Items in your wishlist</p>
                        </div>
                        <div class="profileMetric">
                            <h4>Bag</h4>
                            <!-- <p><span>{{ cartQuantity }} {{ cartQuantity === 1 ? 'item' : 'items' }}</span> in your cart waiting for checkout</p> -->
                            <strong>{{ cartQuantity }}</strong>
                            <p>Items waiting for checkout</p>
                        </div>
                        <!-- <div class="profileMetric">
                            <h4>Toy Club</h4>
                             <p>Early access to concept drops</p>
                        </div> -->
                    </div>
                </section>

                <div class="profileCard">
                    <div class="profileCardHeading">
                        <div>
                            <h2>Recent concept order</h2>
                        </div>
                    </div>
                    <div>
                        <p>{{ store.loggedInUser.orders.at(-1) }}</p>
                    </div>
                </div>
                <div class="profileCard">
                    <div class="profileCardHeading">
                        <div>
                            <h2>Your saved pieces</h2>
                        </div>
                    </div>
                    <div>
                        <p>{{ store.loggedInUser.wishlist[0] }}</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
