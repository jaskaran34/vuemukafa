<script setup>
import { ref, onMounted,watch } from "vue";
import login_code from '@/composables/auth.js';
const { alltransactions,cancel_transaction } = login_code();
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();

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
const search_orderid = ref("");

const from_date = ref("");
const to_date = ref("");
const cancel_points=ref();
const balance_after_cancel=ref();

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

const fetchTransactions = async (pageurl = null) => {
  
 
  if(reset_page_setting.value){
    pagination.value.current_page=1;
   // alert('changed');
  }
  const params = new URLSearchParams({
    page: pagination.value.current_page,
    per_page: recordsPerPage.value,
    status: filterStatus.value,
    id: search_id.value,
    note:search_orderid.value,
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




const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const transcation_cancel=async(id)=>{


  try{
    if(document.getElementById('otp').value=='1234'){
    let res=await cancel_transaction(id);
 let targetId=res.id;
  cancel_points.value=res.points;
 balance_after_cancel.value=res.balance;

const foundTransaction = transactions.value.find(item => item.id == targetId);
foundTransaction.deleted_at=res.deleted_at;
revert(id); 

showcancelled.value[id] = `Transaction ${id} `;


setTimeout(() => { 
    
    
  delete showcancelled.value[id];
  cancel_points.value='';
  balance_after_cancel.value='';
}, 5000); 

    }
else{
  alert('Invalid Otp');
}
  }
  catch(e)
  {
    alert(e);
  }

}


const cancel=async(id)=>{

  cancelledTransactionIds.value[id] = `Transaction ${id} `;
  
  //transcation_cancel(id);
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

const revert= (id)=>{


  delete cancelledTransactionIds.value[id];
  

}


</script>



<template>
  <div class="container mt-4">
    <h5 class="mb-4">Transaction History</h5>

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
      <th colspan="8">
        <div style="display: inline-block; width: 100%; ">
      <label>Filter</label>    <input type="text"  v-model="search_id" placeholder="By Transaction ID" @blur="fetchTransactions();">
        
          <input type="text"  v-model="search_orderid" placeholder="By Order ID" @blur="fetchTransactions();">
        
      
         By Order Date<input type="date" v-model="from_date"  @change="fetchTransactions()" ><input type="date" v-model="to_date"  @change="fetchTransactions()"> </div></th>
      </tr>
    <tr>
      <th colspan="3">
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
            :class="{ active: filterStatus === 'success' }"
            @click="filterTransactions('success')"
          >
            Success
          </button>
          <button
            class="btn btn-light me-1"
            :class="{ active: filterStatus === 'cancelled' }"
            @click="filterTransactions('cancelled')"
          >
            Cancelled
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
      <th>Transaction ID</th>
      <th>Order Id</th>
      <th>Member Email</th>
      <th>Date</th>
      <th>Type</th>
      <th>Purchase Amount</th>
      <th>Points</th>
      
      
      <th>Status</th>
    </tr>
  </thead>
      <tbody>
        <template v-for="(transaction, index) in transactions" :key="transaction.id">
                    <tr>
                        <td>{{ transaction.id }}</td>
                        <td>{{ transaction.note || 'N/A' }}</td>
                        <td>{{ transaction.member.email }}</td>
                        <td>{{ formatDate(transaction.created_at) }}</td>
                        <td>{{ transaction.type }}</td>
                        <td>{{ transaction.purchase_amount  }}</td>
                        <td>{{ transaction.points }}</td>
                        <td v-if="transaction.deleted_at">
                            <button @click="cancel(transaction.id,index)" class="btn btn-danger">Cancel / Refund</button>
                        </td>
                        <td v-if="!transaction.deleted_at"> {{transaction.status }}</td>
                    </tr>
                    <tr v-if="cancelledTransactionIds[transaction.id]">
                      <td colspan="8">
    <div class="card p-4">
        <!-- Everything in a flex row -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <p class="mb-0 me-3">Are you sure you want to cancel transaction #{{ transaction.id }}?</p>

            <!-- OTP input field and Submit button aligned on the same line -->
            <div class="d-flex align-items-center me-3">
                <label for="otp" class="form-label mb-0 me-2">Enter OTP:</label>
                <input type="text" class="form-control" id="otp" placeholder="Enter OTP" style="width: 250px;">
            </div>

            <div class="d-flex align-items-center me-3">
                <label for="otp" class="form-label mb-0 me-2">Enter OTP:</label>
                <input type="text" class="form-control" id="otp" placeholder="Enter OTP" style="width: 250px;">
            </div>

            <!-- Submit and Close buttons -->
            <button @click="transcation_cancel(transaction.id)" class="btn btn-danger ms-2">Submit</button>
            <button @click="revert(transaction.id)" class="btn btn-success ms-2">Close</button>
        </div>
    </div>
</td>

</tr>




<tr v-if="showcancelled[transaction.id]">
                      <td colspan="8">
    <div class="card p-4">
        <!-- Everything in a flex row -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <table class="table table-bordered" style="max-width: 500px; margin: auto;">
            <thead>
              <tr><th colspan="3" style="text-align: center;">Transaction Cancelled</th></tr>
            
            </thead>
            <tbody>
              <tr>
                <td>Reference no {{ transaction.id }}</td>
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
