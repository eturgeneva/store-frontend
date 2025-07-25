import { reactive, ref, toRefs } from 'vue';

const state = reactive({
    loggedIn: false,
    loggedInUser: {},
    selectedProduct: {},
    cartId: null,
    cartIsLoading: true,
    cart: {
        products: []
    },

    // setLoggedIn(boolean) {
    //     this.loggedIn = boolean;
    // },

    // setSelectedProduct(productObject) {
    //     this.selectedProduct = productObject;
    // },

    // setCartId(cartId) {
    //     this.cartId = cartId;
    // },

    // setCartIsLoading(boolean) {
    //     this.cartIsLoading = boolean;
    // },

    // setCart(cartData) {
    //     this.cart.products = cartData.products || [];
    //     this.cartId = cartData.id || cartData.cartId || null;
    // }
});

export const store = {
    ...toRefs(state),
        setLoggedIn(boolean) {
        this.loggedIn = boolean;
    },

    setSelectedProduct(productObject) {
        this.selectedProduct = productObject;
    },

    setCartId(cartId) {
        console.log('Cart ID', cartId);
        this.cartId.value = cartId;
        console.log('Cart ID', this.cartId.value);
    },

    setCartIsLoading(boolean) {
        this.cartIsLoading.value = boolean;
    },

    setCart(cartData) {
        this.cart.value.products = cartData.products || [];
        // this.cartId.value = cartData.id || cartData.cartId || null;
    }
}