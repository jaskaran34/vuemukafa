<script setup>
import { ref, onMounted,watch } from "vue";
import login_code from '@/composables/auth.js';
const { alltransactions,cancel_transaction,sendotp,verify_otp_backend} = login_code();
import { useAuthStore } from '@/store/authStore';
const mukafa_no = ref("");
import { v4 as uuidv4 } from 'uuid';
const authStore = useAuthStore();

import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const btn_disabled=ref('');
const init_cancel =ref(false);
const partial_cancel =ref(false);


const transactions = ref([]); // Store transaction data
const pagination = ref({
  current_page: 1,
  last_page: 1,
  prev_page_url: null,
  next_page_url: null,
});
const recordsPerPage = ref(10); // Default records per page
const filterStatus = ref(""); // Default filter status
const reset_page_setting=ref(true);

const search_id = ref("");
let timeout = null;

const search_orderid = ref("");

const from_date = ref("");
const to_date = ref("");
const cancel_points=ref();
const balance_after_cancel=ref();

const cancel_tran_id=ref();
const cancel_remarks=ref();



const cancelledTransactionIds = ref({});
const showcancelled = ref({});


watch(
  filterStatus,
  (newValue, oldValue) => {
    //console.log(newValue);
    //console.log(oldValue);
    if (oldValue !== newValue) {
      reset_page_setting.value=true;
    }
    else{
      reset_page_setting.value=false;
    }
  }
);

