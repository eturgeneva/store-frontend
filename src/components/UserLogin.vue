<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

// function loginUser() {
//     console.log('User logged in');
//     console.log('email ref', email);
//     console.log('email', email.value);
//     console.log('password', password.value);
// }

async function loginUser() {
    console.log('User logged in');
    console.log('email ref', email);
    console.log('email', email.value);
    console.log('password', password.value);

    await fetch('http://localhost:3000/')
}

</script>

<template>
    <div class="userLogin">
        <!-- <form class="unframed"> -->
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
                <button @click="loginUser" class="loginButton">Log in</button>
                <button class="registerButton">Register</button>
            </div>
        <!-- </form> -->
    </div>
</template>

<!-- <style scoped>

form {
    display: flex;
    flex-direction: column;
    width: 15rem;
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