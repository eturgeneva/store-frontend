import { store } from "@/store";
import { useApi } from '@/api';

export function useCart() {
    const $api = useApi();

    async function loadCart() {
        const cartId = store.loggedInUser.cartId ?? null;
        store.setCartId(cartId);

        if (!cartId) {
            store.setCart({ products: [] });
            store.setCartIsLoading(false);
            return;
        }

        store.setCartIsLoading(true);
        try {
            const cart = await $api.getCart(cartId);
            store.setCart(cart || { products: [] });
        } finally {
            store.setCartIsLoading(false);
        }
    }

    async function addToCart(productId, quantity = 1) {
        try {
            // If a new cart needs to be created
            if (!store.cartId) {
                const newCartId = await $api.createCart();

                if (!newCartId) {
                    console.log('Failed to create cart');
                    return;
                }
                store.setCartId(newCartId);
                const newCart = await $api.getCart(newCartId);

                if (newCart) {
                    store.setCart(newCart);
                }
    
            }
            // If a cart already exists, but needs to be updated
            const cartUpdate = await $api.updateQuantityInCart(store.cartId, productId, quantity);
            if (cartUpdate) {
                store.setCart(cartUpdate);
                store.showMiniCart(productId);
                store.addToast({
                    type: 'success',
                    message: 'Added to cart',
                });
            } else {
                console.log('Failed to update cart');
                store.addToast({
                    type: 'warning',
                    message: 'Unable to update cart',
                });
            }
        } catch (err) {
            console.error(err);
            store.addToast({
                type: 'warning',
                message: 'Unable to update cart',
            });
        }
    }
    return {
        addToCart,
        loadCart,
    }
}
