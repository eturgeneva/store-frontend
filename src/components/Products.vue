<script setup>
import { ref, onBeforeMount, getCurrentInstance} from 'vue';
import { store } from '@/store';
import { useCart } from '@/composables/useCart';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const { addToCart } = useCart();
const products = ref([]);

console.log('Render', store.cartId);

onBeforeMount(async () => {
    try {
        console.log('onBeforeMount store cart ID', store.cartId);

        const fetchedProducts = await $api.getAllProducts();
        if (fetchedProducts) {
            products.value = fetchedProducts;
            console.log('Products', products.value);
        } else {
            console.log('Failed to fetch products');
        }
    } catch (err) {
        console.error(err);
    }
});

async function addToWishlist(productId) {
    if (!store.loggedIn || !store.loggedInUser) {
        console.log('Please log in to create a wishlist');
        return;
    }

    try {
        const userId = store.loggedInUser.id;
        console.log('store.loggedInUser.wishlistId', store.loggedInUser.wishlistId)

        if (!store.loggedInUser.wishlistId) {
            const wishlistId = await $api.createWishlist(userId);
            if (wishlistId) {
                console.log('wishlistId response', wishlistId)
                store.loggedInUser.wishlistId = wishlistId;
                console.log('wishlist id from Products', store.loggedInUser.wishlistId);
            } else {
                console.log('Failed to create a wishlist');
            }
        }

        const wishlistUpdate = await $api.updateWishList(userId, productId);
        if (wishlistUpdate) {
            console.log('updated wishlist', wishlistUpdate)
            store.loggedInUser.wishlist = wishlistUpdate;
        }


    } catch (err) {
        console.error(err);
    }
}

function isInWishlist(productId) {
    if (!Array.isArray(store.loggedInUser.wishlist)) {
        return false;
    }
    return store.loggedInUser.wishlist.some(item => item.product_id === productId)
}

</script>

<template>
    <main>
        <div class="productsPreviews">
            <div class="productsContainer">
                <div v-for="product in products"
                    :key="product.id"
                    class="featuredProductPreview">
    
                    <div class="featuredProductImage">
                        <router-link :to="`/products/${product.id}`">
                            <img :src="productImgURL + product.name + '.png'"
                                :alt="product.name" 
                                class="productImage"
                                @error="e => e.target.style.display = 'none'">
                        </router-link>
    
                        <div class="buttonContainer">
                            <button @click="addToWishlist(product.id)"
                                    type="button"
                                    class="favoriteButton">
                                <span class="material-symbols-outlined"
                                        :class="isInWishlist(product.id) ? 'filled' : 'outlined'">
                                    favorite
                                </span>
                            </button>
                        </div>
                    </div>
    
                    <div class="featuredProductDetails">
                        <div>
                            <router-link :to="`/products/${product.id}`" class="productLink">
                                <h3 class="productName">{{ product.name }}</h3>
                            </router-link>
                            <div class="productPrice">{{ (product.price_cents / 100).toFixed(2) +' €'}}</div>
                        </div>
    
                        <button @click="addToCart(product.id, 1)"
                                type="button"
                                class="buyButton">
                            <span class="material-symbols-outlined">
                                shopping_cart
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>

</style>