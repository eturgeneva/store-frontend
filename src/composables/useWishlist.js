import { getCurrentInstance } from 'vue';
import { store } from '@/store';

export function useWishlist() {
    const { appContext } = getCurrentInstance();
    const $api = appContext.config.globalProperties.$api;

    async function loadProfile() {
        if (store.loggedIn) {
            return;
        }

        try {
            const user = await $api.getUser();
            if (user) {
                store.setLoggedIn(user.id !== null);
                if (user.id !== null) {
                    Object.assign(store.loggedInUser, user);
                    store.setCartId(user.cartId);
                }
            }
        } catch (err) {
            console.error(err);
            store.setLoggedIn(false);
        }
    }

    async function loadWishlist() {
        await loadProfile();

        if (!store.loggedIn || Array.isArray(store.loggedInUser.wishlist)) {
            return;
        }

        try {
            const wishlist = await $api.getWishlist();
            if (wishlist) {
                updateWishlistInStore(wishlist);
            }
        } catch (err) {
            console.error(err);
        }
    }

    function updateWishlistInStore(wishlistResponse) {
        store.loggedInUser.wishlist = wishlistResponse.updatedWishlist || wishlistResponse;
    }

    async function ensureWishlist() {
        if (store.loggedInUser.wishlistId) {
            return true;
        }

        const wishlistId = await $api.createWishlist(store.loggedInUser.id);
        if (!wishlistId) {
            console.log('Failed to create a wishlist');
            return false;
        }

        store.loggedInUser.wishlistId = wishlistId;
        return true;
    }

    async function toggleWishlist(productId) {
        await loadProfile();

        if (!store.loggedIn || !store.loggedInUser.id) {
            console.log('Please log in to create a wishlist');
            return;
        }

        try {
            await loadWishlist();
            const hasWishlist = await ensureWishlist();
            if (!hasWishlist) {
                return;
            }

            if (isInWishlist(productId)) {
                const updatedWishlist = await $api.deleteFromWishlist(store.loggedInUser.id, productId);
                if (updatedWishlist) {
                    updateWishlistInStore(updatedWishlist);
                }
                return;
            }

            const updatedWishlist = await $api.updateWishList(store.loggedInUser.id, productId);
            if (updatedWishlist) {
                updateWishlistInStore(updatedWishlist);
            }
        } catch (err) {
            console.error(err);
        }
    }

    function isInWishlist(productId) {
        if (!Array.isArray(store.loggedInUser.wishlist)) {
            return false;
        }

        return store.loggedInUser.wishlist.some(item => item.product_id === productId);
    }

    return {
        isInWishlist,
        loadProfile,
        loadWishlist,
        toggleWishlist,
    };
}
