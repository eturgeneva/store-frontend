<script setup>
import { ref, onBeforeMount, getCurrentInstance} from 'vue';
import { store } from '@/store';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const { addToCart } = useCart();
const { isInWishlist, loadWishlist, toggleWishlist } = useWishlist();
const products = ref([]);

console.log('Render', store.cartId);

onBeforeMount(async () => {
    try {
        console.log('onBeforeMount store cart ID', store.cartId);

        const fetchedProducts = await $api.getAllProducts();
        if (fetchedProducts) {
            products.value = fetchedProducts;
            await loadWishlist();
            console.log('Products', products.value);
        } else {
            console.log('Failed to fetch products');
        }
    } catch (err) {
        console.error(err);
    }
});

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
                            <button @click="toggleWishlist(product.id)"
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
