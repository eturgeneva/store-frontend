export default class StoreApi {
    constructor(url) {
        this.url = url;
    }
    // Products
    // Get all products
    async getAllProducts() {
        console.log('Fetching products');
        try {
            const response = await fetch(`${this.url}/products`);
            if (!response.ok) {
                throw new Error('Failed to load products');
            }
            const products = await response.json();
            console.log('Products', products);
            return products;

        } catch (err) {
            console.error('Failed to fetched all products', err);
            return false;
        }
    }

    // Get product by ID
    async getProductById(productId) {
        console.log('Fetching a product by ID');
        try {
            const response = await fetch(`${this.url}/products/${productId}`);
            if (!response.ok) {
                throw new Error('Failed to load the product');
            }
            const product = await response.json();
            console.log('Product', product);
            return product;

        } catch (err) {
            console.error('Failed to fetch the product by ID', err);
            return false;
        }
    }

    // Cart
    async getCart() {
        console.log('Fetching cart');
        try {
            const userResponse = await fetch(`${this.url}/users/me`, {
                credentials: 'include'
            });
            const user = await userResponse.json();
            const cartId = user.cartId;
            console.log('cartId', cartId);

            if (!cartId) {
                console.warn('No cart ID found for user');
                return false;
            }
            
            const cartResponse = await fetch(`${this.url}/carts/${cartId}`, {
                credentials: 'include'
            })
            if (cartResponse.ok) {
                const cart = await cartResponse.json();
                console.log('Cart', cart);
                return cart;
            }
        } catch (err) {
            console.error('Failed to fetch cart', err);
            return false;
        }
    }
}