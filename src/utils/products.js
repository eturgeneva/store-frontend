export const PRODUCT_ASSET_URL = 'https://eturgeneva.github.io/toy-store-assets/';

export function getProductCategory(product, fallback = 'Toy') {
    return product?.category
        || product?.type
        || product?.product_type
        || product?.brand
        || fallback;
}

export function getProductImageUrl(productOrName) {
    const name = typeof productOrName === 'string'
        ? productOrName
        : productOrName?.name;

    return name ? `${PRODUCT_ASSET_URL}${name}.png` : '';
}

export function getProductId(item) {
    return item?.product_id ?? item?.productId ?? item?.id ?? null;
}

export function formatProductName(name) {
    const trimmedName = typeof name === 'string' ? name.trim() : '';

    return trimmedName
        ? trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1)
        : '';
}
