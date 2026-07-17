import { getCurrentInstance } from "vue";
import { store } from "@/store";

export function useCart() {
    const { appContext } = getCurrentInstance();
    const $api = appContext.config.globalProperties.$api;

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
    }
}
