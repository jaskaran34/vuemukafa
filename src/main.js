// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import Vue Router
import { createPinia } from 'pinia'; // Import Pinia

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap'; // Import Bootstrap JS

import '@/plugins/axios';

const app = createApp(App);

app.use(router); // Use Vue Router
app.use(createPinia()); // Use Pinia for state management

app.mount('#app'); // Mount the app
