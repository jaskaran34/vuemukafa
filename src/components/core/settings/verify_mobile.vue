<script setup>
import {ref} from 'vue';
import login_code from '@/composables/auth.js';
let order=ref(false);
const { search_member } = login_code();



const errors = ref({
  mobile: ''
});

const member_account=ref({});


const find_member = async () => {
    order.value=false;
  try {
    let result = await search_member(document.getElementById('mobile').value);
    console.log(result);
    order.value=true;
    member_account.value=result;
  } catch (error) {
    order.value=false;
    errors.value.mobile = 'No member exists with the provided mobile number. Make sure you pass the country code also with the mobile number';  
  }
};

</script>
<template>
   
    <div  class="profile-container mt-3">
      <form @submit.prevent="find_member">
        <div class="form-row mb-3">
          <label for="profilename" class="col-sm-2 col-form-label">Mobile:</label>
          <div class="col-sm-10">
  
            <input
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
            <th colspan="7" class="text-center">
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