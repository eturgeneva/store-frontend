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

function comparePasswords(password1, password2) {
    if (password1 === password2) {
        return true;
    }
    return false;
}

// async function registerUser(userData) {
async function registerUser({ email, password, passwordConfirm, firstName, lastName, username }) {
    console.log('Register button clicked');

    const userData = { 
                        email: email, 
                        password: password, 
                        first_name: firstName,
                        last_name: lastName,
                        username: username,
                    };

    if (comparePasswords(password.value, passwordConfirm.value)) {
        console.log('Password confirmed');
        try {
            const response = await $api.registerUser(userData);
            console.log('Response', response);
            if (response) {
                console.log('Registration successful, you can now login');
            } else {
                console.log('Registration failed');
            }
        } catch (err) {
            console.error(err);
        }
    } else {
        return 'Please type your password again';
    }
}

</script>

<template>
    <div class="userRegister framed">
            <label for="email">Email</label>
            <input v-model="email" type="text" name="email" id="email">

            <label for="password">Password</label>
            <input v-model="password" type="password" name="password" id="password">

            <label for="password">Confirm Password</label>
            <input v-model="passwordConfirm" type="password" name="passwordConfirm" id="passwordConfirm">
            
            <label for="first_name">First Name</label>
            <input v-model="firstName" type="text" name="first_name" id="first_name"></input>

            <label for="last_name">Last Name</label>
            <input v-model="lastName" type="text" name="last_name" id="last_name"></input>

            <label for="username">Username</label>
            <input v-model="username" type="text" name="username" id="username"></input>

            <div class="buttons">
                <button @click="registerUser({ email, password, passwordConfirm, firstName, lastName, username })" 
                class="registerButton">Register</button>
            </div>
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