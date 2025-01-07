<script setup>
import {ref} from 'vue';
import login_code from '@/composables/auth.js';
const { login } = login_code();
const email=ref('');
const password=ref('');
const submitForm = () => {
    login(email.value,password.value);
};
</script>
<template>
    <div class="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div class="card shadow-lg" style="width: 100%; max-width: 400px;">
        <div class="card-body p-4">
          <h3 class="text-center mb-4">Login</h3>
  
          <!-- Form -->
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="email" class="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="form-control"
                required
              />
            </div>
  
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                id="password"
                v-model="password"
                class="form-control"
                required
              />
            </div>
  
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
  
            
          </form>
        </div>
      </div>
    </div>
  </template>
  

  
  <style scoped>
  /* Optional: Customize the background color or add other styles */
  body {
    background-color: #f8f9fa;
  }
  .card {
    border-radius: 10px;
  }
  </style>
  