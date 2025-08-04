<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '@/store';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const products = ref([]);

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
            <button class="scrollArrow scrollArrowLeft">
                <span class="arrowIcon"><</span>
            </button>

            <!-- Gallery -->
            <div class="galleryContainer">
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
                            <button @click="addToCart(product.id, 1)"
                                    type="button"
                                    class="buyButton">
                                <span class="material-symbols-outlined">
                                    shopping_cart
                                </span>
                            </button>
                        </div>
                    </div>

                    <div class="featuredProductDetails">
                        <router-link :to="`/products/${product.id}`">
                            <h3>{{ product.name }}</h3>
                        </router-link>
                        <div class="productPrice">{{ (product.price_cents / 100).toFixed(2) }}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>

.productsPreviews {
    padding: 3rem 0;
    margin: 2rem 0;
    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
}

.productsPreviewsHeader {
    text-align: center;
    margin-bottom: 2.5rem;
    /* padding: 0 2rem; */
}

.productsPreviewsHeader h2 {
    font-size: 2.2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
}

.productsPreviewsHeader p {
    font-size: 1.1rem;
    color: #6b7280;
    font-weight: 400;
}

/* Gallery */
.galleryWrapper {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.galleryContainer {
    display: flex;
    gap: 1.5rem;

    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 1rem 0 2rem 0;
    /* Firefox */
    scrollbar-width: none;
    
    /* IE and Edge */
    -ms-overflow-style: none;
}

.galleryContainer::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}

.featuredProductPreview {
    flex: 0 0 240px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
}

.featuredProductPreview:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.featuredProductImage {
    position: relative;
    overflow: hidden;
    /* height: 200px; */
    height: 15rem;
    background: #f9fafb;
}

.featuredProductImage a {
    padding: 0;
}

.productImage {
    width: 100%;
    height: 100%;
    /* object-fit: contain; */
    object-fit: cover;
    /* object-position: center top; */
    object-position: center 30%;
    /* object-position: center center; */
    transition: transform 0.3s ease;
    border-radius: 10px;
    display: block;
}

.featuredProductImage:hover .productImage {
    transform: scale(1.05);
}

/* Scroll Arrows */
.scrollArrow {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    transform: translateY(-50%);
    width: 3rem;
    height: 4rem;
    /* border-radius: 50%; */
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 2;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    margin: 0;
    background: white;
}

.scrollArrow:hover {
    background: #ffffff;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-50%) scale(1.05);
}

.scrollArrowLeft {
    left: 0.5rem;
}

.arrowIcon {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
}

</style>