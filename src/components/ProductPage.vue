<script setup>
import { onMounted, getCurrentInstance, ref } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const productImgURL = 'https://eturgeneva.github.io/toy-store-assets/';

const route = useRoute();
const productId = route.params.id;
const quantity = ref(1);

onMounted(async () => {
    try {
        const selectedProduct = await $api.getProductById(productId);
        if (selectedProduct) {
            store.setSelectedProduct(selectedProduct);
            console.log('Store selectedProduct property', store.selectedProduct);
        } else {
            console.log('Failed to fetch the product');
        }
    } catch (err) {
        console.error(err);
    }
});

// repeated in ProductsPreviews
async function addToCart(productId, quantity) {
    console.log('Add to cart store cart ID', store.cartId);

    try {
        // If a new cart needs to be created
        if (!store.cartId) {
            const newCartId = await $api.createCart();
            console.log('new cart ID', newCartId);

            if (newCartId) {
                store.setCartId(newCartId);
                const newCart = await $api.getCart(newCartId);
                store.setCart(newCart);
                console.log('Newly created cart', store.cart.products);
                console.log('New store cart ID', store.cartId);
            } else {
                console.log('Failed to create cart');
            }
        }
        // If a cart already exists, but needs to be updated
        const cartUpdate = await $api.updateQuantityInCart(store.cartId, productId, quantity);
        if (cartUpdate) {
            store.setCart(cartUpdate);
            console.log('Updated cart', store.cart.products);
            console.log('Updated cart ID', store.cartId);

        } else {
            console.log('Failed to update cart');
        }
    } catch (err) {
        console.error(err);
    }
}

</script>

<template>
    <div v-if="store.selectedProduct" class="productDetails">
            <div class="product">
                <div>
                    <img :src="productImgURL + store.selectedProduct.name + '.png'" class="productDetailsImage">
                </div>
                <div class="productDescription">
                    <h3>Product Details</h3>
                    <div>Name: {{ store.selectedProduct.name }}</div>
                    <div>Price: {{ store.selectedProduct.price_cents / 100 + ' €'}}</div>
                    <div class="quantity-input">
                        <input  v-model="quantity"
                                type="number" 
                                name="quantity"
                                id="quantity">
                    </div>
                    <div class="buttonContainer">
                        <button @click="addToCart(store.selectedProduct.id, quantity)" 
                                type="button" 
                                class="buyButton">
                                Add to cart 
                        </button>
                        <button type="button" class="favoriteButton">❤</button>
                    </div>

                    <h4>Description:</h4>
                    <div>Meet {{ store.selectedProduct.name}}, the ultimate cuddle companion! With his velvety-soft fur, gentle smile, and droopy eyelids, {{ store.selectedProduct.name }} is always ready for nap time—whether it's a lazy afternoon snooze or a bedtime snuggle. Hand-stitched details and ultra-plush stuffing make him irresistibly huggable and safe for all ages. Whether you're gifting a little one or adding charm to your own cozy corner, {{ store.selectedProduct.name }} brings warmth, comfort, and a touch of woodland magic wherever he goes.</div>

                    <h4>Size:</h4>
                    <div>12 inches tall</div>
                    <h4>Material:</h4>
                    <div>Hypoallergenic, ultra-soft polyester</div>
                    <h4>Recommended Age:</h4>
                    <div>0+</div>
                    <h4>Care Instructions:</h4>
                    <div>Spot clean or gentle hand wash. Air dry only.</div>

                    <div>Bring {{ store.selectedProduct.name }} home and let the snuggles begin!</div>
                </div>
            </div>
        </div>
</template>

<style scoped>

</style>