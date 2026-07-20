import { computed } from 'vue';
import { store } from '../store.js';
import { useApi } from '../api.js';
import { useSession } from '../session.js';
import { normalizeWishlist, normalizeWishlistItem } from '../utils/wishlist.js';

export function useWishlist() {
    const $api = useApi();
    const { initializeSession } = useSession();

    const wishlist = computed(() => (
        Array.isArray(store.loggedInUser.wishlist)
            ? store.loggedInUser.wishlist
            : []
    ));
    const count = computed(() => wishlist.value.length);
    const isLoading = computed(() => store.wishlistIsLoading);

    function replaceWishlist(response, fallback = []) {
        const normalized = normalizeWishlist(response);
        store.loggedInUser.wishlist = normalized ?? fallback;
        return normalized;
    }

    async function loadWishlist({ force = false } = {}) {
        await initializeSession();

        if (!store.loggedIn) {
            return [];
        }

        if (!force && Array.isArray(store.loggedInUser.wishlist)) {
            return wishlist.value;
        }

        store.setWishlistIsLoading(true);
        try {
            const response = await $api.getWishlist();
            return replaceWishlist(response) ?? [];
        } finally {
            store.setWishlistIsLoading(false);
        }
    }

    async function ensureWishlist() {
        if (store.loggedInUser.wishlistId) {
            return true;
        }

        const response = await $api.createWishlist(store.loggedInUser.id);
        const wishlistId = response?.wishlistId
            ?? response?.wishlist_id
            ?? response?.id
            ?? response;

        if (!wishlistId) {
            return false;
        }

        store.loggedInUser.wishlistId = wishlistId;
        return true;
    }

    function isInWishlist(productId) {
        return wishlist.value.some(item => item.product_id === productId);
    }

    function applyAddResponse(productId, response) {
        const normalized = normalizeWishlist(response);
        if (normalized) {
            store.loggedInUser.wishlist = normalized;
            return;
        }

        if (isInWishlist(productId)) {
            return;
        }

        const item = normalizeWishlistItem(response)
            ?? { product_id: productId };
        store.loggedInUser.wishlist = [...wishlist.value, item];
    }

    function applyRemoveResponse(productId, response) {
        const normalized = normalizeWishlist(response);
        store.loggedInUser.wishlist = normalized
            ?? wishlist.value.filter(item => item.product_id !== productId);
    }

    async function addToWishlist(productId) {
        await initializeSession();

        if (!store.loggedIn || !store.loggedInUser.id) {
            store.addToast({
                type: 'warning',
                message: 'Log in to save favorites',
            });
            return false;
        }

        await loadWishlist();
        if (isInWishlist(productId)) {
            return true;
        }

        try {
            if (!await ensureWishlist()) {
                return false;
            }

            const response = await $api.updateWishList(store.loggedInUser.id, productId);
            if (!response) {
                return false;
            }

            applyAddResponse(productId, response);
            await loadWishlist({ force: true });
            store.addToast({ type: 'success', message: 'Added to wishlist' });
            return true;
        } catch (err) {
            console.error(err);
            store.addToast({ type: 'warning', message: 'Unable to update wishlist' });
            return false;
        }
    }

    async function removeFromWishlist(productId) {
        if (!store.loggedIn || !store.loggedInUser.id) {
            return false;
        }

        try {
            const response = await $api.deleteFromWishlist(store.loggedInUser.id, productId);
            if (!response) {
                return false;
            }

            applyRemoveResponse(productId, response);
            store.addToast({ type: 'info', message: 'Removed from wishlist' });
            return true;
        } catch (err) {
            console.error(err);
            store.addToast({ type: 'warning', message: 'Unable to update wishlist' });
            return false;
        }
    }

    function toggleWishlist(productId) {
        return isInWishlist(productId)
            ? removeFromWishlist(productId)
            : addToWishlist(productId);
    }

    return {
        addToWishlist,
        count,
        isInWishlist,
        isLoading,
        loadWishlist,
        removeFromWishlist,
        toggleWishlist,
        wishlist,
    };
}
