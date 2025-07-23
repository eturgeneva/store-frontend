import { createRouter, createWebHistory } from 'vue-router';

import Homepage from './components/Homepage.vue';
import Profile from './components/Profile.vue';
import UserRegister from './components/UserRegister.vue';
import Products from './components/Products.vue';
import Cart from './components/Cart.vue';

// Vue Router
const routes = [
  { path: '/', component: Homepage },
  { path: '/products', component: Products },
  { path: '/profile', component: Profile },
  { path: '/cart', component: Cart}
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;