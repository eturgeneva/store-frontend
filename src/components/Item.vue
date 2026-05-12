<script setup>

const props = defineProps({ products })

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

</script>

<template>
    <div v-for="product in props.products"
            key="product.product_id"
            class="item">
        <img class="itemImage">
        <div class="itemInfo">
            <div class="itemName"></div>
            <div class="itemBrand"></div>
            <div class="itemQuantity"></div>
            <div class="itemPrice"></div>
        </div>
        <div class="itemSummary">
            <div></div>
        </div>

    </div>
</template>