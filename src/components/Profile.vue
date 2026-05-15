<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';
import UserLogin from './UserLogin.vue';
import UserRegister from './UserRegister.vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

onBeforeMount(async () => {
    await getProfile();
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
        <div class="userArea">
                <div class="userLogin" v-if="!store.loggedIn">
                    <UserLogin :onLogin="getProfile"/>
                    <UserRegister />
                </div>
    
            <div class="userProfile" v-if="store.loggedIn">
                <h1>Welcome {{ store.loggedInUser.first_name }}</h1>
                <div>
                    <router-link to="/profile/details">Personal details</router-link>
                </div>
                <div>
                    <router-link to="/orders">My orders</router-link>
                </div>
                <div>
                    <router-link to="/wishlist">Wishlist</router-link>
                </div>
                <div class="buttons">    
                    <button class="logoutButton" @click="logoutUser">Log Out</button>
                </div>
            </div>
        </div>
    </main>
</template>
