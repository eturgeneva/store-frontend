<script setup>
import { ref, onBeforeMount } from 'vue';

onBeforeMount(() => {
    getProfile();
})

const email = ref('');
const password = ref('');

// const loggedIn = ref(false);
const loggedIn = ref(null);
const loggedInUser = ref({});

const editProfile = ref(false);

// Get Profile
async function getProfile() {
    try {
        const response = await fetch('http://localhost:3000/profile', {
                credentials: 'include'
        })
        if (response.ok) {
            loggedIn.value = true;
            loggedInUser.value = await response.json();
            return;
        }
        loggedIn.value = false;
    } catch (err) {
        console.error(err);
    }
}

// Login User:
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

        loggedIn.value = true;
        console.log('loggedIn', loggedIn.value);

        await getProfile();
        console.log('loggedInUser', loggedInUser.value);

    } catch (err) {
        console.error(err);
        loggedIn.value = false;
        console.log('loggedIn', loggedIn.value);
    }
}

// Login User with Google:
async function loginUserGoogle() {
    console.log('loggedIn', loggedIn.value);

    try {
        // const response = await fetch('http://localhost:3000/login/google', {
        //     headers: { 'Content-Type': 'application/json' },
        //     credentials: 'include'
        // });
        window.location.href = 'http://localhost:3000/login/google';

        // console.log('Response', response);
        // if (!response.ok) {
        //     throw new Error('Login with Google failed');
        // }

        loggedIn.value = true;
        console.log('loggedIn', loggedIn.value);

        await getProfile();
        console.log('loggedInUser', loggedInUser.value);
    } catch (err) {
        console.error(err);
        loggedIn.value = false;
        console.log('loggedIn', loggedIn.value);
    }
}

// Update User Info:
function toggleEditProfile() {
    editProfile.value = !editProfile.value;
}

async function editUserInfo() {
    editProfile.value = false;
    try {
        const response = await fetch(`http://localhost:3000/users/${loggedInUser.value.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                first_name: loggedInUser.value.first_name, 
                last_name: loggedInUser.value.last_name, 
                address: loggedInUser.value.address 
            }),
            credentials: 'include'
        });

        const result = await response.json();
        // loggedInUser.value = result;
        Object.assign(loggedInUser.value, { ...result });
    } catch (err) {
        console.error(err);
    }
}

// Logout User:
async function logoutUser() {
    try {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (response.ok) {
            loggedIn.value = false;
        }

        if (!response.ok) {
            throw new Error('Logout failed');
        }
    } catch (err) {
        console.error(err);
    }
}

</script>

<template>
    <div class="userArea">
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
                <div>
                    <button @click="loginUser" class="loginButton">Log in</button>
                    <button type="button" class="registerButton">Register</button>
                </div>
                <div class="oauthButtons">
                    <button @click="loginUserGoogle" type="button" class="loginButton oauthButton">Login with Google</button>
                </div>
            </div>
        </div>

        <div class="userProfile" v-if="loggedIn">
            <h1>Welcome {{ loggedInUser.first_name }}</h1>
            <div>First Name: {{ loggedInUser.first_name }}
                <input v-if="editProfile" v-model="loggedInUser.first_name" type="text" name="firstName" id="firstName"></input>
            </div>
            <div>Last Name: {{ loggedInUser.last_name }}
                <input v-if="editProfile" v-model="loggedInUser.last_name" type="text" name="lastName" id="lastName"></input>
            </div>
            <div>Address: {{ loggedInUser.address || ""}}
                <input v-if="editProfile" v-model="loggedInUser.address" type="text" name="address" id="address"></input>
            </div>
            <!-- <p>Phone Number: {{ loggedInUser.phone_number || "—"}}</p> -->
            <div class="buttons">
                <button v-if="!editProfile" @click="toggleEditProfile" class="editButton">Edit Info</button>
                <button v-if="editProfile" @click="editUserInfo">Save</button>

                <button class="logoutButton" @click="logoutUser">Log Out</button>
            </div>
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