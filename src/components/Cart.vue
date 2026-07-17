<script setup>
import { ref, computed, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';
import Item from './Item.vue';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const promoCode = ref('');
const promoCodeApplied = ref(false);
const orderPlaced = ref(false);
const newPaymentMethod = ref(false);

/* Shipping form */
const email = ref('');
const firstName = ref('');
const lastName = ref('');
const address = ref('');
const city = ref('');
const zipCode = ref('');

/* Payment form */
const cardName = ref('');
const cardNumber = ref('');
const cardExpiry = ref('');
const cardSecurityCode = ref('');

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

// Promo code (unfinished)
function applyPromoCode() {
    promoCode.value = '';
    promoCodeApplied.value = true;
}

function removePromoCode() {
    promoCode.value = '';
    promoCodeApplied.value = false;
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
            orderPlaced.value = true;

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
        <section class="hero">
            <div class="heroInner">
                <p class="eyebrow">Secure checkout</p>
                <h1>Review your order</h1>
                <p>This is a portfolio project. No orders will be processed and no items will be shipped</p>
            </div>
        </section>

        <!-- Items -->
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
                        <Item
                            v-for="item in store.cart.products"
                            :key="item.product_id"
                            :item="item"
                            :title="item.name"
                            :subtitle="item.brand"
                            :image-src="productImgURL + item.name + '.png'"
                            :to="`/products/${item.product_id}`"
                            variant="cart"
                        >
                            <template #meta>
                                <span>{{ ((item.price_cents * (item.quantity || 1)) / 100).toFixed(2) }} €</span>
                            </template>
                            <template #actions>
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
                            </template>
                        </Item>
                    </div>
                </div>

                <!-- Contact form -->
                <div class="checkoutCard" v-if="store.cart.products.length > 0">
                    <h2>Contact</h2>
                    <div class="checkoutContactForm">
                        <label for="email" class="formLabel">
                            Email address
                        </label>
                        <input
                            v-model="email"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="you@example.com"
                            required>
    
                        <label for="newsletter">
                            <input
                                type="checkbox"
                                name="newsletter"
                                id="newsletter"
                            >
                            <span>Send me news and launch updates</span>
                        </label>
                    </div>
                </div>

                <!-- Shipping info -->
                <div class="checkoutCard" v-if="store.cart.products.length > 0">
                    <h2>Shipping details</h2>
                    <div class="checkoutForm">
                        <!-- First name -->
                        <div class="field">
                            <label for="first_name" class="formLabel">
                                First name
                            </label>
                            <input
                                v-model="firstName"
                                type="text"
                                name="first_name"
                                id="first_name"
                                placeholder="First name"
                                required>
                        </div>
                        <!-- Last name -->
                         <div class="field">
                            <label for="last_name" class="formLabel">
                                Last name
                            </label>
                            <input
                                v-model="lastName"
                                type="text"
                                name="last_name"
                                id="last_name"
                                placeholder="Last name"
                                required>
                         </div>
                        <!-- Address -->
                        <div class="field field-lg">
                            <label for="address" class="formLabel">
                                    Address
                            </label>
                            <input
                                    v-model="address"
                                    type="text"
                                    name="address"
                                    id="address"
                                    placeholder="Adress"
                                    required>
                        </div>
                        <!-- City -->
                        <div class="field">
                            <label for="city" class="formLabel">
                                City
                            </label>
                            <input
                                v-model="city"
                                type="text"
                                name="city"
                                id="city"
                                placeholder="City"
                                required>
                        </div>
                        <!-- Zip code -->
                        <div class="field">
                            <label for="zip_code" class="formLabel">
                                ZIP code
                            </label>
                            <input
                                v-model="zipCode"
                                type="number"
                                name="zip_code"
                                id="zip_code"
                                placeholder="ZIP code"
                                required>
                        </div>
                    </div>
                    <!-- Delivery options -->
                    <div class="deliveryOptions" aria-label="delivery options">
                        <label>
                            <input type="radio" name="shipping" checked>
                            <span>
                                <strong>Complimentary ground</strong>
                                <p>3-5 business days · Free over $75</p>
                            </span>
                            <strong>Free</strong>
                        </label>
                        <label>
                            <input type="radio" name="shipping">
                            <span>
                                <strong>Priority delivery</strong>
                                <p>1-2 business days</p>
                            </span>
                            <strong>12 €</strong>
                        </label>
                    </div>
                    <div class="checkoutNote">
                        <span aria-hidden="true">&bull;</span>
                        <p>No items will be shipped, this is a portfolio project</p>
                    </div>
                </div>

                <!-- Payment info -->
                <div class="checkoutCard" v-if="store.cart.products.length > 0">
                    <h2>Payment method</h2>
                    <div class="paymentOptions" aria-label="payment options">
                        <label>
                            <input type="radio" name="payment" checked @click="() => newPaymentMethod = false">
                            <span>
                                <strong>Use saved payment method</strong>
                                <p>Default method</p>
                            </span>
                            <strong>Selected</strong>
                        </label>
                        <!-- New payment method -->
                        <label>
                            <input type="radio" name="payment" @click="() => newPaymentMethod = true">
                            <span>
                                <strong>Add a new payment method</strong>
                                <p>Opens a secure payment step</p>
                            </span>
                            <strong>Demo</strong>
                        </label>
                    </div>
                    <div v-if="newPaymentMethod" class="checkoutForm">
                        <!-- Name on card -->
                        <div class="field field-lg">
                            <label for="card_name" class="formLabel">
                                Name on card
                            </label>
                            <input
                                v-model="cardName"
                                type="text"
                                name="card_name"
                                id="card_name"
                                placeholder=""
                                required>
                        </div>
                        <!-- Card number -->
                        <div class="field field-lg">
                            <label for="card_number" class="formLabel">
                                Card number
                            </label>
                            <input
                                v-model="cardNumber"
                                type="number"
                                name="card_number"
                                id="card_number"
                                placeholder=""
                                required>
                        </div>
                        <!-- Card expiry date -->
                        <div class="field">
                            <label for="card_expiry" class="formLabel">
                                Expiry
                            </label>
                            <input
                                v-model="cardExpiry"
                                type="date"
                                name="card_expiry"
                                id="card_expiry"
                                placeholder=""
                                required>
                        </div>
                        <!-- Card security code -->
                        <div class="field">
                            <label for="card_security" class="formLabel">
                                Security code
                            </label>
                            <input
                                v-model="cardSecurityCode"
                                type="number"
                                name="card_security"
                                id="card_security"
                                placeholder=""
                                required>
                        </div>
                    </div>
                    <div class="checkoutNote">
                        <span aria-hidden="true">&bull;</span>
                        <p>No payment details are collected, this is a portfolio project.</p>
                    </div>
                </div>
                
                <!-- Checkout buttons -->
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
                        Place concept order
                    </button>
                </div>
            </div>
            
            <!-- Order summary -->
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

                    <div class="orderPromoCode">
                        <input
                            v-model="promoCode"
                            type="text"
                            name="promo_code"
                            id="promo_code"
                            :placeholder="promoCodeApplied && !orderPlaced? 'Promo code successfully applied!' : 'Promo code'"
                            :disabled="promoCodeApplied">
                        <button
                            type="button"
                            @click="applyPromoCode"
                            :disabled="promoCodeApplied || !promoCode"
                            >Apply
                        </button>
                    </div>

                    <div class="summaryLines">
                        <div v-if="promoCodeApplied && !orderPlaced" class="promoCodeSummary">
                            <span>Promo Code </span>
                            <div>
                                <strong>10% Off Your First Order</strong>
                                <button
                                    type="button"
                                    class="removeButton"
                                    aria-label="remove-promo-code"
                                    @click="removePromoCode"
                                        >x
                                </button>
                            </div>
                        </div>
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
