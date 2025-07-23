<script setup>
import { ref, onBeforeMount, onMounted, onUpdated, nextTick } from 'vue';
import { store } from '../store.js';

onBeforeMount(async () => {
    await getCart();
});

// onMounted(async () => {
//     await getCart();
// });

async function getCart() {
    store.setCartIsLoading(true);
    try {
        console.log('Store cart property:', store.cart.products);
        console.log('Fetching cart');

        const userResponse = await fetch('http://localhost:3000/users/me', {
            credentials: 'include'
        });
        const user = await userResponse.json();
        const cartId = user.cartId;

        if (!cartId) {
            console.warn('No cart ID found for user');
            store.setCartIsLoading(false);
            return;
        }
        
        const cartResponse = await fetch(`http://localhost:3000/carts/${cartId}`, {
            credentials: 'include'
        })
        if (cartResponse.ok) {
            const cart = await cartResponse.json();
            console.log('Cart', cart);
            store.setCart(cart);
            console.log('Store cart property:', store.cart.products);
            store.setCartIsLoading(false);
        }

    } catch (err) {
        console.error(err);
        store.setCartIsLoading(false);
    }
}

// const cart = ref({});

// async function getCart() {
//     try {
//         console.log('Fetching cart');
//         const response = await fetch('http://localhost:3000/carts/me', {
//             credentials: 'include'
//         })
//         if (response.ok) {
//             cart.value = await response.json();
//             console.log('Cart', cart);
//             return;
//         }
//     } catch (err) {
//         console.error(err);
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