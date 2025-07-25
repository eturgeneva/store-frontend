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
    // Get cart by user
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

    // Create new cart
    async createCart() {
        try {
            const response = await fetch(`${this.url}/carts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
                credentials: 'include'
            });
    
            if (response.ok) {
                const responseData = await response.json();
                return responseData;
            }
        } catch (err) {
            console.error('Failed to create a new cart', err);
        }
    }

    // Update existing cart (add product by ID)
    async updateCart(productId) {
        try {
                const response = await fetch('http://localhost:3000/carts/me', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        productId: productId,
                        cartId: store.cartId,
                        quantity: 1
                    }),
                    credentials: 'include'
                })
                const cartUpdateReponse = await response.json();
                console.log('cart update', cartUpdateReponse);
                console.log('Store cart update', store.cart);
                return store.setCart(cartUpdateReponse);
        } catch (err) {
            console.error(err);
        }
    }
}