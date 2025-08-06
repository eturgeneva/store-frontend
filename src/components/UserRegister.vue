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

async function registerUser({ email, password, passwordConfirm, firstName, lastName, username }) {
    console.log('Register button clicked');

    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    const userData = { 
                        email: email, 
                        password: password, 
                        first_name: firstName,
                        last_name: lastName,
                        username: username,
                    };

    if (!comparePasswords(password, passwordConfirm)) {
        console.log('Passwords don\'t match');
        errorMessage.value = 'Please type your password again';
        return;
    }

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
                    <button @click="registerUser({ email, password, passwordConfirm, firstName, lastName, username })" 
                    class="registerButton">Register</button>
            </div>
        </form>
    </div>
</template>



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