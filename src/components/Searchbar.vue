<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProducts } from '@/products';
import { formatPrice } from '@/utils/currency';
import { getProductImageUrl } from '@/utils/products';

defineOptions({
    name: 'ProductSearchbar',
});

const searchInput = ref('');
const isPopoverOpen = ref(false);
const router = useRouter();
const { loadProducts, searchProducts } = useProducts();

const previewMatches = computed(() => searchProducts(
    searchInput.value,
    { limit: 5 },
));

onBeforeMount(async () => {
    await loadProducts();
});

function showSearchResults() {
    const query = searchInput.value.trim();
    if (!query) {
        return;
    }
    isPopoverOpen.value = false;
    searchInput.value = '';
    router.push({
        path: '/search',
        query: { q: query },
    });
}

function openPopover() {
    isPopoverOpen.value = true;
}

function closePopover() {
    setTimeout(() => {
        isPopoverOpen.value = false;
    }, 180);
}

function openProductDetails(productId) {
    if (!productId) {
        return;
    }
    isPopoverOpen.value = false;
    searchInput.value = '';
    router.push(`/products/${productId}`);
}

</script>

<template>
    <div class="searchContainer">
            <input v-model="searchInput"
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search..."
                    @keyup.enter="showSearchResults"
                    @focus="openPopover"
                    @input="openPopover"
                    @blur="closePopover"
            >
            <button @click="showSearchResults"
                    type="button">
                <span class="material-symbols-outlined">
                    search
                </span>
            </button>
            <div v-if="isPopoverOpen && searchInput.trim()"
                class="searchPopover">
                <div v-if="previewMatches.length === 0" class="searchPopoverEmpty">
                    No matching products
                </div>
                <button v-for="product in previewMatches"
                    :key="product.id"
                    type="button"
                    class="searchPreview"
                    @mousedown.prevent.stop="openProductDetails(product.id)"
                    @touchstart.prevent.stop="openProductDetails(product.id)"
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
            </div>
    </div>

</template>
