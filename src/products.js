import { inject, readonly, ref } from 'vue';

export const productsKey = Symbol('products');

export function createProducts(api) {
    const products = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    let isLoaded = false;
    let loadingPromise = null;

    async function fetchProducts() {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await api.getAllProducts();
            if (!Array.isArray(response)) {
                throw new Error('Unable to load products');
            }

            products.value = response;
            isLoaded = true;
            return products.value;
        } catch (err) {
            error.value = err;
            return [];
        } finally {
            isLoading.value = false;
        }
    }

    function loadProducts() {
        if (isLoaded) {
            return Promise.resolve(products.value);
        }

        if (!loadingPromise) {
            loadingPromise = fetchProducts().finally(() => {
                loadingPromise = null;
            });
        }

        return loadingPromise;
    }

    function searchProducts(query, { limit } = {}) {
        const normalizedQuery = String(query ?? '').trim().toLowerCase();
        if (!normalizedQuery) {
            return [];
        }

        const matches = products.value.filter(product => {
            const name = product.name?.toLowerCase() ?? '';
            const brand = product.brand?.toLowerCase() ?? '';
            return name.includes(normalizedQuery) || brand.includes(normalizedQuery);
        });

        return Number.isInteger(limit) ? matches.slice(0, limit) : matches;
    }

    return {
        error: readonly(error),
        isLoading: readonly(isLoading),
        loadProducts,
        products: readonly(products),
        searchProducts,
    };
}

export function useProducts() {
    const productRepository = inject(productsKey);

    if (!productRepository) {
        throw new Error('Products are not available. Install them with app.provide(productsKey, products).');
    }

    return productRepository;
}
