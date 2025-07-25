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
    try {
        // If a new cart needs to be created
        if (!store.cartId) {
            // const newCartRequest = await $api.createCart(productId);
            const newCartRequest = await $api.createCart();
            if (newCartRequest) {
                // store.setCartId(newCartRequest.cartId);
                // console.log('Store cart ID', store.cartId);

                const newCart = await $api.getCart();
                store.setCart(newCart);
                console.log('Newly created cart', store.cart.products);
                console.log('New store cart ID', store.cartId);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

// async function createUpdateCart(productId) {
//     try {
//         if (!store.cartId) {
//             const response = await fetch('http://localhost:3000/carts', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({}),
//                 credentials: 'include'
//             });
    
//             if (response.ok) {
//                 const responseData = await response.json();
//                 store.setCartId(responseData.cartId);
//                 console.log('Store cart ID', store.cartId);
                
//                 // Now fetch the cart:
//                 await getCart();
//                 // Add the product to the newly created cart:
//                 return await createUpdateCart(productId);
//             }
//         } else {
//             const response = await fetch('http://localhost:3000/carts/me', {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ 
//                     productId: productId,
//                     cartId: store.cartId,
//                     quantity: 1
//                 }),
//                 credentials: 'include'
//             })
//             const cartUpdateReponse = await response.json();
//             console.log('cart update', cartUpdateReponse);
//             console.log('Store cart update', store.cart);
//             return store.setCart(cartUpdateReponse);
//         }
//     } catch (err) {
//         console.error(err);
//     }
// }
</script>

<template>
    <!-- <div class="products"> -->
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
                    <button @click="createUpdateCart(product.id)" type="button" class="buyButton">🛒</button>
                </div>
            </div>
        </div>
    <!-- </div> -->
</template>