<script setup>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import login_code from '@/composables/auth.js';
const { findmember,member_tran_history,redeempoints,sendotp,verify_otp_backend } = login_code();

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
  order_no:'',
  points:''
});
const report=ref({
  order_amount:'',
  tran_id:'',
  display:false,
  transaction_status:'',
  type:''
});

const member_account=ref({
  member_name:'',
  member_email:'',
  member_unique_identifier:'',
  member_phone:'',
  member_points:'',
  member_redeem_amt:'',
  member_currency:'',
  member_carduid:'',
  member_cardname:'',
   balance:'',
  pending_balance:''
  

});

const find_member = async () => {
  try {
    let result = await findmember(document.getElementById('mukafa_account').value);

    member.value=result.member;
    member_account.value.member_carduid=result.cardUID;
    member_account.value.member_cardname=result.card_name;
    member_account.value.member_points=result.balance;
    member_account.value.member_redeem_amt=result.amount;
    member_account.value.member_currency=result.currency;

    member_account.value.balance=result.balance;
    member_account.value.pending_balance=result.pending_points;

    phone_no.value = member.value.phone;
    
    member_account.value.member_name=member.value.name;
    member_account.value.member_email=member.value.email;
    member_account.value.member_unique_identifier=member.value.mukafa_number;
    member_account.value.member_phone=member.value.phone;

    transactions.value=false;


    let otp_message_id=uuidv4();
    document.getElementById('otp_message_id').value=otp_message_id;
   
    await sendotp(otp_message_id,member_account.value.member_unique_identifier,'redeem');

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
                        'redeem',
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

function resetErrors() {
    Object.keys(errors.value).forEach(key => {
        errors.value[key] = null;
    });
}


const redeem_points = async () => {

    resetErrors();

    const value = document.getElementById('mukafa_points').value;
const order_number=document.getElementById('order_no').value;
  // Regular expression to check for a positive integer or float
  const regex = /^[1-9]\d*$/;
  const numberRegex = /^[a-zA-Z0-9-/]+$/;

  if (!regex.test(value) || parseFloat(value) <= 0)
   { 
    errors.value.mukafa_points = 'Invalid Mukafa Amount. Enter Postive Integers less than or equal to ' + member_account.value.member_redeem_amt;
    return false;
   }

   if (!order_number || !numberRegex.test(order_number)) { 
    errors.value.order_no = 'Invalid Order Number';
    return false; 
    }

    if(parseInt(member_account.value.member_redeem_amt, 10)<1){
        errors.value.mukafa_points = 'Low Balance.:' + member_account.value.member_redeem_amt;
        return false; 
    }

    if(parseInt(value, 10)>parseInt(member_account.value.member_redeem_amt, 10)){
        errors.value.mukafa_points = 'Invalid Mukafa Amount. Enter Postive Integers less than or equal to ' + member_account.value.member_redeem_amt;
        return false;
    } 


    try{
 let result=await redeempoints(value,order_number,member_account.value.member_unique_identifier,member_account.value.member_carduid);
 //console.log(result);
 otp.value=false;
 ini.value=false;
 order.value=false;
 history.value=await member_tran_history(member_account.value.member_unique_identifier);
 report.value.display=true;
 report.value.order_amount=result.mukafa_points;
 report.value.tran_id=result.id;

 report.value.type=result.type;
 

 

 setTimeout(() => { 
    
    
   ini.value=true;
   report.value.display=false;
   }, 5000);  
  }catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    //console.error('Error:', errorMessage);
    errors.value.points = errorMessage;  
  }


}

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
        <label for="profilename" class="col-sm-2 col-form-label">Amount:</label>
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

  
  <div v-if="report.display" class="profile-container mt-2">
    
    <div class="form-row mt-3">
      <table class="table table-bordered" style="max-width: 800px; margin: auto;">
        <thead>
          <tr>
      <th colspan="4">Transaction Details</th>
    </tr>  
    <tr>
      <th>Transaction Id</th>
      <th>Type</th>
      <th>Purchase Redeemed</th>
    </tr>
    </thead>
    
    
    <tbody>
      <tr>
      <td>{{ report.tran_id }}</td>
      <td>{{ report.type }}</td>
      <td>{{ report.order_amount }}</td>
     

      
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
.label_points{
    color: red;
}
</style>