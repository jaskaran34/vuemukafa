<script setup>
import { ref, onMounted,watch } from "vue";
import login_code from '@/composables/auth.js';
const { alltransactions } = login_code();
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
const filterStatus = ref("cancelled"); // Default filter status
const reset_page_setting=ref(true);
const search_id = ref("");
const search_orderid = ref("");

const from_date = ref("");
const to_date = ref("");

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
    transaction_id: search_id.value,
    order_id:search_orderid.value,
    from_date:from_date.value,
    to_date:to_date.value
  });
      
  try{
    
   const res= await alltransactions(pageurl,params);
    
   console.log(res);
  
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







// Fetch initial data on component mount
onMounted(() => {
  if (authStore.token) {
  fetchTransactions();
  }

});





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
   
    <h5 class="mb-4">Cancellation Report</h5>
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