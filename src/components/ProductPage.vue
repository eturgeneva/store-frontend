<script setup>

const props = defineProps(['productId']);

</script>

<template>
    <div v-if="selectedProduct.name" class="productDetails">
            <div class="product">
                <h3>Product Details</h3>
                <div>Name: {{ selectedProduct.name }}</div>
                <div>Price: {{ selectedProduct.price_cents / 100 + ' €'}}</div>
                <img :src="productImgURL + selectedProduct.name + '.png'" class="productDetailsImage">
            </div>
        </div>
</template>