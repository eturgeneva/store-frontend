import { createRouter, createWebHistory } from 'vue-router';
import Homepage from './components/Homepage.vue';
import Profile from './components/Profile.vue';
import Products from './components/Products.vue';
import Cart from './components/Cart.vue';
import ProductPage from './components/ProductPage.vue';
import Orders from './components/Orders.vue';
import OrderDetails from './components/OrderDetails.vue';
import Wishlist from './components/Wishlist.vue';
import MissingPage from './components/MissingPage.vue';
import PersonalDetails from './components/PersonalDetails.vue';
import SearchResults from './components/SearchResults.vue';

const routes = [
  { path: '/', component: Homepage },
  { path: '/products', component: Products },
  { path: '/products/:id', component: ProductPage},
  { path: '/search', component: SearchResults },
  { path: '/profile', component: Profile },
  { path: '/profile/details', component: PersonalDetails },
  { path: '/cart', component: Cart },
  { path: '/orders', component: Orders },
  { path: '/orders/:id', component: OrderDetails },
  { path: '/wishlist', component: Wishlist },

  { path: '/new', component: MissingPage},
  { path: '/sale', component: MissingPage},
  { path: '/gift-sets', component: MissingPage},
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router;
