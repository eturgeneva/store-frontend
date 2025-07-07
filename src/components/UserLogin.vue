<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const loggedIn = ref(false);
const loggedInUser = ref({});

async function loginUser() {
    console.log('loggedIn', loggedIn.value);

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value }),
            credentials: 'include'
        });
        console.log('Response', response);
        if (!response.ok) {
            throw new Error('Login failed');
        }

        const result = await response.json();
        console.log('Server response', result);

        loggedIn.value = true;
        console.log('loggedIn', loggedIn.value);

        loggedInUser.value = result.user;
        console.log('loggedInUser', loggedInUser.value);

    } catch (err) {
        console.error(err);
        loggedIn.value = false;
        console.log('loggedIn', loggedIn.value);
    }
}

</script>

<template>
    <div class="userLogin">
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
                <button type="button" class="registerButton">Register</button>
            </div>
        
        <div v-if="loggedIn">
            <h1>Welcome, {{ loggedInUser.first_name }}</h1>
        </div>
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