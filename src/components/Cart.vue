<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

onBeforeMount(async () => {
    store.setCartIsLoading(true);
    console.log('Store cart property:', store.cart.products);
    const cart = await $api.getCart();
    if (cart) {
        store.setCart(cart);
        console.log('Store cart property:', store.cart.products);
    }
    store.setCartIsLoading(false);
});

// async function getCart() {
//     store.setCartIsLoading(true);
//     try {
//         console.log('Store cart property:', store.cart.products);
//         console.log('Fetching cart');

//         const userResponse = await fetch('http://localhost:3000/users/me', {
//             credentials: 'include'
//         });
//         const user = await userResponse.json();
//         const cartId = user.cartId;

//         if (!cartId) {
//             console.warn('No cart ID found for user');
//             store.setCartIsLoading(false);
//             return;
//         }
        
//         const cartResponse = await fetch(`http://localhost:3000/carts/${cartId}`, {
//             credentials: 'include'
//         })
//         if (cartResponse.ok) {
//             const cart = await cartResponse.json();
//             console.log('Cart', cart);
//             store.setCart(cart);
//             console.log('Store cart property:', store.cart.products);
//             store.setCartIsLoading(false);
//         }

//     } catch (err) {
//         console.error(err);
//         store.setCartIsLoading(false);
//     }
// }

</script>

<template>
    <div class="userCart">
        <h3>Cart</h3>
        <div v-if="store.cart.products.length === 0">Your cart is empty</div>
        <div v-else-if="store.cartIsLoading">Cart is loading...</div>
        <div v-else>
            <div v-for="product in store.cart.products" :key="product.product_id">
                <div>{{ product.name }}</div>
            </div>
        </div>
    </div>
</template>