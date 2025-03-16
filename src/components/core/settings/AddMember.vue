<script setup>
import { ref,onMounted, computed,watch } from 'vue';
import login_code from '@/composables/auth.js';
const { register_member,all_members,sendotp,verify_otp_backend } = login_code();
import { v4 as uuidv4 } from 'uuid';

import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

import { useAuthStore } from '@/store/authStore';
const authStore = useAuthStore();

const memberData = ref([]);
const otp = ref(false);
let timeout = null;
const reset_page_setting=ref(true);

const pagination = ref({
  current_page: 1,
  last_page: 1,
  prev_page_url: null,
  next_page_url: null,
});
const recordsPerPage = ref(10);

const mobile = ref("");
const mukafa_no = ref("");


watch([mobile, mukafa_no], () => {
  //alert(search_id);
clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetchTransactions();
  }, 1000); // 1 second delay after inactivity
});

const fetchTransactions = async (pageurl = null) => {

  if(reset_page_setting.value){
    pagination.value.current_page=1;
   // alert('changed');
  }

 // console.log(pageurl);
  const params = new URLSearchParams({
    page: pagination.value.current_page,
    mukafa_no:mukafa_no.value,
    mobile:mobile.value,
    per_page: recordsPerPage.value,
  });


  let result=await all_members(pageurl,params);

  
    //
    memberData.value = result.data; 
    //console.log(result.value);

    pagination.value = {
      current_page: result.pagination.current_page,
      last_page: result.pagination.last_page,
      prev_page_url: result.pagination.prev_page_url,
      next_page_url: result.pagination.next_page_url,
    };
    
}

onMounted(async()=>{

  if (authStore.token) {
    
    fetchTransactions();
    
  } else {
    //console.log('22');
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
  member_countryCode:'+974',
  member_dob:'',
  member_ad:''
});

const todayDate = computed(() => new Date().toISOString().split('T')[0]);

let isSubmitted=ref(false);

const errors=ref({
    email:'',
    name:'',
    password:'',
    phone:'',
    points:'',
    dob:'',
    otp:''
});

const verify_otp = async () => {

  errors.value.name='';
    errors.value.email='';
    errors.value.phone='';
    errors.value.dob='';
    errors.value.password='';
    errors.value.otp='';
    

try{
let otp_conf=await verify_otp_backend(document.getElementById('otp_message_id').value,
                        null,
                        'register_customer',
                        document.getElementById('otp_val').value);

                      

  if(otp_conf=='ok'){
  
    await  register_member(form.value);
      // console.log(res);
        await reloadRoute();
  }
  else{
    errors.value.otp='Invalid Otp';
  }

}
catch(error){
  errors.value.otp='Invalid Otp';
}
  
  
};


const addmember = async () => {


    errors.value.name='';
    errors.value.email='';
    errors.value.phone='';
    errors.value.dob='';
    errors.value.password='';
    errors.value.otp='';
    otp.value=false;
    isSubmitted.value=true;

    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const mobileRegex = /^\d{8,10}$/;

    /*
    const uppercaseRegex = /[A-Z]/; 
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    

    if (form.value.member_password.length < 9 || !uppercaseRegex.test(form.value.member_password) || !specialCharRegex.test(form.value.member_password)) {
        errors.value.password = 'Invalid Password';
        return; 
    }
   */
  
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

         if (form.value.member_email && !emailRegex.test(form.value.member_email)) {
            errors.value.email = 'Invalid email address';
            return;
       }

    

    if (!form.value.member_dob) {
    errors.value.dob = 'Date of birth cannot be empty.';
    return;
  }

  const birthDate = new Date(form.value.member_dob);
  const today = new Date();

  if (birthDate > today) {
    errors.value.dob = 'Date of birth cannot be in the future.';
    return;
  }    

  let otp_message_id=uuidv4();
    document.getElementById('otp_message_id').value=otp_message_id;
   
        await sendotp(otp_message_id,form.value.member_countryCode+'-'+form.value.member_phone,'register_customer');
    
    otp.value = true;

  otp.value=true;
  
};
</script>

<template>
   <input type="hidden" value="" id="otp_message_id">
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
<!-- 
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
-->
      <div class="mb-3">
        <label for="memberbirthday" class="form-label">Birth Date</label>
        <input
          type="date"
          id="member_dob"
          :max="todayDate"
          v-model="form.member_dob"
          class="form-control"
        />
        <span v-if="isSubmitted && errors.dob" class="text-danger">{{ errors.dob }}</span>
      </div>

      <div class="mb-3">
        <label for="memberbirthday" class="form-label">Anniversary Date</label>
        <input
          type="date"
          id="member_ad"
          v-model="form.member_ad"
          class="form-control"
        />
        
      </div>

      

      <button type="submit" class="btn btn-primary">Add</button>
    </form>
    <div v-if="otp">
      <div class="mb-3">
        <label for="memberbirthday" class="form-label">Enter Otp (Sent to {{ form.member_countryCode + form.member_phone }})</label>
        <input
          type="text"
          id="otp_val"
          class="form-control"
        />

        <button type="button" class="btn btn-success mt-1" @click="verify_otp">Submit</button>
        <span v-if="isSubmitted && errors.otp" class="text-danger">{{ errors.otp }}</span>
      </div>
      
    </div>
    <span v-if="errors.points" class="text-danger">{{ errors.points }}</span>
     <h5 class="mb-2 mt-4">Members List</h5>
    <table class="table table-striped table-bordered" >
      <thead class="table-dark">
        <tr>
          <th colspan="5">
          <label style="float: left;font-size: large;">Filter Results:</label>  
        <input style="float: left;margin-left: 5px;" type="text"  v-model="mobile" placeholder="By Mobile" >
        <input  style="float: left;" type="text"  v-model="mukafa_no" placeholder="By Mukafa No" >

      </th>
      
      <th colspan="6" class="text-end">
        <div class="d-flex justify-content-end align-items-center">
          <button
            class="btn btn-light me-1"
            :disabled="!pagination.prev_page_url"
            @click="fetchTransactions(pagination.prev_page_url)"
          >
            &lt;
          </button>
          <span class="mx-2">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
          <button
            class="btn btn-light ms-1"
            :disabled="!pagination.next_page_url"
            @click="fetchTransactions(pagination.next_page_url)"
          >
            &gt;
          </button>
          
          <select
            class="form-select ms-3"
            style="width: auto;"
            v-model="recordsPerPage"
            @change="fetchTransactions()"
          >
            <option value="10">10 Records</option>
            <option value="25">25 Records</option>
            <option value="50">50 Records</option>
          </select>
          
        </div>
      </th>
    </tr>
        <tr>
          <th></th>
          <th> Name</th>
          
          <th>Mobile</th>
          <th>Mukafa No.</th>
          <th>Email</th>
          <th>Birthday</th>
          <th>Card</th>
          <th>Card UID</th>
          <th>Balance</th>
          <th>Pending</th>
          <th>created at</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(member,index) in memberData" :key="member.id">
            <td>{{ index+1 }}</td>
            
          <td>{{ member.name }}</td>
          
          <td>{{ member.phone_prefix }}{{ member.phone }}</td>
          <td>{{ member.mukafa_number }}</td>
          <td>{{ member.email }}</td>
          <td>{{ member.birthday }}</td>

          <td>{{ member.card_name }}</td>
          <td>{{ member.card_uid }}</td>
          <td>{{ member.balance }}</td>
          <td>{{ member.balance_pending }}</td>

          <td>{{ member.createddate }}</td>

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
