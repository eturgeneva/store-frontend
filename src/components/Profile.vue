<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';
import UserLogin from './UserLogin.vue';
import UserRegister from './UserRegister.vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

onBeforeMount(async () => {
    console.log('store loggedIn', store.loggedIn);
    console.log('store loggedInUser', store.loggedInUser);

    try {
        const user = $api.getProfile();
        if (user) {
            console.log('User object', user);
            console.log('User', user.first_name);
            if (user.first_name === 'guest') {
                store.setLoggedIn(false);
            } else {

                store.setLoggedIn(true);
                store.setLoggedInUser(user);
                console.log('store loggedIn', store.loggedIn);
                console.log('store loggedInUser', store.loggedInUser);
            }
        } else {
            console.log('Failed to get profile');
            store.setLoggedIn(false);
        }
    } catch (err) {
        console.error(err);
    }
});

const email = ref('');
const password = ref('');

const editProfile = ref(false);

// Get Profile
// async function getProfile() {
//     console.log('user profile onBeforeMount', store.loggedInUser);
//     try {
//         const response = await fetch('http://localhost:3000/users/me', {
//                 credentials: 'include'
//         })
//         if (response.ok) {
//             const userResponse = await response.json();
//             store.setLoggedIn(userResponse.id !== null);
            
//             Object.assign(store.loggedInUser, { ...userResponse });
//             return;
//         }
//         store.setLoggedIn(false);
//     } catch (err) {
//         console.error(err);
//     }
// }

// Update User Info:
function toggleEditProfile() {
    editProfile.value = !editProfile.value;
}

async function editUserInfo() {
    editProfile.value = false;
    try {
        const response = await fetch(`http://localhost:3000/users/${store.loggedInUser.id}`, {
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
    <main>
        <div class="userArea">
            <!-- <main> -->
                <div class="userLogin" v-if="!store.loggedIn">
                    <h3>Welcome, guest</h3>
                    <UserLogin :onLogin="getProfile"/>
                    <UserRegister />
                </div>
            <!-- </main> -->
    
            <div class="userProfile" v-if="store.loggedIn">
                <h1>Welcome {{ store.loggedInUser.first_name || 'Guest' }}</h1>
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
    </main>
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