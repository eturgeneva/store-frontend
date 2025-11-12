<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '@/store';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const wishlist = ref([]);
console.log('wishlist', wishlist)
console.log('wishlist.value', wishlist.value)
console.log('store logged in user wishlist', store.loggedInUser.wishlist)

// onBeforeMount(async () => {
//     try {
//         const wishlist = await $api.getWishlist();
//         if (wishlist) {
//             wishlist.value = wishlist;
//             console.log('wishlist', wishlist.value);
//         } else {
//             console.log('Failed to fetch wishlist');
//         }
//     } catch (err) {
//         console.error(err);
//     }
// })
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

</script>

<template>
<!-- <div v-if="wishlist.length > 0" class="wishlistContainer"> -->
<div v-if="store.loggedIn" class="wishlistContainer">
    <!-- <div v-if="wishlist.length > 0"> -->
    <div v-if="store.loggedInUser.wishlist">
        <div v-for="item in store.loggedInUser.wishlist"
            :key="item.id"
            class="wishlistItem">
            {{ item.product_id }}
        </div>
    </div>
    <div v-else>
        <p>Your wishlist is empty</p>
        <button>Create a wishlist</button>
    </div>
</div>

</template>

<style scoped>

.wishlistContainer {
    margin: 5rem 0;
}

</style>