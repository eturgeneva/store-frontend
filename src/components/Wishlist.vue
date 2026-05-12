<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '@/store';
import Item from './Item.vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const wishlist = ref([]);
console.log('wishlist', wishlist)
console.log('wishlist.value', wishlist.value)
console.log('store logged in user wishlist', store.loggedInUser.wishlist)

onBeforeMount(async () => {
    try {
        const wishlist = await $api.getWishlist();
        if (wishlist) {
            store.loggedInUser.wishlist = wishlist;
            console.log('wishlist', store.loggedInUser.wishlist);
        } else {
            console.log('Failed to fetch wishlist');
        }
    } catch (err) {
        console.error(err);
    }
})

console.log('wishlist', wishlist)
console.log('wishlist.value', wishlist.value)
console.log('store logged in user wishlist', store.loggedInUser.wishlist)

</script>

<template>
<div v-if="store.loggedIn" class="wishlistContainer">
    <div v-if="store.loggedInUser.wishlist"
        class="wishlist">
        <Item :items="store.loggedInUser.wishlist"/>
    </div>
    <div v-else>
        <p>Your wishlist is empty</p>
        <button>Create a wishlist</button>
    </div>
</div>

</template>

<style scoped>

</style>