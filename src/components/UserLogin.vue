<script setup>
import { store } from '../store.js';
import { ref, getCurrentInstance } from 'vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const props = defineProps(['onLogin']);

const email = ref('');
const password = ref('');

const isLoading = ref(false);
const errorMessage = ref('');

// Login User:
async function loginUser() {
    console.log('loggedIn', store.loggedIn);
    if (!email.value || !password.value) {
        errorMessage.value = 'Please fill in all fields';
        return;
    }
    isLoading.value = true;
    errorMessage.value = '';

    const userLoginData = { email: email.value, password: password.value };

    try {
        const response = await $api.loginUser(userLoginData);
        console.log('Response', response);
        if (response) {
            // store.setLoggedIn(true);
            await props.onLogin();
        } else {
            errorMessage.value = 'Invalid email or password';
        }
        // await props.onLogin();
        console.log('loggedInUser', store.loggedInUser);
        console.log('loggedIn', store.loggedIn);
        isLoading.value = false;

    } catch (err) {
        console.error(err);
        errorMessage.value = 'Login failed. Please try again.'
        isLoading.value = false;
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
                        :class="['formInput', { 'inputError': errorMessage === 'Please fill in all fields'}]"
                        @input="errorMessage = ''"
                        placeholder="Enter your email"
                        required>
            </div>
            
            <div>
                <label for="password" class="formLabel">Password</label>
                <input v-model="password"
                        type="password" 
                        name="password" 
                        id="password"
                        :class="['formInput', { 'inputError': errorMessage === 'Please fill in all fields'}]"
                        @input="errorMessage = ''"
                        placeholder="Enter your password"
                        required>
            </div>

            <div v-if="errorMessage" class="errorMessage">
                {{ errorMessage }}
            </div>
        
            <div class="formActions">
                <button @click="loginUser" 
                        type="button" 
                        class="loginButton"
                        :disabled="isLoading">
                        <span v-if="!isLoading">Log in</span>
                        <span v-else class="loadingSpinner">Logging in...</span>
                </button>
                <button @click="loginUserGoogle" type="button" class="googleButton oauthButton">Login with Google</button>
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

.loginCard:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.cardHeader {
    text-align: center;
    margin-bottom: 0.5rem;
}

.cardHeader h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 0.5rem;
}

.cardHeader p {
    color: #6b7280;
    font-size: 1rem;
}

.loginForm {
    display: flex;
    flex-direction: column;
    /* gap: 1.5rem; */
}

.loginForm div {
    display: flex;
    flex-direction: column;
}

.formLabel {
    font-size: 0.95rem;
    font-weight: 600;
    color: #374151;
    margin: 0.5rem 0;
}

.formInput {
    padding: 0.7rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #fafafa;
}

.formInput:focus {
    outline: none;
    border-color: #8b5cf6;
    background: white;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.formInput::placeholder {
    color: #9ca3af;
}

.errorMessage {
    /* background: #fef2f2; */
    color: #dc2626;
    /* padding: 0.75rem; */
    /* border-radius: 6px; */
    font-size: 0.9rem;
    /* border: 1px solid #fecaca; */
}

.inputError {
    border: 1px red solid;
}

/* Buttons */
.formActions {
    display: flex;
    flex-direction: column;
}

.loginButton {
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    border-radius: 8px;
    margin: 1rem 0;
    padding: 0.5rem;
    height: auto;
    width: auto;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.loginButton:hover:not(:disabled) {
    transform: translateY(-1px);
    /* box-shadow: 0 3px 10px rgba(139, 92, 246, 0.4); */
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

.loginButton:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.loadingSpinner {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
}

.loadingSpinner::after {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.oauthButton {
    /* background: white; */
    background: #e5e1f9;
    border: 3px solid #e5e7eb;
    border-radius: 8px;
    margin: 0;
    padding: 0.5rem;
    height: auto;
    width: auto;
    font-size: 1rem;
    font-weight: 500;
    color: #374151;
    transition: all 0.3s ease;
}

.oauthButton:hover {
    border-color: #d1d5db;
    /* background: #f9fafb; */
    background: #e5e1f9;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

</style>