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

// repeated
async function addToCart(productId, quantity) {
    console.log('Add to cart store cart ID', store.cartId);

    try {
        // If a new cart needs to be created
        if (!store.cartId) {
            const newCartId = await $api.createCart();
            console.log('new cart ID', newCartId);

            if (newCartId) {
                store.setCartId(newCartId);
                const newCart = await $api.getCart(newCartId);
                store.setCart(newCart);
                console.log('Newly created cart', store.cart.products);
                console.log('New store cart ID', store.cartId);
            } else {
                console.log('Failed to create cart');
            }
        }
        // If a cart already exists, but needs to be updated
        const cartUpdate = await $api.updateQuantityInCart(store.cartId, productId, quantity);
        if (cartUpdate) {
            store.setCart(cartUpdate);
            console.log('Updated cart', store.cart.products);
            console.log('Updated cart ID', store.cartId);

        } else {
            console.log('Failed to update cart');
        }
    } catch (err) {
        console.error(err);
    }
}

console.log('wishlist', wishlist)
console.log('wishlist.value', wishlist.value)
console.log('store logged in user wishlist', store.loggedInUser.wishlist)

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
                        @click="setQuantity(item.product_id, 0)"
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