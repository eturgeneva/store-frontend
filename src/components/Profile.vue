<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';
import UserLogin from './UserLogin.vue';
import UserRegister from './UserRegister.vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

onBeforeMount(async () => {
    // console.log('store loggedIn', store.loggedIn);
    // console.log('store loggedInUser', store.loggedInUser);

    await getProfile();
});

const email = ref('');
const password = ref('');

const editProfile = ref(false);

// Get profile
async function getProfile() {
    console.log('store loggedIn', store.loggedIn);
    console.log('store loggedInUser', store.loggedInUser);
    try {
        const user = await $api.getUser();
        if (user) {
            console.log('User object', user);
            console.log('User first name:', user.first_name);
            console.log('User cart ID:', user.cartId);

            store.setLoggedIn(user.id !== null);
            if (user.id !== null) {
                // store.setLoggedIn(true);
                Object.assign(store.loggedInUser, user);
            }
            console.log('Store loggedIn', store.loggedIn);
            // console.log('store loggedInUser', store.loggedInUser);
        }
    } catch (err) {
        console.error(err);
    }
}

// Update User Info:
function toggleEditProfile() {
    editProfile.value = !editProfile.value;
}

async function editUserInfo() {
    editProfile.value = false;
    const userData = {
        first_name: store.loggedInUser.first_name, 
        last_name: store.loggedInUser.last_name, 
        address: store.loggedInUser.address  
    }
    console.log('Store logged in user', store.loggedInUser.id);
    console.log('User data to edit', userData);

    try {
        const updatedUser = await $api.updateUser(store.loggedInUser.id, userData);

        if (updatedUser) {
            console.log('Updated user', updatedUser);
            Object.assign(store.loggedInUser, { ...updatedUser });
        } else {
            console.log('Failed to update user info');
        }

    } catch (err) {
        console.error(err);
    }
}

// Logout User:
async function logoutUser() {
    try {
        const response = await $api.logoutUser();
        if (response) {
            store.setLoggedIn(false);
            console.log('loggedIn global state after logout', store.loggedIn);
        } else {
            console.log('Failed to log out');
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
                <!-- <h1>Welcome {{ store.loggedInUser.first_name || 'Guest' }}</h1> -->
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