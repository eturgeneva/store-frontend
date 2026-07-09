<script setup>
import { computed, getCurrentInstance, onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCart } from '@/composables/useCart';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const route = useRoute();
const { addToCart } = useCart();

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const products = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const searchQuery = ref((route.query.q || '').toString());

const searchResults = computed(() => {
    const normalizedQuery = searchQuery.value.trim().toLowerCase();

    if (!normalizedQuery) {
        return [];
    }

    return products.value.filter((product) => {
        const name = product.name?.toLowerCase() || '';
        const brand = product.brand?.toLowerCase() || '';

        return name.includes(normalizedQuery) || brand.includes(normalizedQuery);
    });
});

onBeforeMount(async () => {
    await loadProducts();
});

watch(() => route.query.q, (query) => {
    searchQuery.value = (query || '').toString();
});

async function loadProducts() {
    isLoading.value = true;
    errorMessage.value = '';

    try {
        const fetchedProducts = await $api.getAllProducts();
        if (fetchedProducts) {
            products.value = fetchedProducts;
        } else {
            errorMessage.value = 'Unable to load search results';
        }
    } catch (err) {
        console.error(err);
        errorMessage.value = 'Unable to load search results';
    } finally {
        isLoading.value = false;
    }
}

function getProductCategory(product) {
    return product.category || product.type || product.product_type || product.brand || 'Toy';
}
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
            <div v-else-if="errorMessage" class="emptyState">{{ errorMessage }}</div>
            <div v-else-if="searchQuery && searchResults.length === 0" class="emptyState">
                No products found for "{{ searchQuery }}"
            </div>
            <div v-else class="productsContainer">
                <div v-for="product in searchResults"
                    :key="product.id"
                    class="productPreview reveal visible">

                    <div class="productPreviewImage">
                        <router-link :to="`/products/${product.id}`">
                            <img :src="productImgURL + product.name + '.png'"
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
                        <div class="productPrice">{{ (product.price_cents / 100).toFixed(2) + ' €'}}</div>
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
