<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const searchInput = ref('');
const router = useRouter();

function showSearchResults() {
    const query = searchInput.value.trim();
    if (!query) {
        return;
    }
    router.push({
        path: '/search',
        query: { q: query },
    });
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
                    @keyup.enter="showSearchResults"
            >
            <button @click="showSearchResults"
                    type="button">
                <span class="material-symbols-outlined">
                    search
                </span>
            </button>
        <!-- </div> -->
    </div>

</template>
