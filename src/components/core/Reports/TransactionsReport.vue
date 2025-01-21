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





const transcation_cancel=async(id)=>{


  try{
    if(document.getElementById('otp').value=='1234'){
     let remarks= document.getElementById('remarks').value;
    let res=await cancel_transaction(id,remarks);
    
 let targetId=res.id;
 //console.log(targetId);
  cancel_points.value=res.points;




  cancel_tran_id.value=res.cancel_tran_id;
  cancel_remarks.value=res.remarks;
 balance_after_cancel.value=res.balance;

const foundTransaction = transactions.value.find(item => item.id == targetId);
console.log(foundTransaction);
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




// Fetch initial data on component mount
onMounted(() => {
  if (authStore.token) {
  fetchTransactions();
  }

});



const revert= (id)=>{


  delete cancelledTransactionIds.value[id];
  

}


const printTable = (tableId) => {
  const table = document.getElementById(tableId).cloneNode(true);
  
  // Remove the first two rows
  table.querySelector('tr:nth-child(1)').remove();
  table.querySelector('tr:nth-child(1)').remove(); // Note: this is now the new first row

  const printContents = table.outerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
};
</script>



<template>
  <div class="template_structure mt-4">
   
    <h5 class="mb-4">Transaction Report</h5>
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
      <th colspan="9">
        <div style="display: inline-block; width: 100%;">
      <label>Filter</label>    <input type="text"  v-model="search_id" placeholder="By Transaction ID" @blur="fetchTransactions();">
        
          <input type="text"  v-model="search_orderid" placeholder="By Order ID" @blur="fetchTransactions();">
        
      
         By Order Date<input type="date" v-model="from_date"  @change="fetchTransactions()" ><input type="date" v-model="to_date"  @change="fetchTransactions()">
         <button class="btn btn-success" @click="printTable('table_show')" style="float: right;">Print</button>
         </div>
        </th>
       </tr>
    <tr>
      
      <th colspan="9" class="text-end">
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

        <th>ID</th>
               <th>Date</th>
               <th>Reference Id</th>
               <th>Mukafa No </th>
               <th>Order ID</th>
               <th>Debit </th>
               <th>Credit </th>
               <th>Status</th>
            
               <th>Remarks</th>



      
    </tr>
  </thead>
      <tbody>
        <template v-for="(transaction, index) in transactions" :key="transaction.id">
                    <tr>
                        <td>{{ index+1 }}</td>
                        <td>{{ transaction.created_date }}</td>
                        <td>{{ transaction.id }}</td>
                        <td>{{ transaction.member.unique_identifier }}</td>
                        <td>{{ transaction.note  }}</td>
                        <td v-if="transaction.type == 'Debit'">{{ transaction.points }}</td> <td v-else></td>
                        <td v-if="transaction.type == 'Credit'">{{ transaction.points }}</td> <td v-else></td>
                        
                        <td>{{ transaction.status }}</td>
                        <td>{{ transaction.remarks  }}</td>
                      
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
                <label for="Remarks" class="form-label mb-0 me-2">Remarks:</label>
                <input type="textarea"    class="form-control" id="remarks" placeholder="Enter Remarks" 
                style="width: 250px;height: 100px;">
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



<!--        
           
           
             <tr>
              
               <th>ID</th>
               <th>Date</th>
               <th>Reference Id</th>
               <th>Mukafa No </th>
               <th>Order ID</th>
               <th>Debit </th>
               <th>Credit </th>
               <th>Status</th>
               <th>Transaction Status</th>
               <th>Remarks</th>

-->