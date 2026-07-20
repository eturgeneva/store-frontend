<script setup>
import { computed, ref, onBeforeMount } from 'vue';
import { useProducts } from '@/products';
import { getProductCategory } from '@/utils/products';
import ProductCard from './ProductCard.vue';
import PageHero from './PageHero.vue';

defineOptions({
    name: 'CatalogueProducts',
});

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
        <PageHero
            eyebrow="Browse and discover"
            title="Products"
            description="Find the right toy by category, price or name"
        />
        
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
                <ProductCard
                    v-for="product in filteredProducts"
                    :key="product.id"
                    :product="product"
                    show-badges
                    show-wishlist
                    show-cart-action
                    category-fallback="All toys"
                />
            </div>
        </section>
    </main>
</template>

<style scoped>

</style>
