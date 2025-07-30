export default class StoreApi {
    constructor(url) {
        this.url = url;
    }

    // Users
    // Create a new user
    async registerUser(userData) {
        try {
            const response = await fetch(`${this.url}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Registration failed');
            }
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    // Get user profile (/me)
    async getUser() {
        try {
            const response = await fetch(`${this.url}/users/me`, {
                    credentials: 'include'
            })
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            const userResponse = await response.json();
            return userResponse;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    // Update user by ID
    async updateUser(userId, userData) {
        try {
            const response = await fetch(`${this.url}/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to update user data');
            }

            const updatedUser = await response.json();
            return updatedUser;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    // User login
    async loginUser(loginData) {
        try {
            const response = await fetch(`${this.url}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }
            return true;

        } catch (err) {
            console.error(err);
            return false;
        }
    }

    // User login Google
    async loginUserGoogle() {
        window.location.href = `${this.url}/login/google`;
    }

    // Logout User
    async logoutUser() {
        try {
            const response = await fetch(`${this.url}/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }
            return true;

        } catch (err) {
            console.error(err);
            return false;
        }
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
    // Get cart by cart ID
    async getCart(cartId) {
        console.log('Fetching cart');
        try {
            // const userResponse = await fetch(`${this.url}/users/me`, {
            //     credentials: 'include'
            // });
            // const user = await userResponse.json();
            // const cartId = user.cartId;
            // console.log('cartId', cartId);

            // if (!cartId) {
            //     console.warn('No cart ID found for user');
            //     return false;
            // }
            
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
                return responseData.cartId;
            }
        } catch (err) {
            console.error('Failed to create a new cart', err);
            return false;
        }
    }

    // Update existing cart by ID 
    // Update product quantity in cart by product ID (increment or decrement by 1)
    async updateQuantityInCart(cartId, productId, quantityUpdate) {
        try {
            const response = await fetch(`${this.url}/carts/me`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    productId: productId,
                    cartId: cartId,
                    quantityUpdate: quantityUpdate
                }),
                credentials: 'include'
            });

            if (response.ok) {
                const cartUpdateReponse = await response.json();
                console.log('cart update', cartUpdateReponse);
                return cartUpdateReponse;
            }
        } catch (err) {
            console.error('Failed to update product quantity cart', err);
            return false;
        }
    }

    //Set specific product quantity in cart by product ID
    async setQuantityInCart(cartId, productId, setQuantity) {
        try {
            const response = await fetch(`${this.url}/carts/me`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    productId: productId,
                    cartId: cartId,
                    setQuantity: setQuantity
                }),
                credentials: 'include'
            });

            if (response.ok) {
                const cartUpdateReponse = await response.json();
                console.log('cart update', cartUpdateReponse);
                return cartUpdateReponse;
            }
        } catch (err) {
            console.error('Failed to set product quantity cart', err);
            return false;
        }
    }

    // Orders
    // Place a new order
    async placeOrder(orderData) {
        console.log('Order data', orderData);
        try {
            const response = await fetch(`${this.url}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    products: orderData 
                }),
                credentials: 'include'
            });
    
            if (response.ok) {
                const newOrder = await response.json();
                return newOrder;
            }
        } catch (err) {
            console.error('Failed to place an order', err);
            return false;
        }
    }
}