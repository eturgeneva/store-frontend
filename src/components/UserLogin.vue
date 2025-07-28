<script setup>
import { store } from '../store.js';
import { ref, getCurrentInstance } from 'vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const props = defineProps(['onLogin']);

const email = ref('');
const password = ref('');

// Login User:
async function loginUser() {
    console.log('loggedIn', store.loggedIn);
    const userLoginData = { email: email.value, password: password.value };

    try {
        const response = await $api.loginUser(userLoginData);
        console.log('Response', response);
        if (response) {
            // store.setLoggedIn(true);
            await props.onLogin();
        }
        // await props.onLogin();
        console.log('loggedInUser', store.loggedInUser);
        console.log('loggedIn', store.loggedIn);

    } catch (err) {
        console.error(err);
        store.setLoggedIn(false);
        console.log('loggedIn', store.loggedIn);
    }
}

// Login User with Google:
async function loginUserGoogle() {
    window.location.href = 'http://localhost:3000/login/google';
}

</script>

<template>
    <label for="email">Email</label>
    <input v-model="email"
            type="text" 
            name="email" 
            id="email">

    <label for="password">Password</label>
    <input v-model="password"
            type="password" 
            name="password" 
            id="password">

    <div class="buttons">
        <div>
            <button @click="loginUser" type="button" class="loginButton">Log in</button>
            <button type="button" class="registerButton">Register</button>
        </div>
        <div class="oauthButtons">
            <button @click="loginUserGoogle" type="button" class="loginButton oauthButton">Login with Google</button>
        </div>
    </div>
</template>