watch([search_id, mukafa_no, search_orderid], () => {
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
  const params = new URLSearchParams({
    page: pagination.value.current_page,
    per_page: recordsPerPage.value,
    status: filterStatus.value,
    mukafa_no: mukafa_no.value,
    transaction_id: search_id.value,
    order_id:search_orderid.value,
    from_date:from_date.value,
    to_date:to_date.value
  });
      
  try{
    
   const res= await alltransactions(pageurl,params);
    
  
    transactions.value = res.data.data;
    pagination.value = {
      current_page: res.data.current_page,
      last_page: res.data.last_page,
      prev_page_url: res.data.prev_page_url,
      next_page_url: res.data.next_page_url,
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};



/*
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
*/
const transcation_cancel=async(id)=>{


  try{
    let cancel_type= document.getElementById('cancel_type').value;

    
   let partial_amount;

   if(cancel_type=='F'){
     partial_amount=null;
   }
   else{
     partial_amount = document.getElementById('partial_amount').value;
   }

   

     let remarks= document.getElementById('remarks').value;

     let data ={
        "remarks": remarks,
        "cancel_type": cancel_type,
        "amount": partial_amount
    };


    let res=await cancel_transaction(id,data);
 
       
 let targetId=res.refrence_tran_id;
 const foundTransaction = transactions.value.find(item => item.id == targetId);
 if(cancel_type=='F'){
  foundTransaction.status='completed';
   }
   else if(cancel_type=='P'){
  foundTransaction.status='Partially Cancelled';
   }

  cancel_tran_id.value=res.cancel_tran_id;
  cancel_remarks.value=res.reason_for_cancel;
 balance_after_cancel.value=res.balance;
 cancel_points.value=res.points_returned;






 

revert(id); 

showcancelled.value[id] = `Transaction ${id} `;


setTimeout(() => { 
    
    
  delete showcancelled.value[id];
  cancel_points.value='';
  balance_after_cancel.value='';

   reloadRoute();
}, 5000); 

    

  }
  catch(e)
  {
    alert(e);
  }

}
const reset_params = () => {
  search_id.value='';
  mukafa_no.value='';
  search_orderid.value='';
  from_date.value='';
  to_date.value='';
  filterStatus.value='';

  fetchTransactions();

}

const reloadRoute = async() => {
   const currentRoute = { name: route.name, query: route.query, params: route.params, };
    router.push({ name: 'reload', query: { targetRoute: JSON.stringify(currentRoute) } }); 
  };

const cancel=async(id,index)=>{

  cancelledTransactionIds.value={};

  if(btn_disabled.value){
    document.getElementById(btn_disabled.value).disabled = false;
  }
  var btn_id='cancel_refund_btn_'+index;
  document.getElementById(btn_id).disabled = true; 

  btn_disabled.value=btn_id;

  let otp_message_id=uuidv4();
    document.getElementById('otp_message_id').value=otp_message_id;
   
        await sendotp(otp_message_id,id,'cancel_tran');


  cancelledTransactionIds.value[id] = `Transaction ${id} `;
  
  //transcation_cancel(id);
}

const verify_otp =async(id) =>{


  try{
let otp_conf=await verify_otp_backend(document.getElementById('otp_message_id').value,
                          id,
                          'cancel_tran',
                          document.getElementById('otp').value);

                        

    if(otp_conf=='ok'){
      init_cancel.value=true;
  }
}
  catch(error){
    alert('Invalid Otp');
  }

}
// Fetch initial data on component mount
onMounted(() => {
  if (authStore.token) {
  fetchTransactions();
  }

});

const filterTransactions = (status) => {
  filterStatus.value = status;
  fetchTransactions();
};

const show_hide_partial= ()=>{ 
  
  if(document.getElementById('cancel_type').value=='F'){
    partial_cancel.value=false;
  }
  else{
    partial_cancel.value=true;
  }
}
  const revert= (id)=>{


  delete cancelledTransactionIds.value[id];
  

}


</script>



<template>
  <input type="hidden" value="" id="otp_message_id">
  <div class="template_structure mt-4">
   
    <h5 class="mb-4">Cancellation / Return</h5>
    <!-- Top Row with Filter Buttons and Pagination -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <!-- Filter Buttons -->
      
      <!-- Pagination and Records Per Page -->
      <div class="d-flex align-items-center">
       
      </div>
    </div>

    <!-- Table to Display Transactions -->
    <table class="table table-bordered" id="table_show">
      <thead class="table-light align-middle">
    <!-- Filter and Pagination Row -->
    <tr>
      <th colspan="10">
        <div style="display: inline-block; width: 100%; float: right;">
      <label style="float: left;font-size: large;">Filter Results:</label>  
        <input style="float: left;margin-left: 5px;" type="text"  v-model="search_id" placeholder="By Transaction ID" >
      <input style="float: left;" type="text"  v-model="search_orderid" placeholder="By Order ID" >
      <input  style="float: left;" type="text"  v-model="mukafa_no" placeholder="By Mukafa No" >
        
          
        
      
         By Order Date<input type="date" v-model="from_date"  @change="fetchTransactions()" ><input type="date" v-model="to_date"  @change="fetchTransactions()">
         <button class="btn btn-warning text-white" @click="reset_params()" style="height: 36px;
    width: 100px;
    float: right;">Reset</button>
        </div></th>
      
        </tr>
    <tr>
      <th colspan="5">
        <div class="d-flex align-items-center">
          <button
            class="btn btn-light me-1"
            :class="{ active: filterStatus === '' }"
            @click="filterTransactions('')"
          >
            All
          </button>
          <button
            class="btn btn-light me-1"
            :class="{ active: filterStatus === 'completed' }"
            @click="filterTransactions('completed')"
          >
            Completed
          </button>
          <button
            class="btn btn-light me-1"
            :class="{ active: filterStatus === 'pending' }"
            @click="filterTransactions('pending')"
          >
            Pending
          </button>
          <button
            class="btn btn-light me-1"
            :class="{ active: filterStatus === 'cancelled' }"
            @click="filterTransactions('cancelled')"
          >
            Cancelled
          </button>
          <button
            class="btn btn-light me-1"
            :class="{ active: filterStatus === 'refunded' }"
            @click="filterTransactions('refunded')"
          >
          Refunded
          </button>
        </div>
      </th>
      <th colspan="5" class="text-end">
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
    <!-- Table Headers Row -->
    <tr>
      <th>S.no</th>
      <th>Transaction ID</th>
      <th>Order Id</th>
      <th>Mukafa No.</th>
      <th>Date</th>
      <th>Type</th>
      <th>Purchase Amount</th>
      <th>Points</th>
      
      
      <th>Status</th>
      <th>Remarks</th>
    </tr>
  </thead>
      <tbody>
        <template v-for="(transaction, index) in transactions" :key="transaction.id">
                    <tr>
                      <td>{{ (index + 1)}}</td>
                        <td style="text-align: left;">{{ transaction.id }}</td>
                        <td style="text-align: left;">{{ transaction.order_id || 'N/A' }}</td>
                        <td style="text-align: left;">{{ transaction.mukafa_number }}</td>
                        <td>{{ transaction.created_date }}</td>
                        <td style="text-align: left;">{{ transaction.type }}</td>
                        <td style="text-align: right;">{{ transaction.purchase_amount  }}</td>
                        <td style="text-align: right;">{{ transaction.mukafa_points }}</td>
                        <td v-if="transaction.status=='pending' && transaction.type=='Credit'">
                            <button @click="cancel(transaction.id,index)" class="btn btn-danger" :id="'cancel_refund_btn_' + index">Cancel / Refund</button>
                        </td>
                        <td v-else> {{transaction.status }}</td>
                        <td v-if="transaction.cancel_flag=='C' && transaction.status=='pending'" class="text-warning"><b>Partially Cancelled-{{transaction.remarks}}</b></td>
                        <td v-else-if="transaction.cancel_flag=='R'" class="text-info"><b>{{transaction.remarks}}</b> </td>
                        <td v-else-if="transaction.cancel_flag=='C' && transaction.status=='completed'" class="text-danger"><b>{{transaction.remarks}}</b></td>
                        <td v-else-if="transaction.cancel_flag!='C'  && transaction.cancel_flag!='R'" class="text-success"><b>{{transaction.remarks}}</b></td>
                    
                      </tr>
                    <tr v-if="cancelledTransactionIds[transaction.id]">
                      <td colspan="9"  v-if="!init_cancel">
                        <div class="card p-4">
        <!-- Everything in a flex row -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <p class="mb-0 me-3">Are you sure you want to cancel transaction <b> #{{ transaction.id }} </b></p>

            <!-- OTP input field and Submit button aligned on the same line -->
            <div class="d-flex align-items-center me-3">
              
                <label for="otp" class="form-label mb-0 me-2">Enter OTP</label>
                <input type="text" class="form-control" value="123456" id="otp" placeholder="Enter OTP" style="width: 100px !important;">
                <button @click="verify_otp(transaction.id)" class="btn btn-success ms-2">Verify Otp</button>
              </div>
            
            </div>
            </div>
                      </td>
                      <td colspan="9"  v-if="init_cancel">
    <div class="card p-4">
        <!-- Everything in a flex row -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <p class="mb-0 me-3">transaction #{{ transaction.id }}?</p>

           

            <div class="d-flex align-items-center me-3">
                <label for="otp" class="form-label mb-0 me-2">Cancellation Type</label>
                <select class="form-control" id="cancel_type" @change="show_hide_partial()" style="width: 150px !important;">
                  <option value="F">Full Transaction</option>
                  <option value="P">Partial</option>

                </select>
            </div>

            <div class="d-flex align-items-center me-3" v-if="partial_cancel">
                <label for="otp" class="form-label mb-0 me-2">Enter Amount</label>
                <input type="text" value="" id="partial_amount">
            </div>

            

            <div class="d-flex align-items-center me-3">
                <label for="Remarks" class="form-label mb-0 me-2">Remarks:</label>
                <input type="textarea"    class="form-control" id="remarks" placeholder="Enter Remarks" 
                style="width: 250px !important;height: 100px;">
            </div>

            <!-- Submit and Close buttons -->
            <button @click="transcation_cancel(transaction.id)" class="btn btn-danger ms-2">Submit</button>
            <button @click="revert(transaction.id)" class="btn btn-success ms-2">Close</button>
        </div>
    </div>
</td>

</tr>




<tr v-if="showcancelled[transaction.id]">

                      <td colspan="9">
    <div class="card p-4">
        <!-- Everything in a flex row -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <table class="table table-bordered" style="max-width: 700px; margin: auto;">
            <thead>
              <tr><th colspan="5" style="text-align: center;">Transaction Cancelled</th></tr>
            
            </thead>
            <tbody>
              <tr>
               
                <td>Reference no {{ cancel_tran_id }}</td>
                <td>Transaction cancelled {{ transaction.id }}</td>
                <td>Remarks {{ cancel_remarks }}</td>
                <td>Points Cancelled {{ cancel_points }}</td>
                <td>Balance {{ balance_after_cancel }}</td>

          
              </tr>
            </tbody>

          </table>
                  

        </div>
    </div>
</td>

</tr>
                </template>
        
      </tbody>
    </table>
  </div>
</template>


<style scoped>
.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}
.btn.active {
    background-color: #007bff; /* Bootstrap primary blue */
    color: #fff; /* White text */
    border-color: #007bff; /* Optional: Match border with background */
  }
</style>
