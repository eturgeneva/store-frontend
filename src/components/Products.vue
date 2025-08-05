<script setup>
import { ref, onBeforeMount, getCurrentInstance} from 'vue';
import { store } from '@/store';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const products = ref([]);

console.log('Render', store.cartId);

onBeforeMount(async () => {
    try {
        // await $api.getCart(store.cartId);
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
        </div>

            <!-- <div class="productsSection">
                <div v-for="product in products" :key="product.id" class="productPreview">
                    <router-link :to="`/products/${product.id}`">
                        <img :src="productImgURL + product.name + '.png'" 
                        class="productImage">
                    </router-link>
                    <div>{{ product.name }}</div>
                    <div>{{ product.price_cents / 100 + ' €'}}</div>
                    <div class="buttonContainer">
                        <button type="button" class="likeButton">❤</button>
                        <button @click="addToCart(product.id, 1)" 
                                type="button" 
                                class="buyButton">
                            <span class="material-symbols-outlined">
                                shopping_cart
                            </span>
                        </button>
                    </div>
                </div>
            </div> -->
    </main>
</template>

<style scoped>

.productsContainer {
    display: flex;
    gap: 1.5rem;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
}

/* Same as products previews, but without gallery and arrows */
.productsPreviews {
    padding: 3rem 0;
    margin: 2rem 0;
    background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
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
    /* height: 15rem; */
    height: 18rem;
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

.featuredProductDetails {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    /* margin-left: 1rem; */
    /* margin-bottom: 1rem; */
    margin: 0 1rem 1rem 1rem;
}

/* Buttons */
.buttonContainer {
    position: absolute;
    top: 0.3rem;
    right: 0.4rem;
}

.buyButton {
    height: 2.5rem;
    width: 3rem;
    margin: 0;
    padding: 0;
    border-radius: 8px;
}

.favoriteButton {
    height: 2.5rem;
    width: 3rem;
    margin-right: 0.1rem;
    background: transparent;
    /* border: 2px #ffffff solid; */
    color: #ffffff;
    /* border-radius: 8px; */
    display: flex;
    justify-content: center;
    align-items: center;
}

.favoriteButton span {
    font-size: 2.3rem;
}

</style>