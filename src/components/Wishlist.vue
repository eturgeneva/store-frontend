<script setup>
import { ref, onBeforeMount } from 'vue';
import { store } from '@/store';
import { useApi } from '@/api';
import { formatPrice } from '@/utils/currency';
import { getProductImageUrl } from '@/utils/products';
import Item from './Item.vue';
import { useCart } from '@/composables/useCart';

const $api = useApi();

const { addToCart } = useCart();
const isLoading = ref(true);

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
                    v-for="item in store.loggedInUser.wishlist"
                    :key="item.product_id"
                    :item="item"
                    :title="item.name"
                    :subtitle="item.brand"
                    :image-src="getProductImageUrl(item)"
                    :to="`/products/${item.product_id}`"
                    variant="wishlist"
                >
                    <template #meta>
                        <p>{{ formatPrice(item.price_cents) }}</p>
                    </template>
                    <template #actions>
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
