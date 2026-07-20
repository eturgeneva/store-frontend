<script setup>
import { computed, ref, onBeforeMount } from 'vue';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { useProducts } from '@/products';
import { formatPrice } from '@/utils/currency';
import { getProductCategory, getProductImageUrl } from '@/utils/products';
import ProductBadges from './ProductBadges.vue';

const { addToCart } = useCart();
const { isInWishlist, toggleWishlist } = useWishlist();
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
                <div v-for="product in featuredProducts"
                    :key="product.id"
                    class="productPreview reveal visible">

                    <div class="productPreviewImage">
                        <ProductBadges :product="product" />
                        <router-link :to="`/products/${product.id}`">
                            <img :src="getProductImageUrl(product)"
                                :alt="product.name" 
                                class="productImage">
                        </router-link>
    
                        <div class="buttonContainer">
                            <button @click="toggleWishlist(product.id)"
                                    type="button"
                                    class="favoriteButton">
                                <span class="material-symbols-outlined"
                                        :class="isInWishlist(product.id) ? 'filled' : 'outlined'">
                                    favorite
                                </span>
                            </button>
                        </div>
                    </div>

                    <div class="productPreviewDetails">
                        <div>
                            <p class="productPreviewType">{{ getProductCategory(product) }}</p>
                            <router-link :to="`/products/${product.id}`" class="productLink">
                                <h3 class="productName">{{ product.name.charAt(0).toUpperCase() + product.name.slice(1) }}</h3>
                            </router-link>
                        </div>
                        <div class="productPrice">{{ formatPrice(product.price_cents) }}</div>
                    </div>

                    <div class="productPreviewActions">
                        <button @click="addToCart(product.id, 1)"
                            type="button"
                            class="buyButton">
                            <span>Add to cart</span>
                            <span class="material-symbols-outlined">shopping_cart</span>
                        </button>
                    </div>
                </div>
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
