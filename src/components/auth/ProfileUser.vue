<script setup>
import { ref } from 'vue';
import login_code from '@/composables/auth.js';
const { updateuser } = login_code();
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();

let isSubmitted=ref(false);

// Extract only the relevant properties from the user object
const user = ref({
  name: authStore.user.name || '',
  email: authStore.user.email || '',
  phone: authStore.user.phone ? authStore.user.phone.toString() : '', 
  phone_prefix: authStore.user.phone_prefix ? authStore.user.phone_prefix.toString() : '', 
});

const errors=ref({
    email:'',
    name:'',
    phone:''
});



const updateProfile = async () => {
    errors.value.name='';
    errors.value.email='';
    errors.value.phone='';
    isSubmitted.value=true;

    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const mobileRegex = /^\d{10}$/;

    if (user.value.name.trim() === '' 
    || !nameRegex.test(user.value.name) 
    || /<script.*?>.*<\/script>/.test(user.value.name)) 
    {
        errors.value.name = 'Invalid name.'; 
        return;
         }

    if (!emailRegex.test(user.value.email)) {
        errors.value.email = 'Invalid email address'; 
        return;
        }
    if (!mobileRegex.test(user.value.phone)) { 
            errors.value.phone = 'Invalid mobile number. ';
            return;
          }    

        await  updateuser(user.value);
    
};

</script>

<template>
  <div class="profile-container">
    <h5>Profile</h5>
    <form @submit.prevent="updateProfile">
      <div class="form-row mb-3">
        <label for="name" class="col-sm-2 col-form-label">Name:</label>
        <div class="col-sm-10">
          <input
            type="text"
            id="name"
            v-model="user.name"
            class="form-control"
            :placeholder="user.name ? '' : 'Enter your name'"
          />
          <span v-if="isSubmitted && errors.name" class="text-danger">{{ errors.name }}</span>
        </div>
      </div>

      <div class="form-row mb-3">
        <label for="email" class="col-sm-2 col-form-label">Email:</label>
        <div class="col-sm-10">
          <input
            type="email"
            id="email"
            v-model="user.email"
            class="form-control"
            :placeholder="user.email ? '' : 'Enter your email'"
          />
          <span v-if="isSubmitted && errors.email" class="text-danger">{{ errors.email }}</span>
        </div>
      </div>

      <div class="form-row mb-3">
        <label for="countryCode" class="col-sm-2 col-form-label">Country Code:</label>
        <div class="col-sm-10">
          <select
            v-model="user.phone_prefix"
            class="form-control"
            id="countryCode"
            required
          >
            <option value="" disabled selected>Select Country Code</option>
            <option value="+91" :selected="user.phone_prefix === '+91'">India (+91)</option>
            <option value="+974" :selected="user.phone_prefix === '+974'">Qatar (+974)</option>
          </select>
        </div>
      </div>

      <div class="form-row mb-3">
        <label for="mobile" class="col-sm-2 col-form-label">Mobile:</label>
        <div class="col-sm-10">
          <input
            type="text"
            id="mobile"
            v-model.trim="user.phone"
            class="form-control"
            :placeholder="user.phone ? '' : 'Enter your mobile number'"
          />
          <span v-if="isSubmitted && errors.phone" class="text-danger">{{ errors.phone }}</span>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Update Profile</button>
    </form>
  </div>
</template>

<style scoped>
/* Styling the profile form */
.profile-container {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-row {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
}

input,
select {
  padding: 8px;
  margin-top: 5px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.user-info {
  margin-top: 20px;
}

.user-info p {
  font-size: 16px;
}

h3.text-primary {
  color: #007bff;
}
</style>