<script setup>

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

</script>

<template>
    <div class="promoSection">
        <!-- <div class="promoBanner"> -->
            <!-- <div class="bannerOverlay"></div> -->
            <div class="promoMedia">
                <img
                    :src="`${productImgURL}promo-banner-2.png`"
                    alt="Toy collection for promotion"
                />
            </div>

            <div class="promoText">
                <h1 id="promoTitle">
                    Bright toys.
                    <br />
                    Big little moments.
                </h1>
                <p>Discover cheerful picks made for gifting, collecting, and everyday play.</p>
                <a class="promoButton" href="#products">Explore the collection</a>
            </div>
            <p class="promoCaption">Soft toys · Collectibles · Made for joy</p>
        <!-- </div> -->
    </div>
</template>

<style scoped>

</style>