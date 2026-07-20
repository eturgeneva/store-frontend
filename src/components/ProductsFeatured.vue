<script setup>
import { computed, ref, onBeforeMount } from 'vue';
import { useProducts } from '@/products';
import ProductCard from './ProductCard.vue';

const { loadProducts, products } = useProducts();
const featuredProducts = computed(() => products.value.slice(0, 8));
const galleryContainer = ref(null);

const showLeftArrow = ref(false);
const showRightArrow = ref(true);

onBeforeMount(async () => {
    await loadProducts();
});

function scrollLeft() {
    if (galleryContainer.value) {
        galleryContainer.value.scrollBy({ left: -300, behavior: 'smooth' });
    }
}

function scrollRight() {
    if (galleryContainer.value) {
        galleryContainer.value.scrollBy({ left: 300, behavior: 'smooth' });
    }
}

function handleScroll() {
    const { scrollLeft, scrollWidth, clientWidth } = galleryContainer.value;
    showLeftArrow.value = scrollLeft > 10;
    showRightArrow.value = scrollLeft < scrollWidth - clientWidth - 10;
}

</script>

<template>
    <div class="productsPreviews">
        <div class="productsPreviewsHeader">
            <h2>Featured Products</h2>
            <p>Discover our most popular toys</p>
        </div>

        <div class="galleryWrapper">

            <!-- Left Arrow -->
            <button v-show="showLeftArrow"
                    class="scrollArrow scrollArrowLeft"
                    @click="scrollLeft">
                <span class="material-symbols-outlined arrowIcon">chevron_left</span>
            </button>

            <!-- Gallery -->
            <div ref="galleryContainer"
                class="galleryContainer"
                @scroll="handleScroll">
                <ProductCard
                    v-for="product in featuredProducts"
                    :key="product.id"
                    :product="product"
                    show-badges
                    show-wishlist
                    show-cart-action
                />
            </div>

            <!-- Right Arrow -->
            <button v-show="showRightArrow"
                    class="scrollArrow scrollArrowRight"
                    @click="scrollRight">
                <span class="material-symbols-outlined arrowIcon">chevron_right</span>
            </button>
        </div>

    </div>
</template>

<style scoped>

</style>
