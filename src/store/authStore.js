// src/stores/auth.js
import { defineStore } from 'pinia';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    baseURL: 'https://ny8o1pxzt1.execute-api.eu-north-1.amazonaws.com',
    token: localStorage.getItem('token') || '',
    user: null,
    error: null,
  }),
  actions: {
    
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});
