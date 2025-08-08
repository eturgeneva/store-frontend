<script setup>

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';
const promoBanner = productImgURL + "promo-banner-2.png"

</script>

<template>
    <div class="promoSection">
        <div class="promoBanner">
            <div class="bannerOverlay"></div>

            <div class="promoText">
                <h2>Buy them all!</h2>
            </div>
        </div>
    </div>
</template>

<style scoped>

.promoBanner {
    position: relative;
}

.bannerOverlay {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.9) 0%, 
        rgba(248, 249, 255, 0.7) 20%,
        rgba(139, 92, 246, 0.1) 100%);
}

</style>