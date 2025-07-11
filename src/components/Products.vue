<script setup>
import { ref, onBeforeMount } from 'vue';

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
        <div v-for="product in products" class="productPreview">
            <div>{{ product.name }}</div>
            <div>{{ product.price_cents }}</div>
            <div>
                <button>❤</button>
                <button>🛒</button>
            </div>
        </div>
    </div>
</template>