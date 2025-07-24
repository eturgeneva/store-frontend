<script setup>

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';
const promoBanner = productImgURL + "promo-banner-2.png"

</script>

<template>
    <div class="promoSection">
        <!-- Promo banner -->
        <img class="promoBanner" :src="promoBanner">
    </div>
</template>