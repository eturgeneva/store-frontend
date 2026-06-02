<script setup>

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    showSummary: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update-quantity', 'set-quantity']);

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

</script>

<template>
    <div v-for="item in props.items"
            :key="item.product_id"
            class="item">
        <img
            :src="productImgURL + item.name + '.png'"
            class="itemImage"
        >
        <div class="itemInfo">
            <div class="itemName">
                <router-link :to="`/products/${item.product_id}`" class="productLink">
                    {{ item.name }}
                </router-link>
            </div>
            <div class="itemBrand">{{ item.brand }}</div>
            <div v-if="item.quantity" class="itemQuantity">Quantity: {{ item.quantity }}</div>
            <div class="itemPrice">Price: {{ item.price_cents }}</div>
        </div>

        <slot :item="item"></slot>
    </div>
    <div v-if="props.showSummary" 
            class="itemSummary">
        <div>Total price: {{ items.reduce((acc, curVal) => acc + curVal.price_cents, 0).toFixed(2) }}</div>
    </div>
</template>
