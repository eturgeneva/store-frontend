import { computed } from 'vue';
import { store } from '../store.js';
import { useApi } from '../api.js';

export function useCart() {
    const $api = useApi();

    const cart = computed(() => store.cart);
    const cartId = computed(() => store.cartId);
    const isLoading = computed(() => store.cartIsLoading);
    const quantity = computed(() => store.cart.products.reduce(
        (total, item) => total + (item.quantity || 0),
        0,
    ));
    const subtotal = computed(() => store.cart.products.reduce(
        (total, item) => total + (item.price_cents * (item.quantity || 1)),
        0,
    ));

    async function loadCart() {
        const userCartId = store.loggedInUser.cartId ?? null;
        store.setCartId(userCartId);

        if (!userCartId) {
            clearCart();
            store.setCartIsLoading(false);
            return;
        }

        store.setCartIsLoading(true);
        try {
            const loadedCart = await $api.getCart(userCartId);
            store.setCart(loadedCart || { products: [] });
        } finally {
            store.setCartIsLoading(false);
        }
    }

    async function ensureCart() {
        if (store.cartId) {
            return store.cartId;
        }

        const newCartId = await $api.createCart();
        if (!newCartId) {
            return null;
        }

        store.setCartId(newCartId);
        store.loggedInUser.cartId = newCartId;
        store.setCart({ products: [] });
        return newCartId;
    }

    async function incrementQuantity(productId, quantityChange = 1) {
        if (!store.cartId) {
            return false;
        }

        const updatedCart = await $api.updateQuantityInCart(
            store.cartId,
            productId,
            quantityChange,
        );

        if (!updatedCart) {
            return false;
        }

        store.setCart(updatedCart);
        return true;
    }

    async function setQuantity(productId, newQuantity) {
        if (!store.cartId || newQuantity < 0) {
            return false;
        }

        const updatedCart = await $api.setQuantityInCart(
            store.cartId,
            productId,
            newQuantity,
        );

        if (!updatedCart) {
            return false;
        }

        store.setCart(updatedCart);
        return true;
    }

    function removeItem(productId) {
        return setQuantity(productId, 0);
    }

    function clearCart() {
        store.setCartId(null);
        store.setCart({ products: [] });

        if ('cartId' in store.loggedInUser) {
            store.loggedInUser.cartId = null;
        }
    }

    async function addToCart(productId, addedQuantity = 1) {
        try {
            const id = await ensureCart();
            const updated = id
                ? await incrementQuantity(productId, addedQuantity)
                : false;

            if (!updated) {
                store.addToast({
                    type: 'warning',
                    message: 'Unable to update cart',
                });
                return false;
            }

            store.showMiniCart(productId);
            store.addToast({
                type: 'success',
                message: 'Added to cart',
            });
            return true;
        } catch (err) {
            console.error(err);
            store.addToast({
                type: 'warning',
                message: 'Unable to update cart',
            });
            return false;
        }
    }

    return {
        addToCart,
        cart,
        cartId,
        clearCart,
        ensureCart,
        incrementQuantity,
        isLoading,
        loadCart,
        quantity,
        removeItem,
        setQuantity,
        subtotal,
    };
}
