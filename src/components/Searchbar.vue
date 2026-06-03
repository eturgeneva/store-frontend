<script setup>
import { computed, getCurrentInstance, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const searchInput = ref('');
const products = ref([]);
const isPopoverOpen = ref(false);
const router = useRouter();

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const previewMatches = computed(() => {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        return [];
    }

    return products.value.filter((product) => {
        const name = product.name?.toLowerCase() || '';
        const brand = product.brand?.toLowerCase() || '';

        return name.includes(query) || brand.includes(query);
    }).slice(0, 5);
});

onBeforeMount(async () => {
    try {
        const fetchedProducts = await $api.getAllProducts();
        if (fetchedProducts) {
            products.value = fetchedProducts;
        }
    } catch (err) {
        console.error(err);
    }
});

function showSearchResults() {
    const query = searchInput.value.trim();
    if (!query) {
        return;
    }
    isPopoverOpen.value = false;
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
    router.push(`/products/${productId}`);
}

</script>

<template>
    <div class="searchContainer">
        <!-- <div class="search"> -->
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
                    <img :src="productImgURL + product.name + '.png'"
                        :alt="product.name"
                        @error="e => e.target.style.display = 'none'">
                    <div>
                        <div class="searchPreviewName">{{ product.name }}</div>
                        <div class="searchPreviewMeta">
                            <span>{{ product.brand }}</span>
                            <span v-if="product.price_cents">
                                {{ (product.price_cents / 100).toFixed(2) + ' €'}}
                            </span>
                        </div>
                    </div>
                </button>
            </div>
        <!-- </div> -->
    </div>

</template>
