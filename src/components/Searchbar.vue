<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const searchInput = ref('');

onBeforeMount(async () => {
    try {
        const fetchedProducts = await $api.getAllProducts();
        if (fetchedProducts) {
            products.value = fetchedProducts;
            console.log('Products', products.value);
        } else {
            console.log('Failed to fetch products');
        }
    } catch (err) {
        console.error(err);
    }
});

</script>

<template>
    <div class="searchContainer">
        <!-- <div class="search"> -->
            <input v-model="searchInput"
                    type="text"
                    name="search"
                    id="search"
            >
            <button>
                <span class="material-symbols-outlined">
                    search
                </span>
            </button>
        <!-- </div> -->
    </div>

</template>