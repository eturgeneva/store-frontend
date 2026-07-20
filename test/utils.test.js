import assert from 'node:assert/strict';
import test from 'node:test';
import { createApp } from 'vue';
import { apiKey } from '../src/api.js';
import { useCart } from '../src/composables/useCart.js';
import { formatPrice } from '../src/utils/currency.js';
import {
    PRODUCT_ASSET_URL,
    getProductCategory,
    getProductId,
    getProductImageUrl,
} from '../src/utils/products.js';
import { createSession } from '../src/session.js';
import { store } from '../src/store.js';

test('formatPrice converts cents to a two-decimal euro amount', () => {
    assert.equal(formatPrice(1299), '12.99 €');
    assert.equal(formatPrice(0), '0.00 €');
    assert.equal(formatPrice('250'), '2.50 €');
});

test('formatPrice safely handles missing or invalid values', () => {
    assert.equal(formatPrice(), '0.00 €');
    assert.equal(formatPrice('invalid'), '0.00 €');
});

test('getProductCategory follows the supported category fallbacks', () => {
    assert.equal(getProductCategory({ category: 'Plush' }), 'Plush');
    assert.equal(getProductCategory({ type: 'Puzzle' }), 'Puzzle');
    assert.equal(getProductCategory({ product_type: 'Doll' }), 'Doll');
    assert.equal(getProductCategory({ brand: 'Toyz' }), 'Toyz');
    assert.equal(getProductCategory({}, 'All toys'), 'All toys');
});

test('getProductImageUrl accepts a product or a product name', () => {
    assert.equal(getProductImageUrl({ name: 'frog' }), `${PRODUCT_ASSET_URL}frog.png`);
    assert.equal(getProductImageUrl('bear'), `${PRODUCT_ASSET_URL}bear.png`);
    assert.equal(getProductImageUrl(null), '');
});

test('getProductId supports each API response shape', () => {
    assert.equal(getProductId({ product_id: 1 }), 1);
    assert.equal(getProductId({ productId: 2 }), 2);
    assert.equal(getProductId({ id: 3 }), 3);
    assert.equal(getProductId({ product_id: 0, id: 4 }), 0);
    assert.equal(getProductId(null), null);
});

test('session initialization shares one user request', async () => {
    let userRequestCount = 0;
    const api = {
        async getUser() {
            userRequestCount += 1;
            return { id: 7, cartId: 12, first_name: 'Elena' };
        },
    };
    const session = createSession(api);

    await Promise.all([
        session.initializeSession(),
        session.initializeSession(),
        session.initializeSession(),
    ]);

    assert.equal(userRequestCount, 1);
    assert.equal(session.isInitialized.value, true);
    assert.equal(session.isAuthenticated.value, true);
    assert.equal(session.user.value.id, 7);
});

test('session logout clears authentication state', async () => {
    const api = {
        async getUser() {
            return { id: 8, cartId: null };
        },
        async logoutUser() {
            return true;
        },
    };
    const session = createSession(api);

    await session.initializeSession();
    const succeeded = await session.logout();

    assert.equal(succeeded, true);
    assert.equal(session.isAuthenticated.value, false);
    assert.deepEqual(session.user.value, {});
});

test('cart domain owns creation, totals, mutations, and clearing', async () => {
    const api = {
        async createCart() {
            return 42;
        },
        async updateQuantityInCart(cartId, productId, quantityChange) {
            assert.equal(cartId, 42);
            return {
                products: [{
                    product_id: productId,
                    price_cents: 750,
                    quantity: quantityChange,
                }],
            };
        },
        async setQuantityInCart(cartId, productId, newQuantity) {
            assert.equal(cartId, 42);
            return {
                products: newQuantity > 0
                    ? [{ product_id: productId, price_cents: 750, quantity: newQuantity }]
                    : [],
            };
        },
    };
    const app = createApp({});
    app.provide(apiKey, api);
    const cart = app.runWithContext(() => useCart());

    store.setLoggedInUser({ id: 7 });
    cart.clearCart();

    assert.equal(await cart.ensureCart(), 42);
    assert.equal(await cart.incrementQuantity(3, 2), true);
    assert.equal(cart.quantity.value, 2);
    assert.equal(cart.subtotal.value, 1500);

    assert.equal(await cart.setQuantity(3, 4), true);
    assert.equal(cart.quantity.value, 4);
    assert.equal(await cart.removeItem(3), true);
    assert.deepEqual(cart.cart.value.products, []);

    cart.clearCart();
    assert.equal(cart.cartId.value, null);
    assert.equal(store.loggedInUser.cartId, null);
});
