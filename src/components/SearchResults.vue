<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCart } from '@/composables/useCart';
import { useProducts } from '@/products';
import { formatPrice } from '@/utils/currency';
import { getProductCategory, getProductImageUrl } from '@/utils/products';

const route = useRoute();
const { addToCart } = useCart();
const {
    error,
    isLoading,
    loadProducts,
    searchProducts,
} = useProducts();

const searchQuery = ref((route.query.q || '').toString());

const searchResults = computed(() => searchProducts(searchQuery.value));

onBeforeMount(async () => {
    await loadProducts();
});

watch(() => route.query.q, (query) => {
    searchQuery.value = (query || '').toString();
});

</script>

<template>
    <main>
        <div class="searchResultsPage">
            <div class="productsPreviewsHeader">
                <h2>Search Results</h2>
                <p v-if="searchQuery">Results for "{{ searchQuery }}"</p>
                <p v-else>Type a product name in the search bar</p>
            </div>

            <div v-if="isLoading" class="emptyState">Searching...</div>
            <div v-else-if="error" class="emptyState">Unable to load search results</div>
            <div v-else-if="searchQuery && searchResults.length === 0" class="emptyState">
                No products found for "{{ searchQuery }}"
            </div>
            <div v-else class="productsContainer">
                <div v-for="product in searchResults"
                    :key="product.id"
                    class="productPreview reveal visible">

                    <div class="productPreviewImage">
                        <router-link :to="`/products/${product.id}`">
                            <img :src="getProductImageUrl(product)"
                                :alt="product.name"
                                class="productImage"
                                @error="e => e.target.style.display = 'none'">
                        </router-link>
                    </div>

                    <div class="productPreviewDetails">
                        <div>
                            <p class="productPreviewType">{{ getProductCategory(product) }}</p>
                            <router-link :to="`/products/${product.id}`" class="productLink">
                                <h3 class="productName">{{ product.name }}</h3>
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
        </div>
    </main>
</template>
