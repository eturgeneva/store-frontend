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

async function addToCart(productId) {
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
        const cartUpdate = await $api.updateCart(store.cartId, productId);
        if (cartUpdate) {
            store.setCart(cartUpdate);
            console.log('Updated cart', store.cart.products);
            console.log('Updated cart ID', store.cartId);

            // const updatedCart = await $api.getCart(store.cartId);
            // store.setCart(updatedCart);
            // console.log('Newly updated cart', store.cart.products);

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
        <!-- <div class="products"> -->
            <!-- <h1>{{ store.cartId }}</h1> -->
            <div class="productsSection">
                <div v-for="product in products" :key="product.id" class="productPreview">
                    <router-link :to="`/products/${product.id}`">
                        <img :src="productImgURL + product.name + '.png'" 
                        class="productImage">
                    </router-link>
                    <div>{{ product.name }}</div>
                    <div>{{ product.price_cents / 100 + ' €'}}</div>
                    <div class="buttonContainer">
                        <button type="button" class="likeButton">❤</button>
                        <button @click="addToCart(product.id)" type="button" class="buyButton">🛒</button>
                    </div>
                </div>
            </div>
        <!-- </div> -->
    </main>
</template>