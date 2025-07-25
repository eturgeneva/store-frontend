import { reactive, ref } from 'vue';

export const store = reactive({
    loggedIn: false,
    loggedInUser: {},
    // userProfile: {},
    selectedProduct: {},
    cartId: null,
    cartIsLoading: true,
    cart: {
        products: []
    },

    setLoggedIn(boolean) {
        this.loggedIn = boolean;
    },

    // setUserProfile(profileObject) {
    //     this.userProfile = profileObject;
    // },

    setSelectedProduct(productObject) {
        this.selectedProduct = productObject;
    },

    setCartId(cartId) {
        this.cartId = cartId;
    },

    setCartIsLoading(boolean) {
        this.cartIsLoading = boolean;
    },

    setCart(cartData) {
        this.cart.products = cartData.products || [];
        this.cartId = cartData.id || cartData.cartId || null;
    }
});