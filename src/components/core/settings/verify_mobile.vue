<script setup>
import {ref} from 'vue';
import login_code from '@/composables/auth.js';
let order=ref(false);
const { search_member } = login_code();



const errors = ref({
  mobile: '',
  country_code:''
});

let profileuser = ref({
    phone: '', 
    phone_prefix:  '+974', 
});

const member_account=ref({});


const find_member = async () => {
    order.value=false;
    errors.value.mobile='';
    errors.value.mobile='';
  try {
    let result = await search_member(profileuser.value.phone,profileuser.value.phone_prefix);
    
    order.value=true;
    member_account.value=result;
  } catch (error) {
    order.value=false;
    errors.value.mobile = 'No member exists with the provided mobile number.';  
  }
};

</script>
<template>
   
    <div  class="profile-container mt-3">
      <form @submit.prevent="find_member">
        <div class="form-row mb-3">
          <label for="profilename" class="col-sm-2 col-form-label">Country Code:</label>
          <div class="col-sm-10">
  
        <select
            v-model="profileuser.phone_prefix"
            class="form-control"
            id="countryCode"
            required
          >
            <option value="" disabled selected>Select Country Code</option>
            <option value="+91" :selected="profileuser.phone_prefix === '+91'">India (+91)</option>
            <option value="+974" :selected="profileuser.phone_prefix === '+974'">Qatar (+974)</option>
          </select>
          <span v-if="errors.mobile" class="text-danger">{{ errors.country_code }}</span>
          </div>
        </div>
  
        <div class="form-row mb-3">
          <label for="profilename" class="col-sm-2 col-form-label">Mobile:</label>
          <div class="col-sm-10">
  
            <input
            v-model="profileuser.phone"
              type="text"
              id="mobile"
              class="form-control"
            />
            <span v-if="errors.mobile" class="text-danger">{{ errors.mobile }}</span>
          </div>
        </div>
        <button type="submit" id="enterbtn" class="btn btn-primary">Enter</button>
        
      </form>
    </div>
  
    <div v-if="order" class="profile-container mt-2">
    
    <div class="form-row mb-3">
        <table class="table table-bordered" style="max-width: 1200px; margin: auto;">
    <thead>
        <!-- Title Row -->
        <tr class="bg-primary text-white">
            <th colspan="9" class="text-center">
                Account Details
            </th>
        </tr>
        <!-- Column Header Row -->
        <tr class="bg-light text-dark">
            <th>Name</th>
            <th>Email</th>
            <th>Mukafa No.</th>
            <th>Phone</th>
            <th>Birthday</th>
            <th>Created</th>
            <th>Last updated</th>
            <th>Balance</th>
            <th>Pending Points</th>
            
        </tr>
    </thead>
    <tbody>
        <!-- Data Row -->
        <tr>
            <td>{{ member_account.name }}</td>
            <td>{{ member_account.email }}</td>
            <td>{{ member_account.mukafa_number }}</td>
            <td>{{ member_account.phone }}</td>
            <td>{{ member_account.birthday }}</td>
            <td>{{ member_account.created_at }}</td>
            <td>{{ member_account.updated_at }}</td>
            <td>{{ member_account.balance }}</td>
            <td>{{ member_account.pending_points }}</td>
        </tr>
    </tbody>
</table>

      </div>
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
.label_points{
    color: red;
}
</style>