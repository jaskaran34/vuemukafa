<script setup>
import { ref, onMounted,watch } from "vue";
import login_code from '@/composables/auth.js';
const { alltransactions } = login_code();
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();

const transactions = ref([]); // Store transaction data

const issue_total = ref(0);
const redeem_total = ref(0); 
const service_total = ref(0);  


const pagination = ref({
  current_page: 1,
  last_page: 1,
  prev_page_url: null,
  next_page_url: null,
});
const recordsPerPage = ref(10); // Default records per page
const filterStatus = ref("Settlement"); // Default filter status
const reset_page_setting=ref(true);
const search_id = ref("");
const search_orderid = ref("");

const from_date = ref("");
const to_date = ref("");

const mukafa_no = ref("");
let timeout = null;

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
  //alert(search_id);
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
    ref_tran_id: search_id.value,
    ref_order_id:search_orderid.value,
    from_date:from_date.value,
    to_date:to_date.value
  });
      
  try{
    
   const res= await alltransactions(pageurl,params);
    
   console.log(res.data.data);
   
    transactions.value = res.data.data;

    
 
    issue_total.value = 0;
  redeem_total.value = 0;
  service_total.value = 0;

  // Loop through transactions
  transactions.value.forEach(tran => 
  {
  
    if (tran.main_transaction_type === 'Debit') {
      issue_total.value += parseFloat(tran.main_transaction_points);
    }
     else if (tran.main_transaction_type === 'Credit') {
      redeem_total.value += parseFloat(tran.main_transaction_points);
    }
    service_total.value += parseFloat(tran.points);
  });

issue_total.value = parseFloat(issue_total.value).toFixed(2);
redeem_total.value = parseFloat(redeem_total.value).toFixed(2);
service_total.value = parseFloat(service_total.value).toFixed(2);

          

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

const reset_params = () => {
  search_id.value='';
  search_orderid.value='';
  from_date.value='';
  to_date.value='';

  fetchTransactions();

}

const printTable = (tableId) => {
  const table = document.getElementById(tableId).cloneNode(true); // Clone the table for printing
  const tbody = table.querySelector('tbody'); // Select only the tbody from the cloned table

  // Create a temporary print window
  const printWindow = window.open('', '_blank', 'height=600,width=800');

  if (!printWindow) {
    alert('Pop-up blocked! Please allow pop-ups for this site and try again.');
    return;
  }

  // Write the content to the new window
  printWindow.document.write(`
    <html>
      <head>
        <title>Settlement Report, ${authStore.user.name}</title>
        <style>
          @media print {
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              margin: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
            }
            th {
              background-color: #f2f2f2;
            }
          }
        </style>
      </head>
      <body>
        <table>${tbody.outerHTML}</table> <!-- Only the tbody will be printed -->
      </body>
    </html>
  `);

  // Close the document to finish writing
  printWindow.document.close();

  // Ensure the content is fully loaded before printing
  printWindow.onload = () => {
    printWindow.focus(); // Focus the window
    printWindow.print(); // Trigger the print dialog
    printWindow.close(); // Close the window after printing
  };

  // Fallback in case onload doesn't fire
  setTimeout(() => {
    if (!printWindow.closed) {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }, 1000); // Adjust the timeout duration if necessary
};
const exportToCSV = (tableId) => {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody'); // Select tbody
  let csvContent = '';

  // Loop through rows inside tbody
  const rows = tbody.querySelectorAll('tr');
  rows.forEach(row => {
    const rowArray = [];
    
    row.querySelectorAll('td, th').forEach(cell => {
      let cellText = cell.innerText.replace(/,/g, ''); // Remove commas from cell content

      // Handle colspan
      const colspan = cell.getAttribute('colspan');
      const cellCount = colspan ? parseInt(colspan) : 1;

      // Calculate the number of empty cells to add on the left and right for centering
      const totalEmptyCells = cellCount - 1; // Total cells to merge
      const leftEmptyCells = Math.floor(totalEmptyCells / 2); // Empty cells on the left
      const rightEmptyCells = totalEmptyCells - leftEmptyCells; // Empty cells on the right

      // Add empty cells on the left for centering
      for (let i = 0; i < leftEmptyCells; i++) {
        rowArray.push('');
      }

      // Add the cell content
      rowArray.push(cellText);

      // Add empty cells on the right for centering
      for (let i = 0; i < rightEmptyCells; i++) {
        rowArray.push('');
      }
    });

    // Add the row to the CSV content
    if (rowArray.length > 0) {
      csvContent += rowArray.join(',') + '\n';
    }
  });

  // Create a Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'table_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};



// Fetch initial data on component mount
onMounted(() => {
  if (authStore.token) {
  fetchTransactions();
  }

});
</script>

<template>
  <div class="template_structure mt-4">
   
    <h5 class="mb-4">Settlement Report</h5>
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
      <th colspan="11">
        <div style="display: inline-block; width: 100%; float: right;">
      <label style="float: left;font-size: large;">Filter Results:</label>  
        <input style="float: left;margin-left: 5px;" type="text"  v-model="search_id" placeholder="By Reference Tran ID" >
        <input style="float: left;" type="text"  v-model="search_orderid" placeholder="By Order ID" >
      
         By Order Date<input type="date" v-model="from_date"  @change="fetchTransactions()" ><input type="date" v-model="to_date"  @change="fetchTransactions()">
         <button class="btn btn-info text-white" @click="exportToCSV('table_show')" style="float: right;margin-left: 3px;">Export to CSV</button>
         <button class="btn btn-success" @click="printTable('table_show')" style="float: right;">Print</button>
         <button class="btn btn-warning text-white" @click="reset_params()" style="height: 36px;
    width: 100px;
    float: right;">Reset</button>
        </div>
        </th>
       </tr>
    <tr>
      
      <th colspan="11" class="text-end">
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
  </thead>
  <tbody>
        
    <!-- Table Headers Row -->
    <tr>

        <th>ID</th>
               
               <th>Transaction Id</th>
               <th>Date</th>
               <th>Issue</th>
               <th>Redeem</th>
               <th>Service</th>
               <th>Customer Name</th>
               <th>Order ID</th>
               <th>Reference Tran Id</th>
               
               <th>Status</th>
            
               <th>Remarks</th>



      
    </tr>
     <template v-for="(transaction, index) in transactions" :key="transaction.id">

          
                    <tr>
                        <td>{{ index+1 }}</td>
                       
                        <td>{{ transaction.id }}</td>
                        <td>{{ transaction.created_date }}</td>
                        <td v-if="transaction.main_transaction_type == 'Debit'" style="text-align: right;"> {{ transaction.main_transaction_points }} </td> <td v-else></td>
                        <td v-if="transaction.main_transaction_type == 'Credit'" style="text-align: right;"> {{ transaction.main_transaction_points }}</td> <td v-else></td>
                        <td style="text-align: right;">{{ transaction.points }}</td>                        
                        <td style="text-align: left;">{{ transaction.member.name }}</td>
                        <td style="text-align: left;">{{ transaction.main_transaction_note  }}</td>
                        <td >{{ transaction.note  }}</td>
                        
                        <td v-if="transaction.status == 'completed'">success</td> <td v-else>Failed</td>
                        <td>{{ transaction.remarks  }}</td>
                      
                    </tr>
                 
                </template>
                <tr>
                  <th style="text-align: right;" colspan="3">Total</th>
                  <th style="text-align: right;">{{ issue_total }}</th>
                  <th style="text-align: right;">{{ redeem_total }}</th>
                  <th style="text-align: right;">{{ service_total }}</th>
                  <th colspan="5"></th>
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