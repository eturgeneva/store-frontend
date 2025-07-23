import { reactive, ref } from 'vue';

export const store = reactive({
    loggedIn: false,
    userProfile: {},
    cartId: null,
    cart: {
        products: []
    },

    setLoggedIn(boolean) {
        this.loggedIn = boolean;
    },

    setUserProfile(profileObject) {
        this.userProfile = profileObject;
    },

    setCartId(cartId) {
        this.cartId = cartId;
    },

    setCart(cartData) {
        this.cart.products = cartData.products || [];
        this.cardId = cartData.id || cartData.cartId || null;
    }
});