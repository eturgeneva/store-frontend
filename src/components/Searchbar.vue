<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { store } from '../store.js';

const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;

const searchInput = ref('');
const products = ref([]);
const foundMatch = ref(false);
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
    // match.value = products.value.filter((product) => product.name.toLowerCase().includes(searchInput.value.toLowerCase()));
    match.value = products.value.filter((product) => {
        return product.name.toLowerCase().includes(searchInput.value.toLowerCase());
    })
    foundMatch.value = true;

    console.log('match', match.value);
    console.log('searchInput', searchInput.value);
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
                <div v-for="item in match" :key="item.id">
                    {{ item.name }}
                </div>
            </div>
        <!-- </div> -->
    </div>

</template>