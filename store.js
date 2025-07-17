import { reactive } from 'vue';

export const store = reactive({
    loggedIn: false,
    userProfile: {},
    cartId: null,

    setLoggedIn(boolean) {
        this.loggedIn = boolean;
    },

    setUserProfile(profileObject) {
        this.userProfile = profileObject;
    },

    updateCartId(cartId) {
        this.cartId = cartId;
    }
});