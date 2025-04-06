<template>
    <div class="container my-4">
      <h2 class="mb-4">Alert Settings</h2>
  
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>Alert Type</th>
              <th>SMS</th>
              <th>Email</th>
              <th>WhatsApp</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(alert, index) in alerts" :key="index">
              <td>{{ alert.name }}</td>
              <td>
                <select v-model="alert.sms" class="form-select" @change="handleChange(alert, 'sms')">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td>
                <select v-model="alert.email" class="form-select" @change="handleChange(alert, 'email')">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td>
                <select v-model="alert.whatsapp" class="form-select" @change="handleChange(alert, 'whatsapp')">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  
  // Static example data
  const alerts = reactive([
    { name: 'Register', sms: 'active', email: 'inactive', whatsapp: 'active' },
    { name: 'purchase', sms: 'inactive', email: 'active', whatsapp: 'inactive' },
    { name: 'Redemption', sms: 'active', email: 'active', whatsapp: 'inactive' },
  ])
  
  // Handle change of status
  const handleChange = (alert, type) => {
    console.log(`Changed ${type} for ${alert.name} to ${alert[type]}`)
    // Later you will send this to API
  }
  </script>
  