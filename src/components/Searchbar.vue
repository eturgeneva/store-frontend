<script setup>
import { computed, nextTick, onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProducts } from '@/products';
import { formatPrice } from '@/utils/currency';
import { getProductImageUrl } from '@/utils/products';

defineOptions({
    name: 'ProductSearchbar',
});

const props = defineProps({
    autoFocus: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['close', 'submitted']);

const searchInput = ref('');
const searchInputElement = ref(null);
const isPopoverOpen = ref(false);
const recentSearches = ref([]);
const router = useRouter();
const { loadProducts, products, searchProducts } = useProducts();

const RECENT_SEARCHES_KEY = 'toyz-store-recent-searches';
const MAX_RECENT_SEARCHES = 5;

const previewMatches = computed(() => searchProducts(
    searchInput.value,
    { limit: 5 },
));
const popularProducts = computed(() => products.value.slice(0, 5));
const hasQuery = computed(() => Boolean(searchInput.value.trim()));

onBeforeMount(async () => {
    try {
        const storedSearches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
        recentSearches.value = Array.isArray(storedSearches)
            ? storedSearches.filter(search => typeof search === 'string').slice(0, MAX_RECENT_SEARCHES)
            : [];
    } catch {
        recentSearches.value = [];
    }
    await loadProducts();
});

onMounted(async () => {
    if (props.autoFocus) {
        await nextTick();
        searchInputElement.value?.focus();
    }
});

function rememberSearch(query) {
    recentSearches.value = [
        query,
        ...recentSearches.value.filter(search => search.toLowerCase() !== query.toLowerCase()),
    ].slice(0, MAX_RECENT_SEARCHES);

    try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches.value));
    } catch {
        // Search still works when browser storage is unavailable.
    }
}

function showSearchResults(selectedQuery = searchInput.value) {
    const query = String(selectedQuery).trim();
    if (!query) {
        return;
    }
    rememberSearch(query);
    isPopoverOpen.value = false;
    searchInput.value = '';
    router.push({
        path: '/search',
        query: { q: query },
    });
    emit('submitted');
}

function openPopover() {
    isPopoverOpen.value = true;
}

function closePopover() {
    setTimeout(() => {
        isPopoverOpen.value = false;
    }, 180);
}

function closePopoverImmediately() {
    isPopoverOpen.value = false;
    emit('close');
}

function openProductDetails(productId) {
    if (!productId) {
        return;
    }
    isPopoverOpen.value = false;
    searchInput.value = '';
    router.push(`/products/${productId}`);
    emit('submitted');
}

</script>

<template>
    <div class="searchContainer">
        <form class="searchForm" role="search" @submit.prevent="showSearchResults()">
            <input ref="searchInputElement"
                    v-model="searchInput"
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search..."
                    @focus="openPopover"
                    @input="openPopover"
                    @blur="closePopover"
                    @keydown.esc="closePopoverImmediately"
                    autocomplete="off"
                    aria-label="Search products"
                    :aria-expanded="isPopoverOpen"
                    aria-controls="search-suggestions"
            >
            <button type="submit" aria-label="Submit search">
                <span class="material-symbols-outlined">
                    search
                </span>
            </button>
        </form>
            <div v-if="isPopoverOpen"
                id="search-suggestions"
                class="searchPopover">
                <template v-if="hasQuery">
                    <div class="searchPopoverLabel">Products</div>
                    <div v-if="previewMatches.length === 0" class="searchPopoverEmpty">
                        No matching products
                    </div>
                    <button v-for="product in previewMatches"
                    :key="product.id"
                    type="button"
                    class="searchPreview"
                    @click.prevent.stop="openProductDetails(product.id)">
                    <img :src="getProductImageUrl(product)"
                        :alt="product.name"
                        @error="e => e.target.style.display = 'none'">
                    <div>
                        <div class="searchPreviewName">{{ product.name }}</div>
                        <div class="searchPreviewMeta">
                            <span>{{ product.brand }}</span>
                            <span v-if="product.price_cents">
                                {{ formatPrice(product.price_cents) }}
                            </span>
                        </div>
                    </div>
                </button>
                </template>

                <template v-else>
                    <div v-if="recentSearches.length" class="searchPopoverSection">
                        <div class="searchPopoverLabel">Recent searches</div>
                        <button v-for="search in recentSearches"
                            :key="search"
                            type="button"
                            class="recentSearch"
                            @click="showSearchResults(search)">
                            <span class="material-symbols-outlined">history</span>
                            {{ search }}
                        </button>
                    </div>
                    <div class="searchPopoverSection">
                        <div class="searchPopoverLabel">Popular products</div>
                        <button v-for="product in popularProducts"
                            :key="product.id"
                            type="button"
                            class="searchPreview"
                            @click.prevent.stop="openProductDetails(product.id)">
                            <img :src="getProductImageUrl(product)" :alt="product.name">
                            <div>
                                <div class="searchPreviewName">{{ product.name }}</div>
                                <div class="searchPreviewMeta">
                                    <span>{{ product.brand }}</span>
                                    <span v-if="product.price_cents">{{ formatPrice(product.price_cents) }}</span>
                                </div>
                            </div>
                        </button>
                        <div v-if="popularProducts.length === 0" class="searchPopoverEmpty">
                            Loading suggestions...
                        </div>
                    </div>
                </template>
            </div>
    </div>

</template>
