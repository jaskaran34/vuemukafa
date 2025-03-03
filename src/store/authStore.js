// src/stores/auth.js
import { defineStore } from 'pinia';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    baseURL: 'https://gocml861g1.execute-api.eu-north-1.amazonaws.com/dev',
    token: localStorage.getItem('token') || '',
    user: null,
    error: null,
    user_type:null
  }),
  actions: {
    
  async logout() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
      }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});
