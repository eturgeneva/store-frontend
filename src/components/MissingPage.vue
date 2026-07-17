<script setup>

import { getProductImageUrl } from '@/utils/products';

</script>

<template>
    <div class="missingPage">
        <h2>Oops! Something went wrong...</h2>
        <img :src="getProductImageUrl('frog')"
                                :alt="frog" 
                                @error="e => e.target.style.display = 'none'">
    </div>
    
</template>
