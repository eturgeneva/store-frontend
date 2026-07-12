<script setup>
import { computed, ref, onBeforeMount, getCurrentInstance} from 'vue';
import { store } from '@/store';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import ProductBadges from './ProductBadges.vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const { addToCart } = useCart();
const { isInWishlist, loadWishlist, toggleWishlist } = useWishlist();
const products = ref([]);
const selectedCategory = ref('All');
const selectedSort = ref('featured');

console.log('Render', store.cartId);

onBeforeMount(async () => {
    try {
        console.log('onBeforeMount store cart ID', store.cartId);

        const fetchedProducts = await $api.getAllProducts();
        if (fetchedProducts) {
            products.value = fetchedProducts;
            await loadWishlist();
            console.log('Products', products.value);
        } else {
            console.log('Failed to fetch products');
        }
    } catch (err) {
        console.error(err);
    }
});

const categories = computed(() => {
    const productCategories = products.value.map(getProductCategory);
    return ['All', ...new Set(productCategories)];
});

const filteredProducts = computed(() => {
    const categoryFiltered = selectedCategory.value === 'All'
        ? [...products.value]
        : products.value.filter(product => getProductCategory(product) === selectedCategory.value);

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

function getProductCategory(product) {
    return product.category || product.type || product.product_type || product.brand || 'All toys';
}

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
                            <img :src="productImgURL + product.name + '.png'"
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
                            <p class="productPreviewType">{{ getProductCategory(product) }}</p>
                            <router-link :to="`/products/${product.id}`" class="productLink">
                                 <h3 class="productName">{{ product.name.charAt(0).toUpperCase() + product.name.slice(1) }}</h3>
                            </router-link>
                        </div>
                        <div class="productPrice">{{ (product.price_cents / 100).toFixed(2) +' €'}}</div>
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
