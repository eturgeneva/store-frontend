<script setup>

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

</script>

<template>
    <div class="missingPage">
        <h2>Oops! Something went wrong...</h2>
        <img :src="productImgURL + 'frog' + '.png'"
                                :alt="frog" 
                                @error="e => e.target.style.display = 'none'">
    </div>
    
</template>