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
        }

    } catch (err) {
        console.error(err);
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
        <div v-if="store.cart.products.length === 0">Loading cart...</div>
        <!-- <div v-for="product in store.cart.products" :key="product.product_id"> -->
        <div v-else>
            <div v-for="product in store.cart.products" :key="product.product_id">
                <div>{{ product.name }}</div>
            </div>
        </div>
    </div>
</template>