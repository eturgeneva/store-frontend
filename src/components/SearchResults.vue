<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProducts } from '@/products';
import ProductCard from './ProductCard.vue';
import PageHero from './PageHero.vue';

const route = useRoute();
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
        <PageHero
            eyebrow="Discover more"
            title="Search results"
            description="From classic favorites to exciting new arrivals, here are the toys that best match your search"
        />
        
        <div class="searchResultsPage">
            <div class="searchResultsHeader">
                <!-- <h2>Search Results</h2> -->
                <p v-if="searchQuery">Results for "{{ searchQuery }}"</p>
                <p v-else>Type a product name in the search bar</p>
            </div>

            <div v-if="isLoading" class="emptyState">Searching...</div>
            <div v-else-if="error" class="emptyState">Unable to load search results</div>
            <div v-else-if="searchQuery && searchResults.length === 0" class="emptyState">
                No products found for "{{ searchQuery }}"
            </div>
            <div v-else class="productsContainer">
                <ProductCard
                    v-for="product in searchResults"
                    :key="product.id"
                    :product="product"
                    show-cart-action
                />
            </div>
        </div>
    </main>
</template>
