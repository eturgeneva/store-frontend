import { reactive } from 'vue';

export const store = reactive({
    loggedIn: false,
    loggedInUser: {},
    selectedProduct: {},
    cartId: null,
    cartIsLoading: true,
    wishlistIsLoading: false,
    miniCartOpen: false,
    cartDrawerOpen: false,
    lastAddedProductId: null,
    toasts: [],
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

    setWishlistIsLoading(boolean) {
        this.wishlistIsLoading = boolean;
    },

    setCart(cartData) {
        this.cart.products = cartData.products || [];
    },

    showMiniCart(productId) {
        this.lastAddedProductId = productId;
        this.openCartDrawer();
    },

    hideMiniCart() {
        this.closeCartDrawer();
    },

    openCartDrawer() {
        this.miniCartOpen = true;
        this.cartDrawerOpen = true;
    },

    closeCartDrawer() {
        this.miniCartOpen = false;
        this.cartDrawerOpen = false;
    },

    addToast(toast) {
        this.toasts.push({
            id: Date.now() + Math.random(),
            type: toast.type || 'info',
            message: toast.message,
        });
    },

    removeToast(toastId) {
        this.toasts = this.toasts.filter(toast => toast.id !== toastId);
    }
});
