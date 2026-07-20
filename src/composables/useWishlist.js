import { computed } from 'vue';
import { useApi } from '../api.js';
import { useSession } from '../session.js';
import { store } from '../store.js';
import { normalizeWishlist } from '../utils/wishlist.js';

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

    function syncWishlist(response, fallback = wishlist.value) {
        store.loggedInUser.wishlist = normalizeWishlist(response) ?? fallback;
    }

    function notify(type, message) {
        store.addToast({ type, message });
    }

    function isAuthenticated() {
        return Boolean(store.loggedIn && store.loggedInUser.id);
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
            syncWishlist(await $api.getWishlist());
            return wishlist.value;
        } finally {
            store.setWishlistIsLoading(false);
        }
    }

    async function ensureWishlist() {
        if (store.loggedInUser.wishlistId) {
            return store.loggedInUser.wishlistId;
        }

        const response = await $api.createWishlist(store.loggedInUser.id);
        const wishlistId = response?.wishlistId
            ?? response?.wishlist_id
            ?? response?.id
            ?? response
            ?? null;

        if (wishlistId) {
            store.loggedInUser.wishlistId = wishlistId;
        }

        return wishlistId;
    }

    function isInWishlist(productId) {
        return wishlist.value.some(item => item.product_id === productId);
    }

    async function addToWishlist(productId) {
        await initializeSession();

        if (!isAuthenticated()) {
            notify('warning', 'Log in to save favorites');
            return false;
        }

        await loadWishlist();
        if (isInWishlist(productId)) {
            return true;
        }

        try {
            const wishlistId = await ensureWishlist();
            const response = wishlistId
                ? await $api.updateWishList(store.loggedInUser.id, productId)
                : false;

            if (!response) {
                throw new Error('Wishlist request failed');
            }

            syncWishlist(response, [
                ...wishlist.value,
                { product_id: productId },
            ]);
            await loadWishlist({ force: true });
            notify('success', 'Added to wishlist');
            return true;
        } catch (error) {
            console.error(error);
            notify('warning', 'Unable to update wishlist');
            return false;
        }
    }

    async function removeFromWishlist(productId) {
        if (!isAuthenticated()) {
            return false;
        }

        try {
            const response = await $api.deleteFromWishlist(
                store.loggedInUser.id,
                productId,
            );

            if (!response) {
                throw new Error('Wishlist request failed');
            }

            syncWishlist(
                response,
                wishlist.value.filter(item => item.product_id !== productId),
            );
            notify('info', 'Removed from wishlist');
            return true;
        } catch (error) {
            console.error(error);
            notify('warning', 'Unable to update wishlist');
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
