<script setup>
import { ref, onBeforeMount } from 'vue';
import { store } from '../store.js';
import UserLogin from './UserLogin.vue';
import UserRegister from './UserRegister.vue';

onBeforeMount(() => {
    getProfile();
    console.log('store loggedIn', store.loggedIn);
    console.log('store loggedInUser', store.loggedInUser);
})

const email = ref('');
const password = ref('');

const editProfile = ref(false);

// Get Profile
async function getProfile() {
    console.log('user profile onBeforeMount', store.loggedInUser);
    try {
        const response = await fetch('http://localhost:3000/users/me', {
                credentials: 'include'
        })
        if (response.ok) {
            const userResponse = await response.json();
            store.setLoggedIn(userResponse.id !== null);
            
            Object.assign(store.loggedInUser, { ...userResponse });
            return;
        }
        store.setLoggedIn(false);
    } catch (err) {
        console.error(err);
    }
}

// // Login User:
// async function loginUser() {
//     console.log('loggedIn', store.loggedIn);

//     try {
//         const response = await fetch('http://localhost:3000/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email: email.value, password: password.value }),
//             credentials: 'include'
//         });
//         console.log('Response', response);
//         if (!response.ok) {
//             throw new Error('Login failed');
//         }

//         store.setLoggedIn(true);
//         console.log('loggedIn', store.loggedIn);

//         await getProfile();
//         console.log('loggedInUser', store.loggedInUser);

//     } catch (err) {
//         console.error(err);
//         store.setLoggedIn(false);
//         console.log('loggedIn', store.loggedIn);
//     }
// }

// // Login User with Google:
// async function loginUserGoogle() {
//     window.location.href = 'http://localhost:3000/login/google';
// }

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
                first_name: store.loggedInUser.first_name, 
                last_name: store.loggedInUser.last_name, 
                address: store.loggedInUser.address 
            }),
            credentials: 'include'
        });

        const result = await response.json();
        Object.assign(store.loggedInUser, { ...result });
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
            store.setLoggedIn(false);
            console.log('loggedIn global state after logout', store.loggedIn);
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
        <!-- <div class="userLogin" v-if="!store.loggedIn || store.userProfile.first_name === 'guest'"> -->
        <div class="userLogin" v-if="!store.loggedIn">
            <h3>Welcome, guest</h3>
            <UserLogin :onLogin="getProfile"/>
            <UserRegister />
        </div>

        <!-- <div class="userProfile" v-if="store.loggedIn && store.loggedInUser.first_name !== 'guest'"> -->
        <div class="userProfile" v-if="store.loggedIn">
            <h1>Welcome {{ store.loggedInUser.first_name }}</h1>
            <div>First Name: {{ store.loggedInUser.first_name }}
                <input v-if="editProfile" v-model="store.loggedInUser.first_name" type="text" name="firstName" id="firstName"></input>
            </div>
            <div>Last Name: {{ store.loggedInUser.last_name }}
                <input v-if="editProfile" v-model="store.loggedInUser.last_name" type="text" name="lastName" id="lastName"></input>
            </div>
            <div>Address: {{ store.loggedInUser.address || ""}}
                <input v-if="editProfile" v-model="store.loggedInUser.address" type="text" name="address" id="address"></input>
            </div>
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