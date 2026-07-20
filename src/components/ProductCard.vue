<script setup>
import { computed } from 'vue';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { formatPrice } from '@/utils/currency';
import { getProductCategory, getProductImageUrl } from '@/utils/products';
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

const productName = computed(() => {
    const name = props.product.name?.trim() ?? '';
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
});
</script>

<template>
    <article class="productPreview reveal visible">
        <div class="productPreviewImage">
            <ProductBadges
                v-if="showBadges"
                :product="product"
            />

            <router-link :to="`/products/${product.id}`">
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
                    :aria-label="`${isInWishlist(product.id) ? 'Remove' : 'Add'} ${product.name} ${isInWishlist(product.id) ? 'from' : 'to'} wishlist`"
                    @click="toggleWishlist(product.id)"
                >
                    <span
                        class="material-symbols-outlined"
                        :class="isInWishlist(product.id) ? 'filled' : 'outlined'"
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
                    :to="`/products/${product.id}`"
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
                @click="addToCart(product.id, 1)"
            >
                <span>Add to cart</span>
                <span class="material-symbols-outlined">shopping_cart</span>
            </button>
        </div>
    </article>
</template>
