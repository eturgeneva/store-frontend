import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import StoreApi from './store-api';
import { apiKey } from './api';

const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const app = createApp(App);
const api = new StoreApi(URL);

app.provide(apiKey, api);

app.use(router).mount('#app');
