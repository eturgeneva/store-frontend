<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store.js';

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const route = useRoute();
const productId = route.params.id;

onMounted(() => {
    getProductById(productId);
})

async function getProductById(productId) {
    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to load the product');
        }

        const productResponse = await response.json();
        store.setSelectedProduct(productResponse);
        console.log('Selected product', store.selectedProduct);
    } catch (err) {
        console.error(err);
    }
}

</script>

<template>
    <div v-if="store.selectedProduct" class="productDetails">
            <div class="product">
                <h3>Product Details</h3>
                <div>Name: {{ store.selectedProduct.name }}</div>
                <div>Price: {{ store.selectedProduct.price_cents / 100 + ' €'}}</div>
                <img :src="productImgURL + store.selectedProduct.name + '.png'" class="productDetailsImage">
            </div>
        </div>
</template>

<!-- <template>
    <div v-if="selectedProduct.name" class="productDetails">
            <div class="product">
                <h3>Product Details</h3>
                <div>Name: {{ selectedProduct.name }}</div>
                <div>Price: {{ selectedProduct.price_cents / 100 + ' €'}}</div>
                <img :src="productImgURL + selectedProduct.name + '.png'" class="productDetailsImage">
            </div>
        </div>
</template> -->