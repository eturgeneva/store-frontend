import { reactive, ref } from 'vue';

export const store = reactive({
    loggedIn: false,
    userProfile: {},
    cartId: null,
    // cart: {
    //     products: []
    // },
    cart: [],

    setLoggedIn(boolean) {
        this.loggedIn = boolean;
    },

    setUserProfile(profileObject) {
        this.userProfile = profileObject;
    },

    setCartId(cartId) {
        this.cartId = cartId;
    },

    // setCart(cartData) {
    //     this.cart.products = cartData.products || [];
    //     this.cardId = cartData.id || cartData.cartId || null;
    // }
    setCart(cartData) {
        this.cart = cartData || [];
        this.cardId = cartData.id || cartData.cartId || null;
    }
});

// export const store = {
//     loggedIn: false,
//     userProfile: {},
//     cartId: null,
//     cart: ref({
//         products: []
//     }),

//     setLoggedIn(boolean) {
//         this.loggedIn = boolean;
//     },

//     setUserProfile(profileObject) {
//         this.userProfile = profileObject;
//     },

//     setCartId(cartId) {
//         this.cartId = cartId;
//     },

//     setCart(cartData) {
//         this.cart.value = cartData;
//         // this.cardId = cartData.id || cartData.cartId || null;
//     }
// };