<script setup>
import { ref, onBeforeUnmount, nextTick } from 'vue';
import { Html5Qrcode } from 'html5-qrcode'
import login_code from '@/composables/auth.js';
const { findmember,addtransaction,member_tran_history,sendotp,verify_otp_backend } = login_code();
import { v4 as uuidv4 } from 'uuid';


const scannedText = ref('')
const showScanner = ref(false)
const mukafa_account = ref('');

let html5QrCode = null

let isScanning = false; // ✅ Manual flag for safe stop()
let scanHandled = false; // ✅ prevent duplicate scan handling

const open_camera = async () => {
  showScanner.value = true;
  await nextTick(); // wait for DOM to render

  const qrRegionId = "qr-reader";
  html5QrCode = new Html5Qrcode(qrRegionId);
  scanHandled = false;

  const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  try {
    await html5QrCode.start(
      { facingMode: "environment" },
      config,
      async (decodedText) => {
        if (scanHandled) return; // ✅ ignore repeated scans
        scanHandled = true;

        scannedText.value = decodedText;

        const urlParts = decodedText.split('/');
        mukafa_account.value = urlParts[6] || '';

        await find_member();

        if (isScanning && html5QrCode) {
          try {
            await html5QrCode.stop();
            await html5QrCode.clear();
          } catch (err) {
            console.warn("Error while stopping scanner after scan:", err);
          }
        }

        isScanning = false;
        showScanner.value = false;
      }
    );

    isScanning = true;

  } catch (err) {
    console.error("Unable to start QR scanner", err);
  }
};


onBeforeUnmount(async () => {
  if (html5QrCode) {
    try {
      if (isScanning) {
        await html5QrCode.stop();
        isScanning = false;
      }
      await html5QrCode.clear();
    } catch (err) {
      console.warn("Error cleaning up QR scanner:", err);
    }
  }
});

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
   
 let result = await findmember(mukafa_account.value);
    member.value=result.member;
    member_account.value.member_carduid=result.cardUID;
    member_account.value.member_cardname=result.card_name;
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
 console.log(result);
 otp.value=false;
 ini.value=false;
 order.value=false;
 history.value=await member_tran_history(member_account.value.member_unique_identifier);
 report.value.display=true;
 report.value.order_amount=result.mukafa_points;
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
  
  <input type="hidden" value="" id="otp_message_id">
  <div v-if="ini" class="profile-container mt-3">
    

    <form @submit.prevent="find_member">
      <div class="form-row mb-3">
        <label for="profilename" class="col-sm-2 col-form-label">Mukafa Account:</label>
        <div class="col-sm-10">

          <input
            type="text"
            v-model="mukafa_account"
            id="mukafa_account"
            class="form-control"
          />
          
          
          
          <span v-if="errors.account" class="text-danger">{{ errors.account }}</span>
        </div>
      </div>
      <button type="submit" id="enterbtn" class="btn btn-primary">Enter</button>
      
    </form>
    <hr>
    <div>
            <button type="button" class="btn btn-success" @click="open_camera">Scan QR Code</button>
            <div v-if="showScanner" id="qr-reader" style="width: 300px; margin-top: 20px;"></div>
           
          </div>
  </div>
<!--
   <p v-if="scannedText">Scanned QR Code: {{ scannedText }}</p>
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
</style>
