<template>
    <div class="container my-4">
      <h2 class="mb-4">Transaction Refund Time Settings</h2>
  
      <div class="card p-4 shadow-sm">
        <form @submit.prevent="handleUpdate">
          <div class="mb-3">
            <label for="refundTime" class="form-label">Refund Time (seconds)</label>
            <input
              type="number"
              id="refundTime"
              v-model="refundTime"
              class="form-control"
              min="1"
              required
            />
            <div v-if="refundTimeError" class="text-danger mt-1">{{ refundTimeError }}</div>
          </div>
  
          <button type="submit" class="btn btn-primary">
            Update Refund Time
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Mocked value - this will later come from your API/database
  const refundTime = ref(3600) // Example: 3600 seconds (1 hour)
  
  const refundTimeError = ref('')
  
  // Handle form submit
  const handleUpdate = () => {
    refundTimeError.value = ''
  
    if (refundTime.value <= 0 || !Number.isInteger(Number(refundTime.value))) {
      refundTimeError.value = 'Please enter a valid positive integer value.'
      return
    }
  
    console.log('New Refund Time (seconds):', refundTime.value)
    
    // Later: Make your API call here to update backend
  }
  </script>
  