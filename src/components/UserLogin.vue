<script setup>
import { ref } from 'vue';
import { useApi } from '@/api';

const $api = useApi();

const props = defineProps(['onLogin']);

const email = ref('');
const password = ref('');

const isLoading = ref(false);
const errorMessage = ref('');

// Login User:
async function loginUser() {
    if (!email.value || !password.value) {
        errorMessage.value = 'Please fill in all fields';
        return;
    }
    isLoading.value = true;
    errorMessage.value = '';

    const userLoginData = { email: email.value, password: password.value };

    try {
        const response = await $api.loginUser(userLoginData);
        if (response) {
            await props.onLogin();
        } else {
            errorMessage.value = 'Invalid email or password';
        }
        isLoading.value = false;

    } catch (err) {
        console.error(err);
        errorMessage.value = 'Login failed. Please try again.'
        isLoading.value = false;
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
    </div>
</template>
