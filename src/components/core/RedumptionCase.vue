<script setup>
import { ref } from 'vue';
import login_code from '@/composables/auth.js';
const { findmember,member_tran_history } = login_code();

const history = ref([]);
const ini = ref(true);
const member = ref({});
const phone_no = ref('');
const otp = ref(false);
const order= ref(false);
const transactions = ref(false);


const errors = ref({
  account: '',
  mukafa_points:'',
  otp:'',
  order_no:''
});

const member_account=ref({
  member_name:'',
  member_email:'',
  member_unique_identifier:'',
  member_phone:'',
  member_points:'',
  member_redeem_amt:'',
  member_currency:'',
  member_cardid:'',
  member_carduid:'',
  member_cardname:''

});

const find_member = async () => {
  try {
    let result = await findmember(document.getElementById('mukafa_account').value);

    member.value=result.member;
    member_account.value.member_cardid=result.card_id;
    member_account.value.member_carduid=result.cardUID;
    member_account.value.member_cardname=result.card_name;
    member_account.value.member_points=result.points;
    member_account.value.member_redeem_amt=result.amount;
    member_account.value.member_currency=result.currency;
    phone_no.value = member.value.phone;
    
    member_account.value.member_name=member.value.name;
    member_account.value.member_email=member.value.email;
    member_account.value.member_unique_identifier=member.value.unique_identifier;
    member_account.value.member_phone=member.value.phone;

    transactions.value=false;
    otp.value = true;
   // console.log(member.value.phone);
  } catch (error) {
    errors.value.account = 'An error occurred while fetching member data.';  
  }
};

const verify_otp = async () => {
 
 if(document.getElementById('otp').value=='1234'){
 
   otp.value = false;
   ini.value=false;
   history.value=await member_tran_history(member_account.value.member_unique_identifier);
   order.value=true;
   transactions.value=true;

 }
 else{
   errors.value.otp='Invalid Otp';
 }

 
 
};

const redeem_points = async () => {
    const value = document.getElementById('mukafa_points').value;
const order_number=document.getElementById('order_no').value;
  // Regular expression to check for a positive integer or float
  const regex = /^(?!0\d)(?:\d+|\d*\.\d+)$/;
  const numberRegex = /^[a-zA-Z0-9-/]+$/;

  if (!regex.test(value) || parseFloat(value) <= 0)
   { 
    errors.value.order_amt = 'Invalid Order Amount';
    return false;
   }

   if (!order_number || !numberRegex.test(order_number)) { 
    errors.value.order_no = 'Invalid Order Number';
    return false; 
    }



}

</script>
<template>
    <div v-if="ini" class="profile-container mt-3">
      <form @submit.prevent="find_member">
        <div class="form-row mb-3">
          <label for="profilename" class="col-sm-2 col-form-label">Mukafa Account:</label>
          <div class="col-sm-10">
  
            <input
              type="text"
              id="mukafa_account"
              class="form-control"
            />
            <span v-if="errors.account" class="text-danger">{{ errors.account }}</span>
          </div>
        </div>
        <button type="submit" id="enterbtn" class="btn btn-primary">Enter</button>
        
      </form>
    </div>
    <div v-if="otp" class="profile-container mt-2">
    <form @submit.prevent="verify_otp">
      <div class="form-row mb-3">

        <p>Otp Sent to: {{ phone_no }} </p>

        
      </div>
      <div class="form-row mb-3">
        <label for="profilename" class="col-sm-2 col-form-label">Enter Otp:</label>
        <div class="col-sm-10">
          <input
          value="1234"
            type="text"
            id="otp"
            class="form-control"
          />
          <span v-if="errors.otp" class="text-danger">{{ errors.otp }}</span>
        </div>
      </div>
      <button type="submit" class="btn btn-info">Verify</button>

      
    </form>
  </div>

  <div v-if="order" class="profile-container mt-2">
    
    <div class="form-row mb-3">
        <table class="table table-bordered" style="max-width: 800px; margin: auto;">
    <thead>
        <!-- Title Row -->
        <tr class="bg-primary text-white">
            <th colspan="5" class="text-center">
                Account Details
            </th>
        </tr>
        <!-- Column Header Row -->
        <tr class="bg-light text-dark">
            <th>Name</th>
            <th>Email</th>
            <th>Unique Identifier</th>
            <th>Phone</th>
            <th>Card</th>
        </tr>
    </thead>
    <tbody>
        <!-- Data Row -->
        <tr>
            <td>{{ member_account.member_name }}</td>
            <td>{{ member_account.member_email }}</td>
            <td>{{ member_account.member_unique_identifier }}</td>
            <td>{{ member_account.member_phone }}</td>
            <td>{{ member_account.member_cardname }}</td>
        </tr>
    </tbody>
</table>

      </div>

    <form @submit.prevent="redeem_points">

      
    
      <div class="form-row mb-3">
        <label for="profilename" class="col-sm-2 col-form-label">Order Number:</label>
        <div class="col-sm-10">
          <input
            type="text"
            id="order_no"
            class="form-control"
          />
          <span v-if="errors.order_no" class="text-danger">{{ errors.order_no }}</span>
        </div>
      </div>

      <div class="form-row mb-3">
        <label for="Points" class="col-sm-6 col-form-label label_points" >
          Available Points  {{ member_account.member_points }} | {{ member_account.member_redeem_amt }}  {{ member_account.member_currency }}
        </label>
    
      </div>

      <div class="form-row mb-3">
        <label for="profilename" class="col-sm-2 col-form-label">Mukafa points:</label>
        <div class="col-sm-10">
          <input
            type="text"
            id="mukafa_points"
            class="form-control"
          />
          <span v-if="errors.mukafa_points" class="text-danger">{{ errors.mukafa_points }}</span>
        </div>
      </div>
      <button type="submit" class="btn btn-success">Redeem</button>

      

      
    </form>
    <span v-if="errors.points" class="text-danger">{{ errors.points }}</span>
  </div>


  <div v-if="transactions" class="profile-container mt-2">
    
    <div class="form-row mt-3">
      <table class="table table-bordered" style="max-width: 800px; margin: auto;">
        <thead>
        <tr>
          <th colspan="7" style="text-align: center;">Recent History</th>
    </tr>
        <tr>
          <th>Transaction ID</th>
          <th>Order ID</th>
          <th>Purchase Amount</th>
          <th>Points</th>
          <th>Created At</th>
          <th>Staff</th>
          <th>Card</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="history in history" :key="history.id">
          <td>{{ history.id }}</td>
          <td>{{ history.note }}</td>
          <td>{{ history.purchase_amount }}</td>
          <td>{{ history.points }}</td>
          <td>{{ history.created_at }}</td>
          <td>{{ history.staff?.email || 'N/A' }}</td>
          <td>{{ history.card?.name || 'N/A' }}</td>
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