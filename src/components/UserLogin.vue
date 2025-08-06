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
    // window.location.href = 'http://localhost:3000/login/google';
    $api.loginUserGoogle();
}

</script>

<template>
    <div class="loginCard">
        <div class="cardHeader">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
        </div>

        <form @submit.prevent="loginUser" class="loginForm">
            <div>
                <label for="email" class="formLabel">Email Address</label>
                <input v-model="email"
                        type="email" 
                        name="email" 
                        id="email"
                        class="formInput"
                        placeholder="Enter your email"
                        required>
            </div>
            
            <div>
                <label for="password" class="formLabel">Password</label>
                <input v-model="password"
                        type="password" 
                        name="password" 
                        id="password"
                        class="formInput"
                        placeholder="Enter your password"
                        required>
            </div>
        
            <div class="formActions">
                <button @click="loginUser" type="button" class="loginButton">Log in</button>
                <button @click="loginUserGoogle" type="button" class="loginButton oauthButton">Login with Google</button>
            </div>
        </form>

        <!-- <label for="email">Email</label>
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
        </div> -->
    </div>
</template>

<style scoped>

.loginCard {
    /* display: flex; */
    /* gap: 1.5rem; */
    /* width: 100%; */
    max-width: 25rem;
    padding: 2rem;
    margin: 2rem auto;
    /* flex-wrap: wrap; */
    /* justify-content: center; */
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    /* background: white; */
}

.loginForm {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

</style>