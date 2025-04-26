// src/stores/auth.js
import { defineStore } from 'pinia';
const stage = process.env.VUE_APP_STAGE || 'dev';
const baseURL = `https://gocml861g1.execute-api.eu-north-1.amazonaws.com/${stage}`;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    baseURL: baseURL,
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
