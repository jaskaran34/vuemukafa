<script setup>
import { ref } from 'vue';
import login_code from '@/composables/auth.js';
const { findmember,addtransaction } = login_code();




 
 
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
  member_phone:''

});
const member = ref({});
const otp = ref(false);
const order = ref(false);
const phone_no = ref('');
const ini = ref(true);

const find_member = async () => {
  try {
    member.value = await findmember(document.getElementById('mukafa_account').value);
    phone_no.value = member.value.phone;
    
    member_account.value.member_name=member.value.name;
    member_account.value.member_email=member.value.email;
    member_account.value.member_unique_identifier=member.value.unique_identifier;
    member_account.value.member_phone=member.value.phone;

    otp.value = true;
   // console.log(member.value.phone);
  } catch (error) {
    errors.value.account = 'An error occurred while fetching member data.';  
  }
};

const verify_otp = async () => {
 
    if(document.getElementById('otp').value=='1234'){
    
      //otp.value = false;
      //ini.value=false;
      order.value=true;

    }
    else{
      errors.value.otp='Invalid Otp';
    }

    
    
};

const report=ref({
  order_amount:'',
  tran_id:'',
  display:false
});
const issue_points = async () => {
 
  try{
 let result=await addtransaction(document.getElementById('order_amt').value,document.getElementById('order_no').value,member_account.value.member_unique_identifier);
 otp.value=false;
 ini.value=false;
 order.value=false;
 report.value.display=true;
 report.value.order_amount=result.points;
 report.value.tran_id=result.id;

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
   <table style="width: 800px;">
    <thead>
      <tr>
      <th>Name</th>
      <th>Email</th>
      <th>unique identifier</th>
      <th>Phone</th>
    </tr>
    </thead>
    
    
    <tbody>
      <tr>
      <td>{{ member_account.member_name }}</td>
      <td>{{ member_account.member_email }}</td>
      <td>{{ member_account.member_unique_identifier }}</td>
      <td>{{ member_account.member_phone }}</td>
    </tr>
    </tbody>
   </table>
        
      </div>

    <form @submit.prevent="issue_points">

      
    
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
   <table style="width: 800px;">
    <thead>
      <tr>
      <th>Transaction Id</th>
      <th>Purchase amount</th>
      
    </tr>
    </thead>
    
    
    <tbody>
      <tr>
      <td>{{ report.tran_id }}</td>
      <td>{{ report.order_amount }}</td>
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
