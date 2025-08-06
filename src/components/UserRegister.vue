<script setup>
import { ref, getCurrentInstance } from 'vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

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
    // if (password1 === password2) {
    //     return true;
    // }
    // return false;
    return password1 === password2;
}

// async function registerUser({ email, password, passwordConfirm, firstName, lastName, username }) {
async function registerUser() {
    console.log('Register button clicked');

    // isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    // const userData = { 
    //                     email: email, 
    //                     password: password, 
    //                     first_name: firstName,
    //                     last_name: lastName,
    //                     username: username,
    //                 };
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
        console.log('Response', response);
        if (response) {
            console.log('Registration successful, you can now login');
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


    // if (comparePasswords(password, passwordConfirm)) {
    //     console.log('Password confirmed');
    //     try {
    //         const response = await $api.registerUser(userData);
    //         console.log('Response', response);
    //         if (response) {
    //             console.log('Registration successful, you can now login');
    //         } else {
    //             console.log('Registration failed');
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // } else {
    //     console.log('Please type your password again');
    //     return 'Please type your password again';
    // }
}

</script>

<template>
    <!-- <div class="userRegister framed"> -->
    <div class="registerCard">
        <div class="cardHeader">
            <h2>Create an Account</h2>
            <p>Join our community today</p>
        </div>

        <form @submit.prevent="registerUser" class="registerForm">
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

            <div v-if="successMessage" class="successMessage">
                {{ successMessage }}
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
    </div>
</template>

<style scoped>

.registerCard {
    /* display: flex; */
    /* gap: 1.5rem; */
    /* width: 100%; */
    /* max-width: 25rem; */
    width: 25rem;
    padding: 2rem;
    margin: 2rem auto;
    /* flex-wrap: wrap; */
    /* justify-content: center; */
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    background: #f9f6ff;
    /* background: white; */
}

.registerCard:hover {
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

.registerForm {
    display: flex;
    flex-direction: column;
    /* gap: 1.5rem; */
}

.registerForm div {
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

.successMessage {
    color: #16a34a;
    font-size: 0.9rem;
}

/* Buttons */
.formActions {
    display: flex;
    flex-direction: column;
}

.registerButton {
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

.registerButton:hover:not(:disabled) {
    transform: translateY(-1px);
    /* box-shadow: 0 3px 10px rgba(139, 92, 246, 0.4); */
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

.registerButton:disabled {
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

</style>

<!-- <style scoped>
form {
    display: flex;
    flex-direction: column;
    width: 15rem;
    border: 1px grey solid;
    border-radius: 5px;
    padding: 2rem;
}

input {
    padding: 0.2rem;
}

.buttons {
    display: flex;
    justify-content: center;
}

button {
    background-color: hsla(160, 100%, 37%, 1);
    width: 5rem;
    height: 1.8rem;
    border: none;
    border-radius: 2px;
    margin: 0.8rem 0.6rem;
    padding: 0.3rem;
}

.loginButton {
    background-color: rgb(163, 168, 170);
}
</style> -->