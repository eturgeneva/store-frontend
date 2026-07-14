<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '@/store';
import Item from './Item.vue';
import { useCart } from '@/composables/useCart';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const { addToCart } = useCart();
const isLoading = ref(true);
// const wishlist = ref([]);
// console.log('wishlist', wishlist)
// console.log('wishlist.value', wishlist.value)
// console.log('store logged in user wishlist', store.loggedInUser.wishlist)

onBeforeMount(async () => {
    try {
        await loadProfile();

        if (!store.loggedIn) {
            console.log('Log in to create or see the wishlist');
            return;
        }

        const wishlist = await $api.getWishlist();
        if (wishlist) {
            store.loggedInUser.wishlist = wishlist;
        } else {
            console.log('Failed to fetch wishlist');
        }
    } catch (err) {
        console.error(err);
    } finally {
        isLoading.value = false;
    }
})

console.log('store logged in user wishlist', store.loggedInUser.wishlist);

async function loadProfile() {
    if (store.loggedIn) {
        return;
    }

    try {
        const user = await $api.getUser();
        if (user) {
            store.setLoggedIn(user.id !== null);
            if (user.id !== null) {
                Object.assign(store.loggedInUser, user);
                store.setCartId(user.cartId);
            }
        }
    } catch (err) {
        console.error(err);
        store.setLoggedIn(false);
    }
}

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
    <main>
        <section class="hero">
            <div class="heroInner">
                <p class="eyebrow">Saved for later</p>
                <h1>Your wishlist</h1>
                <p>Add your favorites to your wishlist and shop them whenever you're ready</p>
            </div>
        </section>

        <div class="wishlistContainer">
            <div v-if="isLoading" class="emptyState">
                <p>Wishlist is loading...</p>
            </div>
            <div v-else-if="!store.loggedIn" class="emptyState">
                <p>Log in to see or create a wishlist</p>
            </div>
            <div v-else-if="store.loggedInUser.wishlist?.length"
                class="wishlist">
                <Item 
                    :items="store.loggedInUser.wishlist">
                    <template #default="{ item }">
                        <div class="itemActions">
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
                                x
                            </button>
                        </div>
                    </template>
                </Item>
            </div>
            <div v-else class="emptyState">
                <p>Your wishlist is empty</p>
            </div>
        </div>
    </main>
</template>

<style scoped>

</style>
