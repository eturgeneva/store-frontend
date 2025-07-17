<script setup>
import { ref, onBeforeMount } from 'vue';
import { store } from '../store.js';

onBeforeMount(() => {
    getCart();
});

async function getCart() {
    try {
        console.log('Fetching cart');
        const response = await fetch('http://localhost:3000/carts/me', {
            credentials: 'include'
        })
        if (response.ok) {
            const cart = await response.json();
            console.log('Cart', cart);
            store.updateCart(cart);
            console.log('Store cart property:', store.cart);
            return;
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
        <div></div>
    </div>
</template>