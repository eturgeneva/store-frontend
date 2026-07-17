import { inject } from 'vue';

export const apiKey = Symbol('store-api');

export function useApi() {
    const api = inject(apiKey);

    if (!api) {
        throw new Error('Store API is not available. Install it with app.provide(apiKey, api).');
    }

    return api;
}
