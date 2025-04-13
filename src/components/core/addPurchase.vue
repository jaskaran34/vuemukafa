<script setup>
import { ref,watch } from 'vue';
import login_code from '@/composables/auth.js';
const { findmember,addtransaction,redeempoints,member_tran_history,sendotp,verify_otp_backend } = login_code();
import { v4 as uuidv4 } from 'uuid';

import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const loadingPurchase = ref(true);

const input_order_amt=ref(0);
const input_redeem_amt=ref(0);
const input_final_order_amt=ref(0);

const reloadRoute = async() => {
   const currentRoute = { name: route.name, query: route.query, params: route.params, };
    router.push({ name: 'reload', query: { targetRoute: JSON.stringify(currentRoute) } }); 
  };

const errors = ref({
  account: '',
  otp:'',
  order_no:'',
  order_amt:'',
  mukafa_points:'',
  final_order_amt:'',
  error_api:''
});

watch([input_order_amt, input_redeem_amt], () => {
  const orderAmt = Number(input_order_amt.value);
  const redeemAmt = Number(input_redeem_amt.value);

  let valid = true;

  // Validate input_order_amt
  if (orderAmt < 0 || isNaN(orderAmt)) {
    errors.value.order_amt = 'Order amount must be positive';
    valid = false;
  } else {
    errors.value.order_amt = '';
  }



  if (redeemAmt < 0 || isNaN(redeemAmt) || !Number.isInteger(redeemAmt) || redeemAmt > member_account.value.member_redeem_amt) {
    errors.value.mukafa_points = 'Redeem amount must be a non-negative integer and less than or equal to Balance '+ member_account.value.member_redeem_amt;
    valid = false;
  } else {
    errors.value.mukafa_points = '';
  }

  // If both inputs are valid
  if (valid) {
    input_final_order_amt.value = orderAmt - redeemAmt;

    if (input_final_order_amt.value > 0) {
      loadingPurchase.value = false; 
      errors.value.final_order_amt = '';
    } else {
      errors.value.final_order_amt = 'Final order amount must be greater than zero';
      loadingPurchase.value = true; 
    }
  } else {
    input_final_order_amt.value = 0;
    errors.value.final_order_amt = 'Fix input errors to proceed';
    loadingPurchase.value = true; 
  }
});

const history = ref([]);
 


const member_account=ref({
  member_name:'',
  member_email:'',
  member_unique_identifier:'',
  member_phone:'',
  member_points:'',
  member_carduid:'',
  member_cardname:'',
   balance:'',
  pending_balance:'',
  member_redeem_amt:'',
  member_currency:'',

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
    member_account.value.member_carduid=result.cardUID;
    member_account.value.member_cardname=result.card_name;
    member_account.value.balance=result.balance;
    member_account.value.member_points=result.balance;
    member_account.value.member_redeem_amt=result.amount;
    member_account.value.member_currency=result.currency;
    member_account.value.pending_balance=result.pending_points;

    phone_no.value = member.value.phone;
    
    member_account.value.member_name=member.value.name;
    member_account.value.member_email=member.value.email;
    member_account.value.member_unique_identifier=member.value.mukafa_number;
    member_account.value.member_phone=member.value.phone;

    transactions.value=false;

    let otp_message_id=uuidv4();
    document.getElementById('otp_message_id').value=otp_message_id;
   
        await sendotp(otp_message_id,member_account.value.member_unique_identifier,'issue');
    
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
 

try{
let otp_conf=await verify_otp_backend(document.getElementById('otp_message_id').value,
                          member_account.value.member_unique_identifier,
                          'issue',
                          document.getElementById('otp').value);

                        

    if(otp_conf=='ok'){
    
      otp.value = false;
     ini.value=false;
      history.value=await member_tran_history(member_account.value.member_unique_identifier);
      order.value=true;
      transactions.value=true;

    }
    else{
      errors.value.otp='Invalid Otp';
    }

  }
  catch(error){
    errors.value.otp='Invalid Otp';
  }
    
    
};

const report=ref({
  order_amount:'',
  tran_id:'',
  display:false,
  transaction_status:'',
  type:'',
  status:'',
  redeem_points:'',
  order_id:''
});
const issue_points = async () => {

  loadingPurchase.value = true; 
      const value_redeem = document.getElementById('mukafa_points').value;

    const regex_redeem = /^[1-9]\d*$/;
    if(value_redeem > 0){

    if (!regex_redeem.test(value_redeem) || parseFloat(value_redeem) <= 0)
   { 
    errors.value.mukafa_points = 'Invalid Mukafa Amount. Enter Postive Integers less than or equal to ' + member_account.value.member_redeem_amt;
    loadingPurchase.value = false; 
    return false;
   }
    }


   

    if(parseInt(value_redeem, 10)>parseInt(member_account.value.member_redeem_amt, 10)){
        errors.value.mukafa_points = 'Invalid Mukafa Amount. Enter Postive Integers less than or equal to ' + member_account.value.member_redeem_amt;
        return false;
    } 


errors.value.account='';
errors.value.otp='';
errors.value.order_no='';
errors.value.order_amt='';
errors.value.points='';
 
  const value = document.getElementById('final_order_amt').value;
const order_number=document.getElementById('order_no').value;
  // Regular expression to check for a positive integer or float
  const regex = /^(?!0\d)(?:\d+|\d*\.\d+)$/;
  const numberRegex = /^[a-zA-Z0-9-/]+$/;

  if (!regex.test(value) || parseFloat(value) <= 0)
   { 
    errors.value.final_order_amt = 'Invalid Order Amount';
    loadingPurchase.value = false; 
    return false;
   }

   if (!order_number || !numberRegex.test(order_number)) { 
    errors.value.order_no = 'Invalid Order Number';
    loadingPurchase.value = false; 
    return false; 
    }

if(value<=0){
  errors.value.order_amt = 'Invalid Order Amount';
  loadingPurchase.value = false; 
  return false;
}

  try{
 let result=await addtransaction(value,order_number,member_account.value.member_unique_identifier,member_account.value.member_carduid);
 //console.log(result);
  let result_tran;
 if(value_redeem>0){
     result_tran=await redeempoints(value_redeem,order_number,member_account.value.member_unique_identifier,member_account.value.member_carduid);
//console.log(result_tran);
 }
 otp.value=false;
 ini.value=false;
 order.value=false;
 history.value=await member_tran_history(member_account.value.member_unique_identifier);
 report.value.display=true;
 report.value.order_amount=result.mukafa_points;
 report.value.order_id=result.order_id;
 report.value.transaction_status=result.transaction_status;
 report.value.type=result.type;
 report.value.status=result.status;
 report.value.redeem_points = (result_tran && result_tran.mukafa_points)  ? result_tran.mukafa_points: 0;



 

 setTimeout(() => { 
    
    
   ini.value=true;
   report.value.display=false;
   //loadingPurchase.value = false; 
   reloadRoute();
   
   }, 5000);  
    
  }catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', errorMessage);
    errors.value.error_api = errorMessage;  
    loadingPurchase.value = false; 
  }


 
};


