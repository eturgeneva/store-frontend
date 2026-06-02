<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

onBeforeMount(async () => {
    await getProfile();
});

// const email = ref('');
// const password = ref('');

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
                Object.assign(store.loggedInUser, user);
            }
            console.log('Store loggedIn', store.loggedIn);
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

</script>

<template>
    <div class="userDetails">
        <div class="userDetail">
            <div>
                <div>
                    <span class="material-symbols-outlined">
                        person
                    </span>
                </div>
                <div class="userInfo">
                    <div>First Name: {{ store.loggedInUser.first_name }}
                        <input v-if="editProfile" v-model="store.loggedInUser.first_name" type="text" name="firstName" id="firstName"></input>
                    </div>
                    <div>Last Name: {{ store.loggedInUser.last_name }}
                        <input v-if="editProfile" v-model="store.loggedInUser.last_name" type="text" name="lastName" id="lastName"></input>
                    </div>
                    <div>Address: {{ store.loggedInUser.address || ""}}
                        <input v-if="editProfile" v-model="store.loggedInUser.address" type="text" name="address" id="address"></input>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <button v-if="!editProfile" @click="toggleEditProfile" class="editButton">Edit</button>
                <button v-if="editProfile" @click="editUserInfo">Save</button>
            </div>
        </div>

        <div class="userDetail">
            <div>
                <div>
                    <span class="material-symbols-outlined">
                        mail
                    </span>
                </div>
                <div>Email: {{ store.loggedInUser.email || ""}}
                    <input v-if="editProfile" v-model="store.loggedInUser.email" type="email" name="email" id="email"></input>
                </div>
            </div>
            <div class="buttons">
                <button v-if="!editProfile" @click="toggleEditProfile" class="editButton">Edit</button>
                <button v-if="editProfile" @click="editUserInfo">Save</button>
            </div>
        </div>

        <div class="userDetail">
            <div>
                <div>
                    <span class="material-symbols-outlined">
                        lock
                    </span>
                </div>
                <div>Password: {{ "\*******" || ""}}
                    <input v-if="editProfile" type="password" name="password" id="password"></input>
                </div>
            </div>
            <div class="buttons">
                <button v-if="!editProfile" @click="toggleEditProfile" class="editButton">Edit</button>
                <button v-if="editProfile" @click="editUserInfo">Save</button>
            </div>
        </div>
    </div>
</template>