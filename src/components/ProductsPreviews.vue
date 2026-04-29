<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '@/store';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const products = ref([]);
const galleryContainer = ref(null);

const showLeftArrow = ref(false);
const showRightArrow = ref(true);

onBeforeMount(async () => {
    try {
        const fetchedProducts = await $api.getAllProducts();
        if (fetchedProducts) {
            // products.value = fetchedProducts;
            // Display first 8 products
            products.value = fetchedProducts.slice(0, 8);
            console.log('Products Previews', products.value);
        } else {
            console.log('Failed to fetch products');
        }
    } catch (err) {
        console.error(err);
    }
});

function scrollLeft() {
    if (galleryContainer.value) {
        galleryContainer.value.scrollBy({ left: -300, behavior: 'smooth' });
    }
}

function scrollRight() {
    if (galleryContainer.value) {
        galleryContainer.value.scrollBy({ left: 300, behavior: 'smooth' });
    }
}

function handleScroll() {
    const { scrollLeft, scrollWidth, clientWidth } = galleryContainer.value;
    showLeftArrow.value = scrollLeft > 10;
    showRightArrow.value = scrollLeft < scrollWidth - clientWidth - 10;
}

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

</script>

<template>
    <div class="productsPreviews">
        <div class="productsPreviewsHeader">
            <h2>Featured Products</h2>
            <p>Discover our most popular toys</p>
        </div>

        <div class="galleryWrapper">

            <!-- Left Arrow -->
            <button v-show="showLeftArrow"
                    class="scrollArrow scrollArrowLeft"
                    @click="scrollLeft">
                <span class="arrowIcon">〈</span>
            </button>

            <!-- Gallery -->
            <div ref="galleryContainer"
                class="galleryContainer"
                @scroll="handleScroll">
                <div v-for="product in products"
                    :key="product.id"
                    class="featuredProductPreview">

                    <div class="featuredProductImage">
                        <router-link :to="`/products/${product.id}`">
                            <img :src="productImgURL + product.name + '.png'"
                                :alt="product.name" 
                                class="productImage">
                        </router-link>
    
                        <div class="buttonContainer">
                            <button 
                                    type="button"
                                    class="favoriteButton">
                                <span class="material-symbols-outlined">
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
                            <div class="productPrice">{{ (product.price_cents / 100).toFixed(2) }}</div>
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

            <!-- Right Arrow -->
            <button v-show="showRightArrow"
                    class="scrollArrow scrollArrowRight"
                    @click="scrollRight">
                <span class="arrowIcon">〉</span>
            </button>
        </div>

    </div>
</template>

<style scoped>

</style>