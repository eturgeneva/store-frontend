<script setup>
import { useWishlist } from '@/composables/useWishlist';
import { useSession } from '@/session';
import { formatPrice } from '@/utils/currency';
import { getProductImageUrl } from '@/utils/products';
import Item from './Item.vue';
import { useCart } from '@/composables/useCart';
import PageHero from './PageHero.vue';

defineOptions({
    name: 'UserWishlist',
});

const { isAuthenticated } = useSession();
const { addToCart } = useCart();
const { isLoading, removeFromWishlist, wishlist } = useWishlist();

</script>

<template>
    <main>
        <PageHero
            eyebrow="Saved for later"
            title="Your wishlist"
            description="Add your favorites to your wishlist and shop them whenever you're ready"
        />

        <div class="wishlistContainer">
            <div v-if="isLoading" class="emptyState">
                <p>Wishlist is loading...</p>
            </div>
            <div v-else-if="!isAuthenticated" class="emptyState">
                <p>Log in to see or create a wishlist</p>
            </div>
            <div v-else-if="wishlist.length"
                class="wishlist">
                <Item
                    v-for="item in wishlist"
                    :key="item.product_id"
                    :item="item"
                    :title="item.name"
                    :subtitle="item.brand"
                    :image-src="getProductImageUrl(item)"
                    :to="`/products/${item.product_id}`"
                    variant="wishlist"
                >
                    <template #meta>
                        <p>{{ formatPrice(item.price_cents) }}</p>
                    </template>
                    <template #actions>
                            <button
                                type="button"
                                @click="addToCart(item.product_id, 1)"
                            >
                                <span class="material-symbols-outlined">
                                        shopping_cart
                                </span>
                            </button>

                            <button
                                type="button"
                                class="removeButton"
                                @click="removeFromWishlist(item.product_id)"
                            >
                                x
                            </button>
                    </template>
                </Item>
            </div>
            <div v-else class="emptyState">
                <p>Your wishlist is empty</p>
            </div>
        </div>
    </main>
</template>

<style scoped>

</style>
