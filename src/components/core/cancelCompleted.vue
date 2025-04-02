<script setup>
import { ref } from 'vue';
import login_code from '@/composables/auth.js';
const { findtransaction,sendotp,verify_otp_backend,cancel_completed_transaction } = login_code();
import { v4 as uuidv4 } from 'uuid';


 
const errors = ref({
  tranid: '',
  otp:'',
  order_no:'',
  order_amt:'',
  points:''
});


const foundtransaction = ref({});
const otp = ref(false);
const order = ref(false);
const transactions = ref(false);

const ini = ref(true);

const cancel_tran= async(tran)=>{
    let result = await cancel_completed_transaction(tran);
    console.log(result);
}

const find_transaction = async () => {

errors.value.tranid='';
errors.value.otp='';
errors.value.order_no='';
errors.value.order_amt='';
errors.value.points='';


  try {
   
    let result = await findtransaction(document.getElementById('tranid').value);
    
    
    foundtransaction.value=result;
    
    //console.log(foundtransaction.value.mukafa_number);

    let otp_message_id=uuidv4();
    document.getElementById('otp_message_id').value=otp_message_id;
   
        await sendotp(otp_message_id,foundtransaction.value.mukafa_number,'issue');
    
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
                          foundtransaction.value.mukafa_number,
                          'issue',
                          document.getElementById('otp').value);

                        

    if(otp_conf=='ok'){
    
      otp.value = false;
     ini.value=false;
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
  status:''
});


//dummy staff id 250505074921472
//dummy card id 879-645-606-742

///partner/cards/879-645-606-742/628-950-523-259/transactions/purchases
</script>

<template>
  
  <input type="hidden" value="" id="otp_message_id">
  <div v-if="ini" class="profile-container mt-3">
    

    <form @submit.prevent="find_transaction">
      <div class="form-row mb-3">
        <label for="profilename" class="col-sm-2 col-form-label">Enter Transaction Id:</label>
        <div class="col-sm-10">

          <input
            type="text"
            id="tranid"
            class="form-control"
          />
          <span v-if="errors.tranid" class="text-danger">{{ errors.tranid }}</span>
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

        <p>Otp Sent to: {{ foundtransaction.phone }} </p>

        
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
    </tr>
    </thead>
    
    
    <tbody>
      <tr>
      <td>{{ report.tran_id }}</td>
      <td>{{ report.type }}</td>
      <td>{{ report.status}}</td>
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
          <th colspan="11" style="text-align: center;">Transaction Details</th>
    </tr>
        <tr>
        
          <th>Customer Name</th>
          <th>Transaction ID</th>
          <th>Order ID</th>
          <th>Mukafa No.</th>
          <th>Amount</th>
          <th>Points</th>
          <th>Card</th>
          <th>Date</th>
          <th>Customer Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr>
           
         
        <td> {{ foundtransaction.customer_name }} </td>
          <td>{{ foundtransaction.tranid }}</td>
          <td> {{ foundtransaction.order_id }} </td>
          <td> {{ foundtransaction.mukafa_number }} </td>
          <td class="amt">{{ foundtransaction.purchase_amount }}</td>
          <td class="amt">{{ foundtransaction.mukafa_points }}</td>
          <td class="no-wrap">{{ foundtransaction.created_at }}</td>
          <td class="no-wrap">{{ foundtransaction.card_name  }}</td>
          <td class="no-wrap">{{ foundtransaction.balance  }}</td>
        </tr>
      </tbody>
    </table>

        <button class="btn btn-danger" @click="cancel_tran(foundtransaction)">Cancel Transaction</button>
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
</style>
