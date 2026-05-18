<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '@/store';
import Item from './Item.vue';
import { useCart } from '@/composables/useCart';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const { addToCart } = useCart();
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

async function deleteProductFromWishlist(productId) {
    try {
        const updatedWishlist = await $api.deleteFromWishlist(store.loggedInUser.id, productId);

        if (!updatedWishlist) {
            console.log('Unable to delete product from wishlist');
            return;
        }
        store.loggedInUser.wishlist = updatedWishlist.updatedWishlist;

    } catch (err) {
        console.error(err);
    }
}

</script>

<template>
<div v-if="store.loggedIn" class="wishlistContainer">
    <div v-if="store.loggedInUser.wishlist"
        class="wishlist">
        <Item 
            :items="store.loggedInUser.wishlist">
            <template #default="{ item }">
                <div class="itemButtonContainer">
                    <button
                        type="button"
                        @click="addToCart(item.product_id, 1)"
                    >
                        <span class="material-symbols-outlined">
                                shopping_cart
                        </span>
                    </button>

                    <button
                        type="button"
                        class="removeButton"
                        @click="deleteProductFromWishlist(item.product_id)"
                    >
                        🗑
                    </button>
                </div>
            </template>
        </Item>
    </div>
    <div v-else>
        <p>Your wishlist is empty</p>
        <button>Create a wishlist</button>
    </div>
</div>

</template>

<style scoped>

</style>