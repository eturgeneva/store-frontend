<script setup>
import { computed } from 'vue';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { formatPrice } from '@/utils/currency';
import {
    formatProductName,
    getProductCategory,
    getProductId,
    getProductImageUrl,
} from '@/utils/products';
import ProductBadges from './ProductBadges.vue';

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
    showBadges: {
        type: Boolean,
        default: false,
    },
    showWishlist: {
        type: Boolean,
        default: false,
    },
    showCartAction: {
        type: Boolean,
        default: true,
    },
    categoryFallback: {
        type: String,
        default: 'Toy',
    },
});

const { addToCart } = useCart();
const { isInWishlist, toggleWishlist } = useWishlist();

const productId = computed(() => getProductId(props.product));
const productName = computed(() => formatProductName(props.product.name));
</script>

<template>
    <article class="productPreview reveal visible">
        <div class="productPreviewImage">
            <ProductBadges
                v-if="showBadges"
                :product="product"
            />

            <router-link :to="`/products/${productId}`">
                <img
                    :src="getProductImageUrl(product)"
                    :alt="product.name"
                    class="productImage"
                    @error="event => event.target.style.display = 'none'"
                >
            </router-link>

            <div
                v-if="showWishlist"
                class="buttonContainer"
            >
                <button
                    type="button"
                    class="favoriteButton"
                    :aria-label="`${isInWishlist(productId) ? 'Remove' : 'Add'} ${product.name} ${isInWishlist(productId) ? 'from' : 'to'} wishlist`"
                    @click="toggleWishlist(productId)"
                >
                    <span
                        class="material-symbols-outlined"
                        :class="isInWishlist(productId) ? 'filled' : 'outlined'"
                    >
                        favorite
                    </span>
                </button>
            </div>
        </div>

        <div class="productPreviewDetails">
            <div>
                <p class="productPreviewType">
                    {{ getProductCategory(product, categoryFallback) }}
                </p>
                <router-link
                    :to="`/products/${productId}`"
                    class="productLink"
                >
                    <h3 class="productName">{{ productName }}</h3>
                </router-link>
            </div>
            <div class="productPrice">{{ formatPrice(product.price_cents) }}</div>
        </div>

        <div
            v-if="showCartAction"
            class="productPreviewActions"
        >
            <button
                type="button"
                class="buyButton"
                @click="addToCart(productId, 1)"
            >
                <span>Add to cart</span>
                <span class="material-symbols-outlined">shopping_cart</span>
            </button>
        </div>
    </article>
</template>
