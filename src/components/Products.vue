<script setup>
import { ref, onBeforeMount } from 'vue';

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const products = ref([]);
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
</script>

<template>
    <div class="productsSection">
        <!-- <li v-for="product in products">
            {{ product }}
        </li> -->
        <div v-for="product in products" :key="product.id" class="productPreview">
            <img :src="productImgURL + product.name + '.png'" class="productImage">
            <div>{{ product.name }}</div>
            <div>{{ product.price_cents }}</div>
            <div>
                <button type="button" class="likeButton">❤</button>
                <button type="button" class="buyButton">🛒</button>
            </div>
        </div>
    </div>
</template>