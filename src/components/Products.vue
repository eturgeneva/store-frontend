<script setup>
import { ref, onBeforeMount, getCurrentInstance, nextTick } from 'vue';
import { store } from '@/store';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const products = ref([]);

console.log('Render', store.cartId.value);

// nextTick(async () => {
//     try {
//         // await $api.getCart();
//         console.log('onBeforeMount store cart ID', store.cartId.value);

//         const fetchedProducts = await $api.getAllProducts();
//         if (fetchedProducts) {
//             products.value = fetchedProducts;
//             console.log('Products', products.value);
//         } else {
//             console.log('Failed to fetch products');
//         }
//     } catch (err) {
//         console.error(err);
//     }
// });

onBeforeMount(async () => {
    try {
        // await $api.getCart();
        console.log('onBeforeMount store cart ID', store.cartId.value);

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
    console.log('Add to cart store cart ID', store.cartId.value);
    // await $api.getCart();
    // console.log('store cart ID', store.cartId);
    try {
        // If a new cart needs to be created
        if (!store.cartId.value) {
            const newCartId = await $api.createCart();
            console.log('new cart ID', newCartId);

            if (newCartId) {
                store.setCartId(newCartId);
                const newCart = await $api.getCart(newCartId);
                store.setCart(newCart);
                console.log('Newly created cart', store.cart.value.products);
                console.log('New store cart ID', store.cartId);
                return;
            }
        }
        // If a cart already exists, but needs to be updated
        const cartUpdate = await $api.updateCart(store.cartId.value, productId);
        if (cartUpdate) {
            store.setCart(cartUpdate);
            console.log('Updated cart', store.cart.value.products);
            console.log('Updated cart ID', store.cartId.value);

            const updatedCart = await $api.getCart(store.cartId.value);
            store.setCart(updatedCart);
            console.log('Newly updated cart', store.cart.value.products);

        } else {
            console.log('Failed to update cart');
        }
    } catch (err) {
        console.error(err);
    }
}

</script>

<template>
    <!-- <div class="products"> -->
        <h1>{{ store.cartId }}</h1>
        <div class="productsSection">
            <div v-for="product in products" :key="product.id" class="productPreview">
                <router-link :to="`/products/${product.id}`">
                    <img :src="productImgURL + product.name + '.png'" 
                    class="productImage">
                    <!-- @click="getProductById(product.id)"> -->
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
</template>