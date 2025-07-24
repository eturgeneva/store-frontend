export default class StoreApi {
    // constructor() {

    // }

    // Cart
    async getCart() {
        // store.setCartIsLoading(true);
        try {
            // console.log('Store cart property:', store.cart.products);
            console.log('Fetching cart');

            const userResponse = await fetch('http://localhost:3000/users/me', {
                credentials: 'include'
            });
            const user = await userResponse.json();
            const cartId = user.cartId;
            console.log('cartId', cartId);

            if (!cartId) {
                console.warn('No cart ID found for user');
                // store.setCartIsLoading(false);
                // return;
                return false;
            }
            
            const cartResponse = await fetch(`http://localhost:3000/carts/${cartId}`, {
                credentials: 'include'
            })
            if (cartResponse.ok) {
                const cart = await cartResponse.json();
                console.log('Cart', cart);
                return cart;
                // store.setCart(cart);
                // console.log('Store cart property:', store.cart.products);
                // store.setCartIsLoading(false);
            }
            
        } catch (err) {
            console.error(err);
            // store.setCartIsLoading(false);
            return false;
        }
    }
}