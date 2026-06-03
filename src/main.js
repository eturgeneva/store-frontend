import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import StoreApi from './store-api';

const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const app = createApp(App);

app.config.globalProperties.$api = new StoreApi(URL);

app.use(router).mount('#app');
