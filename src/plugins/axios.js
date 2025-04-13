import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import router from '@/router'; // assuming you have src/router/index.js

axios.interceptors.response.use(
  response => response,
  async error => {
    const authStore = useAuthStore();

    if (error.response && error.response.status === 401) {
      console.log('🔴 Token invalid or expired. Logging out...');
      
      await authStore.logout();
      router.push({ name: 'Login' });
    }

    return Promise.reject(error);
  }
);
