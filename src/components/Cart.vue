<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

// const props = defineProps(['api']);

const productQuantity = ref(null);

onBeforeMount(async () => {
    console.log('Store cart ID', store.cartId);
    console.log('Logged in user', store.loggedInUser);

    let cartId = store.cartId;

    if (!cartId) {
        const user = await $api.getUser();

        if (!user || !user.cartId) {
            console.log('No cart ID found for user or the cart is empty');
            return;
        }
        cartId = user.cartId;
        console.log('cartId', cartId);
        store.setCartId(cartId);
    }
    store.setCartIsLoading(true);
    console.log('Store cart property:', store.cart.products);
    const cart = await $api.getCart(cartId);

    if (cart) {
        store.setCart(cart);
        console.log('Store cart property:', store.cart.products);
    }
    store.setCartIsLoading(false);
});

async function incrementProductCount(productId, quantity) {
    try {
        const updatedCart = await $api.updateCart(store.cartId, productId, quantity);
        if (updatedCart) {
            store.setCart(updatedCart);
            console.log('Cart after increment', store.cart.products);
        } else {
            console.log('Unable to increment product count');
        }
    } catch (err) {
        console.error(err);
    }
}

async function decrementProductCount(productId, quantity) {
    if (quantity < 0) {
        console.log('Quantity can\'t be less than 0');
        return;
    }
    try {
        const updatedCart = await $api.updateCart(store.cartId, productId, quantity);
        if (updatedCart) {
            store.setCart(updatedCart);
            console.log('Cart after decrement', store.cart.products);
        } else {
            console.log('Unable to decrement product count');
        }
    } catch (err) {
        console.error(err);
    }
}

// async function updateQuantity(productId, quantity) {
//     if (quantity < 0) {
//         console.log('Quantity can\'t be less than 0');
//         return;
//     }
//     try {
//         const updatedCart = await $api.updateCart(store.cartId, productId, quantity);
//         if (updatedCart) {
//             store.setCart(updatedCart);
//             console.log('Cart after enter input', store.cart.products);
//         } else {
//             console.log('Unable to update product count on input');
//         }
//     } catch (err) {
//         console.error(err);
//     }
// }

async function removeProductFromCart(productId) {
    try {
        const updatedCart = await $api.updateCart(store.cartId, productId, 0);
        if (updatedCart) {
            store.setCart(updatedCart);
            console.log('Cart after removing a product', store.cart.products);
        } else {
            console.log('Unable to remove the product from cart');
        }
    } catch (err) {
        console.error(err);
    }
}

async function updateQuantity(productId, quantityUpdate) {
    // let product = store.cart.products.filter(product => {
    //     return product.product_id = productId;
    // });
    // console.log('Filtered product to update', product);
    // if ((product.quantity + quantityUpdate) < 0 ) {
    //     console.log('The amount is too low');
    //     return;
    // }

    try {
        const updatedCart = await $api.updateCart(store.cartId, productId, quantityUpdate);
        if (updatedCart) {
            store.setCart(updatedCart);
            console.log('Cart after enter input', store.cart.products);
        } else {
            console.log('Unable to update product count on input');
        }
    } catch (err) {
        console.error(err);
    }
};

async function setQuantity(productId, quantity) {
    // let quantityNumber = parseInt(quantity);

    let product = store.cart.products.filter(elem => {
        // console.log(elem);
        return elem.product_id === productId;
    });
    console.log('Filtered product to update', product);
    if ((product.quantity + quantity) < 0 ) {
        console.log('The amount is too low');
        return;
    }
}


</script>

<template>
    <main>
        <div class="userCart">
            <!-- <h3>Cart</h3> -->
            <div v-if="store.cart.products.length === 0">Your cart is empty</div>
            <div v-else-if="store.cartIsLoading">Cart is loading...</div>
            <div v-else>
                <div v-for="product in store.cart.products" 
                :key="product.product_id"
                class="product">
                    <div>{{ product.name }}</div>
                    <div>{{ product.quantity }}</div>
                    <div class="buttonContainer">
                        <button type="button" 
                                @click="updateQuantity(product.product_id, -1)">-
                        </button>
                        
                        <input v-model.number="product.quantity"
                                @keyup.enter="setQuantity(product.product_id, product.quantity)">
                        </input>
                        
                        <button type="button" 
                                @click="updateQuantity(product.product_id, 1)">+
                        </button>
                        <button type="button"
                                class="removeButton"
                                @click="removeProductFromCart(product.product_id)"
                                >🗑
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>