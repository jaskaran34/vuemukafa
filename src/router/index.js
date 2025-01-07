// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

// Import views
import userLogin from '@/components/auth/userLogin.vue';
import Dashboard from '@/components/DashBoard.vue';

const routes = [
  { path: '/', name: 'userLogin', component: userLogin },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Access the Pinia store
  const isAuthenticated = authStore.isAuthenticated; // Use the getter

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if the user is not authenticated
    next({ name: 'userLogin' });
  } else {
    next(); // Allow navigation to the requested route
  }
});

export default router;
