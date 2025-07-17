import { reactive } from 'vue';

export const store = reactive({
    loggedIn: false,
    userProfile: {},
    cartId: null,
    cart: {},

    setLoggedIn(boolean) {
        this.loggedIn = boolean;
    },

    setUserProfile(profileObject) {
        this.userProfile = profileObject;
    },

    setCartId(cartId) {
        this.cartId = cartId;
    },

    setCart(cart) {
        this.cart = cart;
    }
});