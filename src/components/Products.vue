<script setup>
import { computed, ref, onBeforeMount } from 'vue';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { useProducts } from '@/products';
import { formatPrice } from '@/utils/currency';
import { getProductCategory, getProductImageUrl } from '@/utils/products';
import ProductBadges from './ProductBadges.vue';

defineOptions({
    name: 'CatalogueProducts',
});

const { addToCart } = useCart();
const { isInWishlist, toggleWishlist } = useWishlist();
const { loadProducts, products } = useProducts();
const selectedCategory = ref('All');
const selectedSort = ref('featured');

onBeforeMount(async () => {
    await loadProducts();
});

const categories = computed(() => {
    const productCategories = products.value.map(product => getProductCategory(product, 'All toys'));
    return ['All', ...new Set(productCategories)];
});

const filteredProducts = computed(() => {
    const categoryFiltered = selectedCategory.value === 'All'
        ? [...products.value]
        : products.value.filter(product => getProductCategory(product, 'All toys') === selectedCategory.value);

    return categoryFiltered.sort((a, b) => {
        if (selectedSort.value === 'price-low') {
            return a.price_cents - b.price_cents;
        }

        if (selectedSort.value === 'price-high') {
            return b.price_cents - a.price_cents;
        }

        if (selectedSort.value === 'name') {
            return a.name.localeCompare(b.name);
        }

        return 0;
    });
});

</script>

<template>
    <main>
        <section class="hero">
            <div class="heroInner">
                <p class="eyebrow">Browse and discover</p>
                <h1>Products</h1>
                <p>Find the right toy by category, price or name</p>
            </div>
        </section>
        
        <section class="productsPreviews">
            <div class="productFilters">
                <div class="filterGroup">
                    <span class="filterLabel">Category</span>
                    <div class="categoryFilters">
                        <button
                            v-for="category in categories"
                            :key="category"
                            type="button"
                            :class="['filterChip', { active: selectedCategory === category }]"
                            @click="selectedCategory = category"
                        >
                            {{ category }}
                        </button>
                    </div>
                </div>

                <label class="sortControl">
                    <span class="filterLabel">Sort</span>
                    <select v-model="selectedSort">
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: low to high</option>
                        <option value="price-high">Price: high to low</option>
                        <option value="name">Name</option>
                    </select>
                </label>
            </div>

            <div class="productsContainer">
                <div v-for="product in filteredProducts"
                    :key="product.id"
                    class="productPreview reveal visible">
    
                    <div class="productPreviewImage">
                        <ProductBadges :product="product" />
                        <router-link :to="`/products/${product.id}`">
                            <img :src="getProductImageUrl(product)"
                                :alt="product.name" 
                                class="productImage"
                                @error="e => e.target.style.display = 'none'">
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
                            <p class="productPreviewType">{{ getProductCategory(product, 'All toys') }}</p>
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
        </section>
    </main>
</template>

<style scoped>

</style>
