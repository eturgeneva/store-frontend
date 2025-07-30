<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

// const props = defineProps(['api']);

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

// For '-' and '+' buttons
async function updateQuantity(productId, quantityUpdate) {
    try {
        const updatedCart = await $api.updateQuantityInCart(store.cartId, productId, quantityUpdate);
        if (updatedCart) {
            store.setCart(updatedCart);
            console.log('Cart after quantity update', store.cart.products);
        } else {
            console.log('Unable to update product quantity in cart');
        }
    } catch (err) {
        console.error(err);
    }
};

// For input field and delete button
async function setQuantity(productId, quantity) {
    if (quantity < 0 ) {
        console.log('The amount is too low');
        return;
    }

    try {
        const updatedCart = await $api.setQuantityInCart(store.cartId, productId, quantity);
        if (updatedCart) {
            store.setCart(updatedCart);
            console.log('Cart after set quantity on input', store.cart.products);
        } else {
            console.log('Unable to set quantity on input');
        }
    } catch (err) {
        console.error(err);
    }
}

// Checkout
async function checkout() {
    if (!store.cartId || !store.cart.products) {
        console.log('Unable to place order, your cart is empty');
        return;
    }

    try {
        const checkout = await $api.placeOrder();
        if (checkout) {
            console.log('The following order was placed', checkout);

            store.setCartId(null);
            store.setCart({ products: []});
        } else {
            console.log('Failed to place an order');
        }
    } catch (err) {
        console.error(err);
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
                    <div>Quantity: {{ product.quantity }}</div>
                    <div>Product ID: {{ product.product_id }}</div>
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
                                @click="setQuantity(product.product_id, 0)"
                                >🗑
                        </button>

                    </div>
                </div>
            </div>
            <button v-if="store.cart.products.length > 0"
                    type="button"
                    class="checkoutButton"
                    @click="checkout"
                    >Checkout
            </button>
        </div>
    </main>
</template>