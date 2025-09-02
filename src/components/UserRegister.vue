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
// Normal state:
const successMessage = ref('');

// For css tweaking:
// const successMessage = ref('1');

function comparePasswords(password1, password2) {
    return password1 === password2;
}

async function registerUser() {
    console.log('Register button clicked');

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

            <!-- <div v-if="successMessage" class="successMessage">
                {{ successMessage }}
            </div> -->

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

.cardHeader, .successCard {
    text-align: center;
    margin-bottom: 0.5rem;
}

.cardHeader h2, .successCard h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 0.5rem;
}

.cardHeader p, .successCard p {
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

.successContent {
    position: relative;
    z-index: 2;
    animation: success-bounce 0.8s ease-out;
}

@keyframes success-bounce {
    0% {
        transform: scale(0.3) translateY(30px);
        opacity: 0;
    }
    50% {
        transform: scale(1.05) translateY(-10px);
        opacity: 0.9;
    }
    100% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

.successIcon {
    position: relative;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.celebrationEmoji {
    font-size: 4rem;
    animation: emoji-bounce 1s ease-in-out infinite alternate;
}

@keyframes emoji-bounce {
    0% {
        transform: translateY(0) rotate(-5deg);
    }
    100% {
        transform: translateY(-10px) rotate(5deg);
    }
}

.celebrationGraphics {
    margin-top: 3.5rem;
    position: relative;
    height: 3rem;
    display: flex;
    justify-content: center;
    gap: 3rem;
}

.floatingEmoji {
    /* position: absolute; */
    font-size: 2rem;
    animation: float 3s ease-in-out infinite;
}

.floatingEmoji:nth-child(1) {
    /* left: 20%; */
    animation-delay: 0s;
}

.floatingEmoji:nth-child(2) {
    /* left: 50%; */
    animation-delay: 1s;
    animation-duration: 2.5s;
}

.floatingEmoji:nth-child(3) {
    /* left: 80%; */
    animation-delay: 2s;
    animation-duration: 3.5s;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
        opacity: 0.8
    }
    50% {
        transform: translateY(-20px) rotate(10deg);
        opacity: 1;
    }
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

/* Confetti */
.confettiContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.confetti {
    position: absolute;
    width: 8px;
    height: 8px;
    background: linear-gradient(45deg, #8b5cf6, #a855f7, #ec4899, #f59e0b, #10b981);
    animation: confetti-fall 3s ease-out infinite;
}

.confetti:nth-child(odd) {
    background: linear-gradient(45deg, #ec4899, #f59e0b);
    width: 6px;
    height: 12px;
    border-radius: 2px;
 }

.confetti:nth-child(even) {
    background: linear-gradient(45deg, #8b5cf6, #a855f7);
    border-radius: 50%;
}

.confetti:nth-child(3n) {
    background: linear-gradient(45deg, #10b981, #06b6d4);
    width: 10px;
    height: 4px;
    border-radius: 4px;
}

/* Generate random positions and delays for confetti */
.confetti:nth-child(1) { left: 10%; animation-delay: 0s; }
.confetti:nth-child(2) { left: 20%; animation-delay: 0.2s; }
.confetti:nth-child(3) { left: 30%; animation-delay: 0.4s; }
.confetti:nth-child(4) { left: 40%; animation-delay: 0.6s; }
.confetti:nth-child(5) { left: 50%; animation-delay: 0.8s; }
.confetti:nth-child(6) { left: 60%; animation-delay: 0.3s; }
.confetti:nth-child(7) { left: 70%; animation-delay: 0.5s; }
.confetti:nth-child(8) { left: 80%; animation-delay: 0.7s; }
.confetti:nth-child(9) { left: 90%; animation-delay: 0.9s; }
.confetti:nth-child(10) { left: 15%; animation-delay: 1s; }
.confetti:nth-child(11) { left: 25%; animation-delay: 0.1s; }
.confetti:nth-child(12) { left: 35%; animation-delay: 0.3s; }
.confetti:nth-child(13) { left: 45%; animation-delay: 0.5s; }
.confetti:nth-child(14) { left: 55%; animation-delay: 0.7s; }
.confetti:nth-child(15) { left: 65%; animation-delay: 0.9s; }
.confetti:nth-child(16) { left: 75%; animation-delay: 0.2s; }
.confetti:nth-child(17) { left: 85%; animation-delay: 0.4s; }
.confetti:nth-child(18) { left: 95%; animation-delay: 0.6s; }
.confetti:nth-child(19) { left: 5%; animation-delay: 0.8s; }
.confetti:nth-child(20) { left: 12%; animation-delay: 1.2s; }
.confetti:nth-child(21) { left: 22%; animation-delay: 0.1s; }
.confetti:nth-child(22) { left: 32%; animation-delay: 0.3s; }
.confetti:nth-child(23) { left: 42%; animation-delay: 0.5s; }
.confetti:nth-child(24) { left: 52%; animation-delay: 0.7s; }
.confetti:nth-child(25) { left: 62%; animation-delay: 0.9s; }
.confetti:nth-child(26) { left: 72%; animation-delay: 1.1s; }
.confetti:nth-child(27) { left: 82%; animation-delay: 0.2s; }
.confetti:nth-child(28) { left: 92%; animation-delay: 0.4s; }
.confetti:nth-child(29) { left: 8%; animation-delay: 0.6s; }
.confetti:nth-child(30) { left: 18%; animation-delay: 0.8s; }

@keyframes confetti-fall {
    0% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

</style>