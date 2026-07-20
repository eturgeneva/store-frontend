import { getProductId } from './products.js';

export function normalizeWishlistItem(item) {
    if (!item || typeof item !== 'object') {
        return null;
    }

    const productId = getProductId(item);
    if (productId == null) {
        return null;
    }

    return {
        ...item,
        product_id: productId,
    };
}

export function normalizeWishlist(response) {
    const items = Array.isArray(response)
        ? response
        : response?.updatedWishlist
            ?? response?.wishlist
            ?? response?.products;

    if (!Array.isArray(items)) {
        return null;
    }

    return items
        .map(normalizeWishlistItem)
        .filter(Boolean);
}
