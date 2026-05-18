<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const searchInput = ref('');
const products = ref([]);
const foundMatch = ref(false);
// let match = [];
const match = ref([]);

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

function searchItem() {
    console.log('products value 0', products.value[0].name);
    // match.value = products.value.filter((product) => product.name.includes(searchInput));
    match.value = products.value.filter((product) => {
        product.name.includes(searchInput);
        // console.log('product value', product);
    }
)
    // match.value = ['lmao'];
    console.log('match', match);
    foundMatch.value = true;

    console.log('searchInput', searchInput);
    // return match;
}

</script>

<template>
    <div class="searchContainer">
        <!-- <div class="search"> -->
            <input v-model="searchInput"
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search..."
            >
            <button @click="searchItem"
                    type="button">
                <span class="material-symbols-outlined">
                    search
                </span>
            </button>
            <div v-if="foundMatch"
                class="matches">
                {{ match[0] }}
            </div>
        <!-- </div> -->
    </div>

</template>