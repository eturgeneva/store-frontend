<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@/api';
import { formatPrice } from '@/utils/currency';
import { getProductImageUrl } from '@/utils/products';
import { store } from '../store.js';
import { useCart } from '@/composables/useCart.js';
import { useWishlist } from '@/composables/useWishlist.js';
import productGalleryDetailPlaceholder from '@/assets/product-gallery-placeholder-detail.png';
import productGalleryLifestylePlaceholder from '@/assets/product-gallery-placeholder-lifestyle.png';

const $api = useApi();

const { addToCart } = useCart();
const { isInWishlist, loadWishlist, toggleWishlist } = useWishlist();
const route = useRoute();
const quantity = ref(1);
const selectedImageIndex = ref(0);

const productImages = computed(() => {
    if (!store.selectedProduct?.name) {
        return [];
    }

    return [
        {
            src: getProductImageUrl(store.selectedProduct),
            alt: store.selectedProduct.name,
        },
        {
            src: productGalleryDetailPlaceholder,
            alt: `${store.selectedProduct.name} detail placeholder`,
        },
        {
            src: productGalleryLifestylePlaceholder,
            alt: `${store.selectedProduct.name} lifestyle placeholder`,
        },
    ];
});

const formattedProductName = computed(() => {
    const name = store.selectedProduct?.name?.trim();

    if (!name) {
        return '';
    }

    return name.charAt(0).toUpperCase() + name.slice(1);
});

async function loadProduct(productId) {
    try {
        const selectedProduct = await $api.getProductById(productId);
        if (selectedProduct) {
            store.setSelectedProduct(selectedProduct);
        } else {
            console.log('Failed to fetch the product');
        }
    } catch (err) {
        console.error(err);
    }
}

onMounted(async () => {
    await loadProduct(route.params.id);
    await loadWishlist();
});

watch(() => route.params.id, async (productId) => {
    await loadProduct(productId);
    quantity.value = 1;
    selectedImageIndex.value = 0;
});

</script>

<template>
    <div v-if="store.selectedProduct" class="productDetails">
        <section class="product">
            <div class="productGallery">
                <div class="productDetailsMedia">
                    <img
                        v-if="productImages[selectedImageIndex]"
                        :src="productImages[selectedImageIndex].src"
                        :alt="productImages[selectedImageIndex].alt"
                        class="productDetailsImage"
                    >
                </div>

                <div class="productThumbnails">
                    <button
                        v-for="(image, index) in productImages"
                        :key="image.src"
                        type="button"
                        :class="['productThumbnail', { active: selectedImageIndex === index }]"
                        @click="selectedImageIndex = index"
                    >
                        <img
                            :src="image.src"
                            :alt="image.alt"
                        >
                    </button>
                </div>
            </div>

            <aside class="productBuyPanel">
                <p class="productEyebrow">{{ store.selectedProduct.brand }} - Age 0+</p>

                <div class="productInfoTitle">
                    <h1>{{ formattedProductName }}</h1>
                    <p>{{ formatPrice(store.selectedProduct.price_cents) }}</p>
                </div>

                <p class="productInfoLead">
                    Meet {{ store.selectedProduct.name}}, the ultimate cuddle companion! With velvety-soft fur, hand-stitched details, and ultra-plush stuffing, {{ store.selectedProduct.name }} is ready for cozy naps, bedtime snuggles, and thoughtful gifting.
                </p>

                <div class="toyTags">
                    <span>Soft plush material</span>
                    <span>Easy gifting</span>
                    <span>Fast dispatch</span>
                </div>
                <div class="productActions">
                    <div class="purchaseRow">
                        <div class="quantityStepper" aria-label="Quantity">
                            <button
                                type="button"
                                @click="quantity = Math.max(1, Number(quantity) - 1)"
                            >
                                -
                            </button>
                            <input  v-model="quantity"
                                    type="number"
                                    min="1"
                                    name="quantity"
                                    id="quantity">
                            <button
                                type="button"
                                @click="quantity = Number(quantity) + 1"
                            >
                                +
                            </button>
                        </div>

                        <button @click="addToCart(store.selectedProduct.id, quantity)"
                                type="button"
                                class="buyButton">
                                Add to cart
                        </button>
                    </div>

                    <button @click="toggleWishlist(store.selectedProduct.id)"
                            type="button"
                            class="favoriteButton saveButton">
                        <span class="material-symbols-outlined"
                                :class="isInWishlist(store.selectedProduct.id) ? 'filled' : 'outlined'">
                            favorite
                        </span>
                        Save to wishlist
                    </button>
                </div>

                <p class="deliveryNote">
                    <span aria-hidden="true"></span> In stock - Fast dispatch
                </p>

                <div class="productAccordions">
                    <details open>
                        <summary>Description <span>+</span></summary>
                        <div>Meet {{ store.selectedProduct.name}}, the ultimate cuddle companion! With his velvety-soft fur, gentle smile, and droopy eyelids, {{ store.selectedProduct.name }} is always ready for nap time, whether it's a lazy afternoon snooze or a bedtime snuggle. Hand-stitched details and ultra-plush stuffing make him irresistibly huggable and safe for all ages. Whether you're gifting a little one or adding charm to your own cozy corner, {{ store.selectedProduct.name }} brings warmth, comfort, and a touch of woodland magic wherever he goes.</div>
                    </details>
                    <details>
                        <summary>Size <span>+</span></summary>
                        <div>12 inches tall</div>
                    </details>
                    <details>
                        <summary>Material <span>+</span></summary>
                        <div>Hypoallergenic, ultra-soft polyester</div>
                    </details>
                    <details>
                        <summary>Recommended Age <span>+</span></summary>
                        <div>0+</div>
                    </details>
                    <details>
                        <summary>Care Instructions <span>+</span></summary>
                        <div>Spot clean or gentle hand wash. Air dry only.</div>
                    </details>
                </div>
            </aside>
        </section>
    </div>
</template>

<style scoped>

</style>
