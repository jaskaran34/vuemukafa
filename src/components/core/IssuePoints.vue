<script setup>
import { ref } from 'vue';
import login_code from '@/composables/auth.js';
const { findmember,addtransaction,member_tran_history } = login_code();



const history = ref([]);
 
const errors = ref({
  account: '',
  otp:'',
  order_no:'',
  order_amt:'',
  points:''
});

const member_account=ref({
  member_name:'',
  member_email:'',
  member_unique_identifier:'',
  member_phone:'',
  member_cardid:'',
  member_carduid:'',
  member_cardname:'',
   balance:'',
  pending_balance:''

});
const member = ref({});
const otp = ref(false);
const order = ref(false);
const transactions = ref(false);
const phone_no = ref('');
const ini = ref(true);

const find_member = async () => {

  errors.value.account='';
errors.value.otp='';
errors.value.order_no='';
errors.value.order_amt='';
errors.value.points='';


  try {
   
 let result = await findmember(document.getElementById('mukafa_account').value);
    member.value=result.member;
    member_account.value.member_cardid=result.card_id;
    member_account.value.member_carduid=result.cardUID;
    member_account.value.member_cardname=result.card_name;
    member_account.value.balance=result.points;
    member_account.value.pending_balance=result.pending_points;

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

  errors.value.account='';
errors.value.otp='';
errors.value.order_no='';
errors.value.order_amt='';
errors.value.points='';
 
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

const report=ref({
  order_amount:'',
  tran_id:'',
  display:false,
  transaction_status:'',
  type:'',
  status:''
});
const issue_points = async () => {


errors.value.account='';
errors.value.otp='';
errors.value.order_no='';
errors.value.order_amt='';
errors.value.points='';
 
  const value = document.getElementById('order_amt').value;
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



  try{
 let result=await addtransaction(value,order_number,member_account.value.member_unique_identifier,member_account.value.member_carduid);
 //console.log(result);
 otp.value=false;
 ini.value=false;
 order.value=false;
 history.value=await member_tran_history(member_account.value.member_unique_identifier);
 report.value.display=true;
 report.value.order_amount=result.points;
 report.value.tran_id=result.id;
 report.value.transaction_status=result.transaction_status;
 report.value.type=result.type;
 report.value.status=result.status;

 setTimeout(() => { 
    
    
   ini.value=true;
   report.value.display=false;
   }, 5000);  
  }catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    //console.error('Error:', errorMessage);
    errors.value.points = errorMessage;  
  }


 
};


//dummy staff id 250505074921472
//dummy card id 879-645-606-742

///partner/cards/879-645-606-742/628-950-523-259/transactions/purchases
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
            <th colspan="7" class="text-center">
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
            <th>Balance</th>
            <th>Pending Balance</th>
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
            <td>{{ member_account.balance }}</td>
            <td>{{ member_account.pending_balance }}</td>
            
        </tr>
    </tbody>
</table>

        
      </div>

    <form @submit.prevent="issue_points" class="mt-1">

      
    
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
        <label for="profilename" class="col-sm-2 col-form-label">Order Amount:</label>
        <div class="col-sm-10">
          <input
            type="text"
            id="order_amt"
            class="form-control"
          />
          <span v-if="errors.order_amt" class="text-danger">{{ errors.order_amt }}</span>
        </div>
      </div>
      <button type="submit" class="btn btn-success">Issue Points</button>

      

      
    </form>
    <span v-if="errors.points" class="text-danger">{{ errors.points }}</span>
  </div>


  <div v-if="report.display" class="profile-container mt-2">
    
    <div class="form-row mt-3">
      <table class="table table-bordered" style="max-width: 800px; margin: auto;">
        <thead>
          <tr>
      <th colspan="5">Transaction Details</th>
    </tr>  
    <tr>
      <th>Transaction Id</th>
      <th>Type</th>
      <th>Status</th>
      <th>Points Issued</th>
      <th>Transaction Status</th>
    </tr>
    </thead>
    
    
    <tbody>
      <tr>
      <td>{{ report.tran_id }}</td>
      <td>{{ report.type }}</td>
      <td>{{ report.status}}</td>
      <td>{{ report.order_amount }}</td>
      <td>{{ report.transaction_status }}</td>
      
    </tr>
    </tbody>
   </table>
        
      </div>

  </div>



  <div v-if="transactions" class="profile-container mt-2">
    
    <div class="form-row mt-3">
      <table class="table table-bordered" style="max-width: 700px;">
        <thead>
        <tr>
          <th colspan="9" style="text-align: center;">Recent History</th>
    </tr>
        <tr>
          <th>Transaction ID</th>
          <th>Order ID</th>
          <th>Type</th>
          <th>Purchase Amount</th>
          <th>Points</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Staff</th>
          <th>Card</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="history in history" :key="history.id">
          <td>{{ history.id }}</td>
          <td> {{ history.note ? history.note : (history.event === 'initial_bonus_points' ? 'Sign Up Bonus' : history.event) }}</td>
          <td>{{ history.type }}</td>
          <td>{{ history.purchase_amount }}</td>
          <td>{{ history.points }}</td>
          <td>{{ history.status }}</td>
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
</style>
