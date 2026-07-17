<script setup>
import { ref } from 'vue';
import { useApi } from '@/api';

const $api = useApi();

const username = ref('');
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

function comparePasswords(password1, password2) {
    return password1 === password2;
}

async function registerUser() {
    errorMessage.value = '';
    successMessage.value = '';

    const userData = { 
                        email: email.value, 
                        password: password.value, 
                        first_name: firstName.value,
                        last_name: lastName.value,
                        username: username.value,
                    };
                    
    if (!email.value || !password.value || !passwordConfirm.value || !firstName.value || !lastName.value || !username.value ) {
        errorMessage.value = 'Please fill in all fields';
        return;
    }

    if (!comparePasswords(password.value, passwordConfirm.value)) {
        console.log('Passwords don\'t match');
        errorMessage.value = 'Please type your password again';
        return;
    }
    isLoading.value = true;

    try {
        const response = await $api.registerUser(userData);
        if (response) {
            successMessage.value = 'Registration successful, you can now login';
            isLoading.value = false;

            email.value = '';
            password.value = '';
            passwordConfirm.value = '';
            firstName.value = '';
            lastName.value = '';
            username.value = '';
        } else {
            console.log('Registration failed');
            errorMessage.value = 'Registration failed. Please try again';
            isLoading.value = false;
        }
    } catch (err) {
        console.error(err);
        errorMessage.value = 'Registration failed. Please try again';
        isLoading.value = false;
    }
}

</script>

<template>
    <div class="registerCard">
        <div class="cardHeader" v-if="!successMessage">
            <h2>Create an Account</h2>
            <p>Join our community today</p>
        </div>

        <form @submit.prevent="registerUser" class="registerForm" v-if="!successMessage">
            <div>
                <label for="first_name" class="formLabel">First Name</label>
                <input v-model="firstName" type="text" name="first_name" id="first_name"
                        class="formInput" placeholder="Enter your first name" required>
            </div>

            <div>
                <label for="last_name" class="formLabel">Last Name</label>
                <input v-model="lastName" type="text" name="last_name" id="last_name"
                        class="formInput" placeholder="Enter your last name" required>
            </div>

            <div>
                <label for="username" class="formLabel">Username</label>
                <input v-model="username" type="text" name="username" id="username"
                        class="formInput" placeholder="Choose a username" required>
            </div>

            <div>
                <label for="email" class="formLabel">Email</label>
                <input v-model="email" type="text" name="email" id="email"
                        class="formInput" placeholder="Enter your email" required>
            </div>

            <div>
                <label for="password" class="formLabel">Password</label>
                <input v-model="password" type="password" name="password" id="password"
                        class="formInput" placeholder="Create a password" required>
            </div>

            <div>
                <label for="password" class="formLabel">Confirm Password</label>
                <input v-model="passwordConfirm" type="password" name="passwordConfirm" id="passwordConfirm"
                        class="formInput" placeholder="Confirm your password" required>
            </div>

            <div v-if="errorMessage" class="errorMessage">
                {{ errorMessage }}
            </div>

            <div class="formActions">
                <button @click="registerUser"
                        type="button" 
                        class="registerButton"
                        :disabled="isLoading">
                        <span v-if="!isLoading">Register</span>
                        <span v-else class="loadingSpinner">Creating account...</span>
                </button>
            </div>
        </form>
        
        <div v-if="successMessage" class="successCard">
            <!-- Confetti Animation -->
            <div class="confettiContainer">
                <div class="confetti" v-for="i in 30" :key="i"></div>
            </div>

            <!-- Content -->
            <div class="successContent">
                <div class="successIcon">
                    <div class="celebrationEmoji">🎉</div>
                </div>

                <h2>Welcome Abroad!</h2>
                <p>Your account has been successfully created!</p>
                <p>You can now login and start shopping</p>
                <div class="celebrationGraphics">
                    <span class="floatingEmoji">🛍️</span>
                    <span class="floatingEmoji">✨</span>
                    <span class="floatingEmoji">🎊</span>
                </div>
            </div>
        </div>
    </div>
</template>
