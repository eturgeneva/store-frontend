<script setup>
import { computed, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const cartQuantity = computed(() => {
    return store.cart.products.reduce((acc, item) => acc + item.quantity, 0);
});

const cartSubtotal = computed(() => {
    return store.cart.products.reduce((acc, item) => {
        return acc + (item.price_cents * (item.quantity || 1));
    }, 0);
});

onBeforeMount(async () => {
    console.log('Store cart ID', store.cartId);
    console.log('Logged in user', store.loggedInUser);

    let cartId = store.cartId;

    if (!cartId) {
        const user = await $api.getUser();

        if (!user || !user.cartId) {
            console.log('No cart ID found for user or the cart is empty');
            store.setCartIsLoading(false);
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
        const checkout = await $api.placeOrder(store.cart.products);
        if (checkout) {
            console.log('The following order was placed', checkout);

            store.setCartId(null);
            store.setCart({ products: []});

            console.log('Store cart after checkout', store.cartId, store.cart);
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
        <section class="cartHero">
            <div class="cartHeroInner">
                <p class="eyebrow">Secure checkout</p>
                <h1>Review your order.</h1>
                <p>Adjust quantities, confirm your toys, and place your order when everything looks right.</p>
            </div>
        </section>

        <section class="cartShell">
            <div class="cartForm">
                <div class="checkoutCard">
                    <div class="checkoutCardHeading">
                        <div>
                            <h2>Your toys</h2>
                        </div>
                        <span>{{ cartQuantity }} {{ cartQuantity === 1 ? 'item' : 'items' }}</span>
                    </div>

                    <div
                        v-if="store.cartIsLoading"
                        class="checkoutEmpty"
                    >
                        Cart is loading...
                    </div>

                    <div
                        v-else-if="store.cart.products.length === 0"
                        class="checkoutEmpty"
                    >
                        <b>Your cart is empty.</b>
                        <p>Add a toy to preview your checkout.</p>
                        <router-link
                            to="/products"
                            class="cartOutlineButton"
                        >
                            Return to shop
                        </router-link>
                    </div>

                    <div
                        v-else
                        class="cartItems"
                    >
                        <article
                            v-for="item in store.cart.products"
                            :key="item.product_id"
                            class="cartItem"
                        >
                            <div class="cartItemImage">
                                <img
                                    :src="productImgURL + item.name + '.png'"
                                    :alt="item.name"
                                >
                            </div>

                            <div class="cartItemDetails">
                                <div>
                                    <p>{{ item.brand }}</p>
                                    <h3>
                                        <router-link :to="`/products/${item.product_id}`">
                                            {{ item.name }}
                                        </router-link>
                                    </h3>
                                    <span>{{ ((item.price_cents * (item.quantity || 1)) / 100).toFixed(2) + ' €' }}</span>
                                </div>

                                <div class="cartQuantityControls">
                                    <button
                                        type="button"
                                        :aria-label="`Decrease quantity for ${item.name}`"
                                        @click="updateQuantity(item.product_id, -1)"
                                    >
                                        -
                                    </button>

                                    <input
                                        type="number"
                                        class="quantityInput"
                                        min="0"
                                        :value="item.quantity"
                                        @change="setQuantity(item.product_id, Number($event.target.value))"
                                        @keyup.enter="setQuantity(item.product_id, Number($event.target.value))"
                                    >

                                    <button
                                        type="button"
                                        :aria-label="`Increase quantity for ${item.name}`"
                                        @click="updateQuantity(item.product_id, 1)"
                                    >
                                        +
                                    </button>

                                    <button
                                        type="button"
                                        class="removeButton"
                                        :aria-label="`Remove ${item.name}`"
                                        @click="setQuantity(item.product_id, 0)"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>

                <div
                    v-if="store.cart.products.length > 0"
                    class="cartActions"
                >
                    <router-link
                        to="/products"
                        class="cartOutlineButton"
                    >
                        Return to shop
                    </router-link>
                    <button
                        type="button"
                        class="checkoutButton"
                        @click="checkout"
                    >
                        Place order
                    </button>
                </div>
            </div>

            <aside
                class="orderSummary"
                aria-labelledby="cart-summary-title"
            >
                <div class="orderSummarySticky">
                    <div class="orderSummaryHeader">
                        <div>
                            <h2 id="cart-summary-title">Order summary</h2>
                        </div>
                        <span>{{ cartQuantity }} {{ cartQuantity === 1 ? 'item' : 'items' }}</span>
                    </div>

                    <div class="summaryLines">
                        <div>
                            <span>Subtotal</span>
                            <strong>{{ (cartSubtotal / 100).toFixed(2) + ' €' }}</strong>
                        </div>
                        <div>
                            <span>Shipping</span>
                            <strong>{{ cartSubtotal ? 'Free' : '-' }}</strong>
                        </div>
                    </div>

                    <div class="summaryTotal">
                        <span>Total</span>
                        <strong>{{ (cartSubtotal / 100).toFixed(2) + ' €' }}</strong>
                    </div>

                    <div class="checkoutNote">
                        <span aria-hidden="true">&bull;</span>
                        <p>No real checkout is processed. This is a portfolio project</p>
                    </div>
                </div>
            </aside>
        </section>
    </main>
</template>
