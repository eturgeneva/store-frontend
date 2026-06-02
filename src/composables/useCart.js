import { getCurrentInstance } from "vue";
import { store } from "@/store";

export function useCart() {
    const { appContext } = getCurrentInstance();
    const $api = appContext.config.globalProperties.$api;

    async function addToCart(productId, quantity = 1) {
        console.log('Add to cart store cart ID', store.cartId);

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
                console.log('Newly created cart', store.cart.products);
                console.log('New store cart ID', store.cartId);
    
            }
            // If a cart already exists, but needs to be updated
            const cartUpdate = await $api.updateQuantityInCart(store.cartId, productId, quantity);
            if (cartUpdate) {
                store.setCart(cartUpdate);
                console.log('Updated cart', store.cart.products);
                console.log('Updated cart ID', store.cartId);

            } else {
                console.log('Failed to update cart');
            }
        } catch (err) {
            console.error(err);
        }
    }
    return {
        addToCart,
    }
}