<script setup>

const props = defineProps({
    products: {
        type: Array,
        required: true,
    },
});

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

</script>

<template>
    <div v-for="product in props.products"
            :key="product.product_id"
            class="item">
        <img
            :src="productImgURL + product.name + '.png'"
            class="itemImage"
        >
        <div class="itemInfo">
            <div class="itemName">{{ product.name }}</div>
            <div class="itemBrand">{{ product.brand }}</div>
            <div class="itemQuantity">Quantity: {{ product.quantity }}</div>
            <div class="itemPrice">Price: {{ product.price_cents }}</div>
        </div>
        <div class="itemSummary">
            <div>{{ (product.price_cents * product.quantity).toFixed(2) }}</div>
        </div>

    </div>
</template>
