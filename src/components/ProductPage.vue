<script setup>
import { computed, onMounted, getCurrentInstance, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store.js';
import { useCart } from '@/composables/useCart.js';
import { useWishlist } from '@/composables/useWishlist.js';
import productGalleryDetailPlaceholder from '@/assets/product-gallery-placeholder-detail.png';
import productGalleryLifestylePlaceholder from '@/assets/product-gallery-placeholder-lifestyle.png';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

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
            src: productImgURL + store.selectedProduct.name + '.png',
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

async function loadProduct(productId) {
    try {
        const selectedProduct = await $api.getProductById(productId);
        if (selectedProduct) {
            store.setSelectedProduct(selectedProduct);
            console.log('Store selectedProduct property', store.selectedProduct);
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
            <div class="product">
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
                    <div class="productBadgeRow">
                        <span>Best gift pick</span>
                        <span>Age 0+</span>
                    </div>

                    <h2>{{ store.selectedProduct.name }}</h2>
                    <p class="productBuyPanelBrand">{{ store.selectedProduct.brand }}</p>
                    <div class="productBuyPanelPrice">
                        {{ (store.selectedProduct.price_cents / 100).toFixed(2) + ' €'}}
                    </div>

                    <div class="productTrustList">
                        <div>Soft plush material</div>
                        <div>Easy gifting</div>
                        <div>Fast dispatch</div>
                    </div>

                    <label for="quantity" class="formLabel">Quantity</label>
                    <div class="quantityStepper">
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

                    <div class="buttonContainer">
                        <button @click="addToCart(store.selectedProduct.id, quantity)" 
                                type="button" 
                                class="buyButton">
                                Add to cart 
                        </button>
                        <button @click="toggleWishlist(store.selectedProduct.id)"
                                type="button"
                                class="favoriteButton">
                            <span class="material-symbols-outlined"
                                    :class="isInWishlist(store.selectedProduct.id) ? 'filled' : 'outlined'">
                                favorite
                            </span>
                        </button>
                    </div>
                </aside>

                <div class="productDescription">
                    <h3>Product Details</h3>
                    <h4>Description:</h4>
                    <div>Meet {{ store.selectedProduct.name}}, the ultimate cuddle companion! With his velvety-soft fur, gentle smile, and droopy eyelids, {{ store.selectedProduct.name }} is always ready for nap time—whether it's a lazy afternoon snooze or a bedtime snuggle. Hand-stitched details and ultra-plush stuffing make him irresistibly huggable and safe for all ages. Whether you're gifting a little one or adding charm to your own cozy corner, {{ store.selectedProduct.name }} brings warmth, comfort, and a touch of woodland magic wherever he goes.</div>

                    <h4>Size:</h4>
                    <div>12 inches tall</div>
                    <h4>Material:</h4>
                    <div>Hypoallergenic, ultra-soft polyester</div>
                    <h4>Recommended Age:</h4>
                    <div>0+</div>
                    <h4>Care Instructions:</h4>
                    <div>Spot clean or gentle hand wash. Air dry only.</div>

                    <div>Bring {{ store.selectedProduct.name }} home and let the snuggles begin!</div>
                </div>
            </div>
        </div>
</template>

<style scoped>

</style>
