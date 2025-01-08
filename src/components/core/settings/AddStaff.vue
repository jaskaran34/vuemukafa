<script setup>
import { ref,onMounted } from 'vue';
import login_code from '@/composables/auth.js';
const { Partner_Add_Staff, getstaff} = login_code();

const staffData = ref([]);

onMounted(async()=>{
    const staffList = await getstaff(); // Call your composable function here
    console.log(staffList);
  staffData.value = staffList;  // Store the fetched staff data

    
});
const form = ref({
  staffname: '',
  staffemail: '',
  staffpassword: '',
  stafftype: '',
});

const staffTypes = [
  { label: 'Superadmin', value: '1' },
  { label: 'Manager', value: '2' },
  { label: 'Marketing', value: '3' },
];

let isSubmitted=ref(false);

const errors=ref({
    email:'',
    name:'',
    password:'',
    type:''
});




const addstaff = async () => {
    errors.value.name='';
    errors.value.email='';
    errors.value.phone='';
    isSubmitted.value=true;

    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    const uppercaseRegex = /[A-Z]/; 
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (form.value.staffpassword.length < 9 || !uppercaseRegex.test(form.value.staffpassword) || !specialCharRegex.test(form.value.staffpassword)) {
        errors.value.password = 'Invalid Password';
        return; 
    }
   
if(form.value.stafftype==""){
    errors.value.type = 'Select Staff Type'; 
        return;
}

    if (form.value.staffname.trim() === '' 
    || !nameRegex.test(form.value.staffname) 
    || /<script.*?>.*<\/script>/.test(form.value.staffname)) 
    {
        errors.value.name = 'Invalid name.'; 
        return;
         }

    if (!emailRegex.test(form.value.staffemail)) {
        errors.value.email = 'Invalid email address'; 
        return;
        }
    

          
        await  Partner_Add_Staff(form.value);
    
};
</script>

<template>
  <div class="profile-container" >
    <h5 class="mb-4">Add Staff</h5>
    <form @submit.prevent="addstaff">
      <!-- Name Field -->
      <div class="mb-3">
        <label for="staffname" class="form-label">Name</label>
        <input
          type="text"
          id="staffname"
          v-model="form.staffname"
          class="form-control"
          placeholder="Enter staff name"
        />
        <span v-if="isSubmitted && errors.name" class="text-danger">{{ errors.name }}</span>
      </div>

      <!-- Email Field -->
      <div class="mb-3">
        <label for="staffemail" class="form-label">Email</label>
        <input
          type="email"
          id="staffemail"
          v-model="form.staffemail"
          class="form-control"
          placeholder="Enter email address"
        />
        <span v-if="isSubmitted && errors.email" class="text-danger">{{ errors.email }}</span>
      </div>

      <!-- Password Field -->
      <div class="mb-3">
        <label for="staffpassword" class="form-label">Password</label>
        <input
          type="password"
          id="staffpassword"
          v-model="form.staffpassword"
          class="form-control"
          placeholder="Enter password"
        />
        <span v-if="isSubmitted && errors.password" class="text-danger">{{ errors.password }}</span>
      </div>

      <!-- Staff Type Dropdown -->
      <div class="mb-3">
        <label for="stafftype" class="form-label">Staff Type</label>
        <select
          id="type"
          v-model="form.stafftype"
          class="form-select"
        >
          <option value="" disabled>Select staff type</option>
          <option v-for="type in staffTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
        <span v-if="isSubmitted && errors.type" class="text-danger">{{ errors.type }}</span>
      </div>
      <button type="submit" class="btn btn-primary">Add</button>
    </form>
    <h5 class="mb-2 mt-2">Staff List</h5>
    <table class="table table-striped table-bordered">
      <thead class="table-dark">
        <tr>
          <th></th>
          <th>Staff Name</th>
          <th>Email</th>
          <th>Created At</th>
          <th>Type of Staff</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="staff in staffData" :key="staff.id">
          <td>{{ staff.id }}</td>
          <td>{{ staff.name }}</td>
          <td>{{ staff.email }}</td>
          <td>{{ staff.created_at }}</td>
          <td>{{ staff.meta }}</td>
        </tr>
      </tbody>
    </table>
 </div>
</template>

<style scoped>
.profile-container {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
