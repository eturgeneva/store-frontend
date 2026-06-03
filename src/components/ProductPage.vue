<script setup>
import { onMounted, getCurrentInstance, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store.js';
import { useCart } from '@/composables/useCart.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const { addToCart } = useCart();
const route = useRoute();
const quantity = ref(1);

async function loadProduct(productId) {
    try {
        const selectedProduct = await $api.getProductById(productId);
        if (selectedProduct) {
            store.setSelectedProduct(selectedProduct);
            console.log('Store selectedProduct property', store.selectedProduct);
        } else {
            console.log('Failed to fetch the product');
        }
    } catch (err) {
        console.error(err);
    }
}

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

async function loadWishlist() {
    if (!store.loggedIn || Array.isArray(store.loggedInUser.wishlist)) {
        return;
    }

    try {
        const wishlist = await $api.getWishlist();
        if (wishlist) {
            store.loggedInUser.wishlist = wishlist;
        }
    } catch (err) {
        console.error(err);
    }
}

function updateWishlistInStore(wishlistResponse) {
    store.loggedInUser.wishlist = wishlistResponse.updatedWishlist || wishlistResponse;
}

async function toggleWishlist(productId) {
    if (!store.loggedIn || !store.loggedInUser) {
        console.log('Please log in to create a wishlist');
        return;
    }

    try {
        const userId = store.loggedInUser.id;

        if (!store.loggedInUser.wishlistId) {
            const wishlistId = await $api.createWishlist(userId);
            if (wishlistId) {
                store.loggedInUser.wishlistId = wishlistId;
            } else {
                console.log('Failed to create a wishlist');
                return;
            }
        }

        if (isInWishlist(productId)) {
            const updatedWishlist = await $api.deleteFromWishlist(userId, productId);
            if (updatedWishlist) {
                updateWishlistInStore(updatedWishlist);
            }
            return;
        }

        const updatedWishlist = await $api.updateWishList(userId, productId);
        if (updatedWishlist) {
            updateWishlistInStore(updatedWishlist);
        }
    } catch (err) {
        console.error(err);
    }
}

function isInWishlist(productId) {
    if (!Array.isArray(store.loggedInUser.wishlist)) {
        return false;
    }
    return store.loggedInUser.wishlist.some(item => item.product_id === productId);
}

onMounted(async () => {
    await loadProduct(route.params.id);
    await loadProfile();
    await loadWishlist();
});

watch(() => route.params.id, async (productId) => {
    await loadProduct(productId);
    quantity.value = 1;
});

</script>

<template>
    <div v-if="store.selectedProduct" class="productDetails">
            <div class="product">
                <div class="productDetailsMedia">
                    <img :src="productImgURL + store.selectedProduct.name + '.png'" class="productDetailsImage">
                </div>
                <div class="productDescription">
                    <h3>Product Details</h3>
                    <div>Name: {{ store.selectedProduct.name }}</div>
                    <div>Price: {{ store.selectedProduct.price_cents / 100 + ' €'}}</div>
                    <div class="quantity-input">
                        <input  v-model="quantity"
                                type="number" 
                                name="quantity"
                                id="quantity">
                    </div>
                    <div class="buttonContainer">
                        <button @click="addToCart(store.selectedProduct.id, quantity)" 
                                type="button" 
                                class="buyButton">
                                Add to cart 
                        </button>
                        <button @click="toggleWishlist(store.selectedProduct.id)"
                                type="button"
                                class="favoriteButton">
                            <span class="material-symbols-outlined"
                                    :class="isInWishlist(store.selectedProduct.id) ? 'filled' : 'outlined'">
                                favorite
                            </span>
                        </button>
                    </div>

                    <h4>Description:</h4>
                    <div>Meet {{ store.selectedProduct.name}}, the ultimate cuddle companion! With his velvety-soft fur, gentle smile, and droopy eyelids, {{ store.selectedProduct.name }} is always ready for nap time—whether it's a lazy afternoon snooze or a bedtime snuggle. Hand-stitched details and ultra-plush stuffing make him irresistibly huggable and safe for all ages. Whether you're gifting a little one or adding charm to your own cozy corner, {{ store.selectedProduct.name }} brings warmth, comfort, and a touch of woodland magic wherever he goes.</div>

                    <h4>Size:</h4>
                    <div>12 inches tall</div>
                    <h4>Material:</h4>
                    <div>Hypoallergenic, ultra-soft polyester</div>
                    <h4>Recommended Age:</h4>
                    <div>0+</div>
                    <h4>Care Instructions:</h4>
                    <div>Spot clean or gentle hand wash. Air dry only.</div>

                    <div>Bring {{ store.selectedProduct.name }} home and let the snuggles begin!</div>
                </div>
            </div>
        </div>
</template>

<style scoped>

</style>
