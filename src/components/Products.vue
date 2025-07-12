<script setup>
import { ref, onBeforeMount } from 'vue';

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

async function createCart() {
    try {
        const response = await fetch('http://localhost:3000/carts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
            credentials: 'include'
        })
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
                    <button @click="createCart" type="button" class="buyButton">🛒</button>
                </div>
            </div>
        </div>
        <div v-if="selectedProduct.name" class="productDetails">
            <div class="product">
                <div>Product Details</div>
                <div>Name: {{ selectedProduct.name }}</div>
                <div>Price: {{ selectedProduct.price_cents / 100 + ' €'}}</div>
                <img :src="productImgURL + selectedProduct.name + '.png'" class="productDetailsImage">
            </div>
        </div>
    </div>
</template>