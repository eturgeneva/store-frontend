import { computed, inject, readonly, ref } from 'vue';
import { store } from './store.js';

export const sessionKey = Symbol('session');

export function createSession(api) {
    const isLoading = ref(false);
    const isInitialized = ref(false);
    const error = ref(null);
    let initialized = false;
    let initializationPromise = null;

    const user = computed(() => store.loggedInUser);
    const isAuthenticated = computed(() => store.loggedIn);

    function clearSessionState() {
        store.setLoggedIn(false);
        store.setLoggedInUser({});
        store.setCartId(null);
        store.setCart({ products: [] });
        store.setCartIsLoading(false);
    }

    async function loadSession() {
        isLoading.value = true;
        error.value = null;

        try {
            const currentUser = await api.getUser();

            if (!currentUser || currentUser.id == null) {
                clearSessionState();
                return null;
            }

            store.setLoggedIn(true);
            store.setLoggedInUser(currentUser);

            return currentUser;
        } catch (err) {
            error.value = err;
            clearSessionState();
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    async function initializeSession() {
        if (initialized) {
            return store.loggedInUser;
        }

        if (!initializationPromise) {
            initializationPromise = loadSession().finally(() => {
                initialized = true;
                isInitialized.value = true;
                initializationPromise = null;
            });
        }

        return initializationPromise;
    }

    async function refreshUser() {
        initialized = false;
        return loadSession().finally(() => {
            initialized = true;
            isInitialized.value = true;
        });
    }

    async function logout() {
        isLoading.value = true;
        error.value = null;

        try {
            const succeeded = await api.logoutUser();
            if (!succeeded) {
                return false;
            }

            clearSessionState();
            initialized = true;
            isInitialized.value = true;
            return true;
        } catch (err) {
            error.value = err;
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        error: readonly(error),
        initializeSession,
        isAuthenticated,
        isInitialized: readonly(isInitialized),
        isLoading: readonly(isLoading),
        logout,
        refreshUser,
        user,
    };
}

export function useSession() {
    const session = inject(sessionKey);

    if (!session) {
        throw new Error('Session is not available. Install it with app.provide(sessionKey, session).');
    }

    return session;
}