//dummy staff id 250505074921472
//dummy card id 879-645-606-742

///partner/cards/879-645-606-742/628-950-523-259/transactions/purchases
</script>

<template>
  
  <input type="hidden" value="" id="otp_message_id">
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
<!--
  <div v-if="recent_partner" class="profile-container mt-3">
    

    <h1>hfd</h1>

  </div>
-->
  <div v-if="otp" class="profile-container mt-2">
    <form @submit.prevent="verify_otp">
      <div class="form-row mb-3">

        <p>Otp Sent to: {{ phone_no }} </p>

        
      </div>
      <div class="form-row mb-3">
        <label for="profilename" class="col-sm-2 col-form-label">Enter Otp:</label>
        <div class="col-sm-10">
          <input
          value=""
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
            <th>Mukafa No.</th>
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
            v-model="input_order_amt"
            class="form-control"
          />
          <span v-if="errors.order_amt" class="text-danger">{{ errors.order_amt }}</span>
        </div>
      </div>
      <div class="form-row mb-3">
        <label for="Points" class="col-sm-6 col-form-label label_points" >
          Available Points  {{ member_account.member_points }} | {{ member_account.member_redeem_amt }}  {{ member_account.member_currency }}
        </label>
    
      </div>

      <div class="form-row mb-3">
        <label for="profilename" class="col-sm-2 col-form-label">Redemption Amount:</label>
        <div class="col-sm-10">
          <input
            type="text"
            id="mukafa_points"
            v-model="input_redeem_amt"
            class="form-control"
          />
          <span v-if="errors.mukafa_points" class="text-danger">{{ errors.mukafa_points }}</span>
        </div>
      </div>

      <div class="form-row mb-3">
        <label for="profilename" class="col-sm-2 col-form-label">Final Order Amt:</label>
        <div class="col-sm-10">
          <input
            type="text"
            id="final_order_amt"
            v-model="input_final_order_amt"
            class="form-control"
            readonly
            
          />
          <span v-if="errors.final_order_amt" class="text-danger">{{ errors.final_order_amt }}</span>
        </div>
      </div>
      <button 
  type="submit" 
  class="btn btn-success" 
  :disabled="loadingPurchase"
>
 Add Purchase
</button>
      
    </form>
    <span v-if="errors.error_api" class="text-danger">{{ errors.error_api }}</span>
  </div>


  <div v-if="report.display" class="profile-container mt-2">
    
    <div class="form-row mt-3">
      <table class="table table-bordered" style="max-width: 800px; margin: auto;">
        <thead>
          <tr>
      <th colspan="5">Transaction Details</th>
    </tr>  
    <tr>
      <th>Order Id</th>
      <th>Type</th>
      <th>Status</th>
      <th>Points Issued</th>
      <th>Points Redeemed</th>
    </tr>
    </thead>
    
    
    <tbody>
      <tr>
      <td>{{ report.order_id }}</td>
      <td>{{ report.type }}</td>
      <td>{{ report.status}}</td>
      <td>{{ report.order_amount }}</td>
      <td>{{ report.redeem_points }}</td>
      
      
    </tr>
    </tbody>
   </table>
        
      </div>

  </div>



  <div v-if="transactions" class="profile-container mt-2">
    
    <div class="form-row mt-3">
      <table class="table table-bordered" style="overflow-x: auto;">
        <thead>
        <tr>
          <th colspan="11" style="text-align: center;">Recent History</th>
    </tr>
        <tr>
          <th>S.no</th>
          <th>Date</th>
          <th>Transaction ID</th>
          <th>Order ID</th>
          <th>Description</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Points</th>
          <th>Status</th>
          
          
          <th>Card</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(history,index_id) in history" :key="history.id">
          <td>{{ index_id + 1 }}</td>
          <td class="no-wrap">{{ history.created_date }}</td>
          <td>{{ history.id }}</td>
          <td> {{ history.order_id ? history.order_id : (history.event === 'initial_bonus_points' ? 'Sign Up Bonus' : history.event) }}</td>
          <td>{{ history.remarks }}</td>
          <td>{{ history.type }}</td>
          <td class="amt">{{ history.purchase_amount }}</td>
          <td class="amt">{{ history.mukafa_points }}</td>
          <td>{{ history.status }}</td>
          
          <td class="no-wrap">{{ history.card_name || 'N/A' }}</td>
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
.no-wrap {
  white-space: nowrap;
}
.label_points{
    color: red;
}
</style>
