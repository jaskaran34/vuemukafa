
<script setup>
import { ref,onMounted } from 'vue';
import login_code from '@/composables/auth.js';
const { get_return_period,set_return_period } = login_code();

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const reloadRoute = async() => {
   const currentRoute = { name: route.name, query: route.query, params: route.params, };
    router.push({ name: 'reload', query: { targetRoute: JSON.stringify(currentRoute) } }); 
  };


// Mocked value - this will later come from your API/database
const refundTime = ref(0) // Example: 3600 seconds (1 hour)

const refundTimeError = ref('')

// Handle form submit
const handleUpdate = async() => {
  refundTimeError.value = ''

  if (refundTime.value <= 0 || !Number.isInteger(Number(refundTime.value))) {
    refundTimeError.value = 'Please enter a valid positive integer value.'
    return
  }

  await set_return_period(refundTime.value);
  await reloadRoute();
  
}
onMounted(async() => {
const res=await get_return_period();
refundTime.value=res.return_time;

});

</script>

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
  