<script setup>
import { ref,onMounted } from 'vue';
import login_code from '@/composables/auth.js';
const { register_member,all_members } = login_code();

import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

import { useAuthStore } from '@/store/authStore';
const authStore = useAuthStore();

const memberData = ref([]);

onMounted(async()=>{

  if (authStore.token) {
    let result=await all_members();
    memberData.value = result; 
  } else {
    console.log('22');
    router.push({name: 'userLogin'});
  }
   
    
});

const reloadRoute = async() => {
   const currentRoute = { name: route.name, query: route.query, params: route.params, };
    router.push({ name: 'reload', query: { targetRoute: JSON.stringify(currentRoute) } }); 
  };


const form = ref({
  member_name: '',
  member_email: '',
  member_password: '',
  member_phone: '',
  member_countryCode:'+974'
});


let isSubmitted=ref(false);

const errors=ref({
    email:'',
    name:'',
    password:'',
    phone:'',
    points:''
});




const addmember = async () => {


    errors.value.name='';
    errors.value.email='';
    errors.value.phone='';
    isSubmitted.value=true;

    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const mobileRegex = /^\d{10}$/;

    const uppercaseRegex = /[A-Z]/; 
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    

    if (form.value.member_password.length < 9 || !uppercaseRegex.test(form.value.member_password) || !specialCharRegex.test(form.value.member_password)) {
        errors.value.password = 'Invalid Password';
        return; 
    }
   
    if (!mobileRegex.test(form.value.member_phone)) { 
            errors.value.phone = 'Invalid mobile number. ';
            return;
          }    


    if (form.value.member_name.trim() === '' 
    || !nameRegex.test(form.value.member_name) 
    || /<script.*?>.*<\/script>/.test(form.value.member_name)) 
    {
        errors.value.name = 'Invalid name.'; 
        return;
         }

    if (!emailRegex.test(form.value.member_email)) {
        errors.value.email = 'Invalid email address'; 
        return;
        }
    

  try{        
    await  register_member(form.value);
      // console.log(res);
        await reloadRoute();

  }

  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    //console.error('Error:', errorMessage);
    errors.value.points = errorMessage;  
  }
};
</script>

<template>
  <div class="template_structure" >
    <h5 class="mb-4">Add Member</h5>
    <form @submit.prevent="addmember">
      <!-- Name Field -->
      <div class="mb-3">
        <label for="membername" class="form-label">Name</label>
        <input
          type="text"
          id="member_name"
          v-model="form.member_name"
          class="form-control"
          placeholder="Enter Member name"
        />
        <span v-if="isSubmitted && errors.name" class="text-danger">{{ errors.name }}</span>
      </div>

      <!-- Email Field -->
      <div class="mb-3">
        <label for="memberemail" class="form-label">Email</label>
        <input
          type="email"
          id="member_email"
          v-model="form.member_email"
          class="form-control"
          placeholder="Enter email address"
        />
        <span v-if="isSubmitted && errors.email" class="text-danger">{{ errors.email }}</span>
      </div>


      <div class="mb-3">
  <label for="memberphone" class="form-label">Phone</label>
  <div class="inline-elements">
    <select
      v-model="form.member_countryCode"
      class="form-control custom-inline" style="width: 150px !important;"
      id="member_countryCode"
      required
    >
      <option value="+91">India (+91)</option>
      <option value="+974" selected>Qatar (+974)</option>
    </select>
    <input
      type="text"
      id="member_phone" style="width: 340px !important;"
      v-model="form.member_phone"
      class="form-control custom-inline"
      placeholder="Enter Phone Number"
    />
  </div>
  <span v-if="isSubmitted && errors.phone" class="text-danger">{{ errors.phone }}</span>
</div>

      <!-- Password Field -->
      <div class="mb-3">
        <label for="memberpassword" class="form-label">Password</label>
        <input
          type="password"
          id="member_password"
          v-model="form.member_password"
          class="form-control"
          placeholder="Enter password"
        />
        <span v-if="isSubmitted && errors.password" class="text-danger">{{ errors.password }}</span>
      </div>


      

      <button type="submit" class="btn btn-primary">Add</button>
    </form>
    <span v-if="errors.points" class="text-danger">{{ errors.points }}</span>
     <h5 class="mb-2 mt-4">Members List</h5>
    <table class="table table-striped table-bordered">
      <thead class="table-dark">
        <tr>
          <th></th>
          <th> Name</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>unique Identifier</th>
          <th>created at</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(member,index) in memberData" :key="member.id">
            <td>{{ index+1 }}</td>
            
          <td>{{ member.name }}</td>
          <td>{{ member.email }}</td>
          <td>{{ member.phone_prefix }}{{ member.phone }}</td>
          <td>{{ member.unique_identifier }}</td>
          <td>{{ member.created_at }}</td>

        </tr>
      </tbody>
    </table> 
 </div>
</template>


<style scoped>
.inline-elements {
  display: flex;
  gap: 10px; /* Adjust gap as needed */
}

.custom-inline {
  display: inline-block;
  width: auto;
}
</style>
