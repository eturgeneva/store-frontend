<script setup>
import { ref, onBeforeMount } from 'vue';
import { store } from '@/store';

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const products = ref([]);
const selectedProduct = ref({});
onBeforeMount(() => {
    getAllProducts();
})
// const products = ref(['item1', 'item2']);

async function getAllProducts() {
    try {
        console.log('Fetching products');
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }

        products.value = await response.json();
        console.log('Products', products.value);
        return;
    } catch (err) {
        console.error(err);
    }
}

async function getProductById(productId) {
    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to load the product');
        }

        selectedProduct.value = await response.json();
        console.log('Selected product', selectedProduct.value);
        return;
    } catch (err) {
        console.error(err);
    }
}

async function createUpdateCart(productId) {
    try {
        if (!store.cartId) {
            const response = await fetch('http://localhost:3000/carts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
                credentials: 'include'
            });
    
            if (response.ok) {
                const responseData = await response.json();
                store.setCartId(responseData.cartId);
                console.log('Store cart ID', store.cartId);
    
                // const cartUpdate = await response.json();
                // store.setCart(cartUpdate);
                // console.log('Store cart property', store.cart);
            }
        } else {
            const response = await fetch('http://localhost:3000/carts/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    productId: productId,
                    // cartId: 29
                    cartId: store.cartId
                }),
                credentials: 'include'
            })
            const cartUpdateReponse = await response.json();
            console.log('cart update', cartUpdateReponse);
            // store.setCart(cartUpdateReponse);
            console.log('Store cart update', store.cart);
            return store.setCart(cartUpdateReponse);
        }
    } catch (err) {
        console.error(err);
    }
}
</script>

<template>
    <div class="products">
        <div class="productsSection">
            <div v-for="product in products" :key="product.id" class="productPreview">
                <img :src="productImgURL + product.name + '.png'" 
                class="productImage"
                @click="getProductById(product.id)">
                <div>{{ product.name }}</div>
                <div>{{ product.price_cents / 100 + ' €'}}</div>
                <div>
                    <button type="button" class="likeButton">❤</button>
                    <button @click="createUpdateCart(product.id)" type="button" class="buyButton">🛒</button>
                </div>
            </div>
        </div>
        <div v-if="selectedProduct.name" class="productDetails">
            <div class="product">
                <h3>Product Details</h3>
                <div>Name: {{ selectedProduct.name }}</div>
                <div>Price: {{ selectedProduct.price_cents / 100 + ' €'}}</div>
                <img :src="productImgURL + selectedProduct.name + '.png'" class="productDetailsImage">
            </div>
        </div>
    </div>
</template>