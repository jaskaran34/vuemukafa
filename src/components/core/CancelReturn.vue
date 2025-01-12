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

const filterTransactions = (status) => {
  filterStatus.value = status;
  fetchTransactions();
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};


const cancel=async(id)=>{
 let answer=confirm('Do you want to Cancel the transaction');
 if(answer){
  try{
    let res=await cancel_transaction(id);
 let targetId=res.id;
const foundTransaction = transactions.value.find(item => item.id == targetId);
foundTransaction.deleted_at=res.deleted_at;
 
  }
  catch(e)
  {
    alert(e);
  }
}
}

// Fetch initial data on component mount
onMounted(() => {
  if (authStore.token) {
  fetchTransactions();
  }

});
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
    <table class="table table-bordered">
      <thead class="table-light align-middle">
    <!-- Filter and Pagination Row -->
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
      <th colspan="4" class="text-end">
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
      <th>Purchase Amount</th>
      <th>Points</th>
      <th>Note</th>
      <th>Member Email</th>
      <th>Action</th>
    </tr>
  </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>{{ transaction.id }}</td>
          <td>{{ formatDate(transaction.created_at) }}</td>
          <td>{{ transaction.purchase_amount || 'N/A' }}</td>
          <td>{{ transaction.points }}</td>
          <td>{{ transaction.note || 'N/A' }}</td>
          <td>{{ transaction.member.email }}</td>
          <td v-if="!transaction.deleted_at"><button @click="cancel(transaction.id)" class="btn btn-danger">Cancel</button></td>
          <td v-if="transaction.deleted_at"> Deleted : {{ formatDate(transaction.deleted_at)  }}</td>
        </tr>
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
