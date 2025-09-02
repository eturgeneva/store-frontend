<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '@/store';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const wishlist = ref([]);

onBeforeMount(async () => {
    try {
        const wishlist = await $api.getWishlist();
        if (wishlist) {
            wishlist.value = wishlist;
            console.log('wishlist', wishlist.value);
        } else {
            console.log('Failed to fetch wishlist');
        }
    } catch (err) {
        console.error(err);
    }
})

</script>

<template>

<div class="wishlistContainer">
    <div v-for="item in wishlist"
        :key="item.id"
        class="wishlistItem">
        {{ item.product_id }}
    </div>

</div>

</template>