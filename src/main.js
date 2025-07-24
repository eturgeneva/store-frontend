import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import StoreApi from './store-api';

const app = createApp(App);

app.config.globalProperties.$api = new StoreApi();

app.use(router).mount('#app');

// createApp(App).use(router).mount('#app');