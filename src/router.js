import { createRouter, createWebHistory } from 'vue-router';
import StoreApi from './store-api';

import Homepage from './components/Homepage.vue';
import Profile from './components/Profile.vue';
import Products from './components/Products.vue';
import Cart from './components/Cart.vue';
import ProductPage from './components/ProductPage.vue';
import Orders from './components/Orders.vue';
import OrderDetails from './components/OrderDetails.vue';
import Wishlist from './components/Wishlist.vue';

// const URL = 'http://localhost:3000';
// const api = new StoreApi(URL);

// Vue Router
const routes = [
  { path: '/', component: Homepage },
  { path: '/products', component: Products },
  { path: '/products/:id', component: ProductPage},
  { path: '/profile', component: Profile },
  { path: '/cart', component: Cart },
  { path: '/orders', component: Orders },
  { path: '/orders/:id', component: OrderDetails },
  { path: '/wishlist', component: Wishlist },
  // { path: '/cart', component: Cart, props: { api }},
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;