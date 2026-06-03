import { reactive, ref, toRefs } from 'vue';

export const store = reactive({
    loggedIn: false,
    loggedInUser: {},
    selectedProduct: {},
    cartId: null,
    cartIsLoading: true,
    miniCartOpen: false,
    lastAddedProductId: null,
    cart: {
        products: []
    },

    setLoggedIn(boolean) {
        this.loggedIn = boolean;
    },

    setLoggedInUser(userObject) {
        this.loggedInUser = userObject;
    },

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
    },

    showMiniCart(productId) {
        this.lastAddedProductId = productId;
        this.miniCartOpen = true;
    },

    hideMiniCart() {
        this.miniCartOpen = false;
    }
});
