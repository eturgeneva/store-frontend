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
        const wishlist = getWishlistArray(wishlistResponse);
        if (wishlist) {
            store.loggedInUser.wishlist = wishlist;
        }
    }

    function getWishlistArray(wishlistResponse) {
        if (Array.isArray(wishlistResponse)) {
            return wishlistResponse;
        }

        if (Array.isArray(wishlistResponse?.updatedWishlist)) {
            return wishlistResponse.updatedWishlist;
        }

        if (Array.isArray(wishlistResponse?.wishlist)) {
            return wishlistResponse.wishlist;
        }

        if (Array.isArray(wishlistResponse?.products)) {
            return wishlistResponse.products;
        }

        return null;
    }

    function getWishlistProductId(item) {
        return item.product_id || item.productId || item.id;
    }

    function addProductToLocalWishlist(productId, wishlistResponse) {
        const wishlist = getWishlistArray(wishlistResponse);
        if (wishlist) {
            store.loggedInUser.wishlist = wishlist;
            return;
        }

        const currentWishlist = Array.isArray(store.loggedInUser.wishlist)
            ? store.loggedInUser.wishlist
            : [];

        if (currentWishlist.some(item => getWishlistProductId(item) === productId)) {
            store.loggedInUser.wishlist = currentWishlist;
            return;
        }

        const wishlistItem = wishlistResponse?.product_id || wishlistResponse?.productId
            ? wishlistResponse
            : { product_id: productId };

        store.loggedInUser.wishlist = [...currentWishlist, wishlistItem];
    }

    function removeProductFromLocalWishlist(productId, wishlistResponse) {
        const wishlist = getWishlistArray(wishlistResponse);
        if (wishlist) {
            store.loggedInUser.wishlist = wishlist;
            return;
        }

        const currentWishlist = Array.isArray(store.loggedInUser.wishlist)
            ? store.loggedInUser.wishlist
            : [];

        store.loggedInUser.wishlist = currentWishlist.filter(item => {
            return getWishlistProductId(item) !== productId;
        });
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
            store.addToast({
                type: 'warning',
                message: 'Log in to save favorites',
            });
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
                    removeProductFromLocalWishlist(productId, updatedWishlist);
                    store.addToast({
                        type: 'info',
                        message: 'Removed from wishlist',
                    });
                }
                return;
            }

            const updatedWishlist = await $api.updateWishList(store.loggedInUser.id, productId);
            if (updatedWishlist) {
                addProductToLocalWishlist(productId, updatedWishlist);
                store.addToast({
                    type: 'success',
                    message: 'Added to wishlist',
                });
            }
        } catch (err) {
            console.error(err);
            store.addToast({
                type: 'warning',
                message: 'Unable to update wishlist',
            });
        }
    }

    function isInWishlist(productId) {
        if (!Array.isArray(store.loggedInUser.wishlist)) {
            return false;
        }

        return store.loggedInUser.wishlist.some(item => getWishlistProductId(item) === productId);
    }

    return {
        isInWishlist,
        loadProfile,
        loadWishlist,
        toggleWishlist,
    };
}
