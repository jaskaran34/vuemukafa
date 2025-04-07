<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import login_code from '@/composables/auth.js';
const { dashboard_info } = login_code();
import { useAuthStore } from '@/store/authStore';
import {  useRouter } from 'vue-router';

const weeklyTxnLabels = ref([]);
const weeklyTxnPurchases = ref([]);
const weeklyTxnRedemptions = ref([]);
const weeklyTxnCancellations = ref([]);
const last_six_months = ref([]);
const members_registered = ref([]);
const tier_name = ref([]);
const tier_count = ref([]);
const benefits = ref([])




const dashboardInfo = ref({
      customers: '',
      staff_members: '',
      cards: '',
      purchases: '',
      redemptions: '',
      cancellations: ''
    });

const router = useRouter();

const authStore = useAuthStore();
import { Chart } from "chart.js/auto";


const get_dashboard_info = async()=>{

try{



const res= await dashboard_info();
//console.log(res);
dashboardInfo.value.customers=res.dashboardInfo.customers;
dashboardInfo.value.staff_members=res.dashboardInfo.staff_members;
dashboardInfo.value.cards=res.dashboardInfo.cards;
dashboardInfo.value.purchases=res.dashboardInfo.purchases;
dashboardInfo.value.redemptions=res.dashboardInfo.redemptions;
dashboardInfo.value.cancellations=res.dashboardInfo.cancellations;

const apiData = res.WeeklyTransactionSummary;
//console.log(apiData);

weeklyTxnLabels.value = [...apiData.map(item => item.txn_date)];
 
console.log(weeklyTxnLabels);
//console.log("Converted Labels:", weeklyTxnLabels.value[0]);

weeklyTxnPurchases.value = [...apiData.map(item => Number(item.purchases))];
weeklyTxnRedemptions.value = [...apiData.map(item => Number(item.redemptions))];
weeklyTxnCancellations.value = [...apiData.map(item => Number(item.cancellations))];



const memData=res.getMonthlyMemberStats;

last_six_months.value = [...memData.map(item => item.month_year)];
members_registered.value = [...memData.map(item => Number(item.new_members_count))];


const tierData=res.getMembersByTier;

tier_name.value = [...tierData.map(item => item.tier_name)];
tier_count.value = [...tierData.map(item => Number(item.member_count))];





benefits.value=res.getRecentbenefitTransactions;
 

} catch (error) {
console.error("Error fetching transactions:", error);
}
}



let chartConfig1=null;

const createChartConfig1 = () => {

// Doughnut chart configuration
 chartConfig1 = {
  type: 'pie',
  data: {
    labels: tier_name.value,
    datasets: [
      {
        label: 'Tier',
        data: tier_count.value, // Data for each label
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Position of the legend
      },
      tooltip: {
        enabled: true, // Enable tooltips
      },
    },
  },
};

}
let chartConfig2=null;

const createChartConfig2 = () => {
 chartConfig2 = {
  type: 'bar',
  data: {
    labels: last_six_months.value,
    datasets: [
      {
        label: 'New Customers',
        data: members_registered.value, // Data for each label
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
           'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Position of the legend
      },
      tooltip: {
        enabled: true, // Enable tooltips
      },
    },
  },
};
}
let chartConfig4 = null;

const createChartConfig4 = () => {
  chartConfig4 = {
    type: 'line',
    data: {
      labels: weeklyTxnLabels.value,
      datasets: [
        {
          label: 'Purchases',
          data: weeklyTxnPurchases.value,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'Redemptions',
          data: weeklyTxnRedemptions.value,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'Cancellations',
          data: weeklyTxnCancellations.value,
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Transactions weekly',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Count',
          },
          beginAtZero: true,
        },
      },
    },
  };
};




const chartRef1 = ref(null);
let chartInstance1 = null;



const chartRef2 = ref(null);
let chartInstance2 = null;



const chartRef4 = ref(null);
let chartInstance4 = null;

// Function to render the chart
const renderChart = async() => {

  if (chartInstance1) {
    chartInstance1.destroy(); // Cleanup existing chart
  }
  chartInstance1 = new Chart(chartRef1.value, chartConfig1);

  
  if (chartInstance2) {
    chartInstance2.destroy(); // Cleanup existing chart
  }
  chartInstance2 = new Chart(chartRef2.value, chartConfig2);


  if (chartInstance4) {
    chartInstance4.destroy(); // Cleanup existing chart
  }
  chartInstance4 = new Chart(chartRef4.value, chartConfig4);

};



// Lifecycle hooks
onMounted(async() => {
  if (authStore.token) {
  
    await get_dashboard_info();
    createChartConfig4();  
    createChartConfig2();
    createChartConfig1();
    await renderChart();
   
  
    
  } else {
    //console.log('22');
    router.push({name: 'userLogin'});
  }
 
});

onBeforeUnmount(() => {
  if (chartInstance1) {
    chartInstance1.destroy(); // Cleanup memory
  }

  if (chartInstance2) {
    chartInstance2.destroy(); // Cleanup memory
  }

  
  if (chartInstance4) {
    chartInstance4.destroy(); // Cleanup memory
  }
  
  });
</script>
<template>
   <div class="row mt-2 p-2">
            <div class="col-md-2">
                  <div class="card bg-primary text-white">
                        <div class="card-header text-center border-bottom">
                              <h5> Customers</h5>
                        </div>
                        <div class="card-body text-center">
                                    {{dashboardInfo.customers}}
                              </div>
                  </div>
            </div>


            <div class="col-md-2">
              <div class="card bg-secondary text-white">
                        <div class="card-header text-center border-bottom">
                              <h5> Staff Members</h5>
                        </div>
                        <div class="card-body text-center">
                          {{dashboardInfo.staff_members}}    
                              </div>
                  </div>
            </div>
            <div class="col-md-2">
              <div class="card bg-warning text-white">
                        <div class="card-header text-center border-bottom">
                              <h5>Cards</h5>
                        </div>
                        <div class="card-body text-center">
                          {{dashboardInfo.cards}}  
                              </div>
                  </div>
            </div>

            <div class="col-md-2">
              <div class="card bg-success text-white">
                        <div class="card-header text-center border-bottom">
                              <h5> Purchases</h5>
                        </div>
                        <div class="card-body text-center">
                          {{dashboardInfo.purchases}}    
                              </div>
                  </div>
            </div>
            <div class="col-md-2">
              <div class="card bg-info text-white">
                        <div class="card-header text-center border-bottom">
                              <h5> Redemptions</h5>
                        </div>
                        <div class="card-body text-center">
                          {{dashboardInfo.redemptions}}    
                              </div>
                  </div>
            </div>
            <div class="col-md-2">
              <div class="card bg-danger text-white">
                        <div class="card-header text-center border-bottom">
                              <h5> Cancellations</h5>
                        </div>
                        <div class="card-body text-center">
                          {{dashboardInfo.cancellations}}    
                              </div>
                  </div>
            </div>
            
  </div>
      <div class="row mt-2 p-2">
            <div class="col-md-6">
                  <div class="card card_graph">
                        <div class="card-header">
                          <h5>Transactions last 7 Days</h5>
                        </div>
                        <div class="card-body">
                              <canvas ref="chartRef4"></canvas>       
                              </div>
                  </div>
            </div>
            <div class="col-md-6">
                  <div class="card card_graph">
                        <div class="card-header">
                          <h5>New Customers (Month wise)</h5>
                        </div>
                        <div class="card-body">
                              <canvas ref="chartRef2"></canvas>       
                              </div>
                  </div>
            </div>
            
        
      </div>
      <div class="row mt-2 p-2">
        
            <div class="col-md-4">  
            
              <div class="card card_graph">
                  <div class="card-header">
                    <h5> Customers (Tier wise)</h5>
                  </div>
                  <div class="card-body">
                        <canvas ref="chartRef1"></canvas> 
                  </div>
            </div>
           

      </div>
      <div class="col-md-8">  
            <div class="card">
                  <div class="card-header">
                    <h5> Mukafa Mini Statement</h5>
                  </div>
                  <div class="card-body" id="benefit_table">
                    <table v-if="benefits.length" class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Transaction ID</th>
          <th>Member Name</th>
          <th>Transaction Type</th>
          <th>Points</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in benefits" :key="index">
          <td>{{ item.transaction_id }}</td>
          <td>{{ item.member_name }}</td>
          <td>{{ item.transaction_type }}</td>
          <td>{{ item.points }}</td>
          <td>{{ item.created_at }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else class="text-muted">No data available.</div>
                  </div>
          
                </div>
            
          </div>
      </div>
    </template>
    <style scoped>

</style>
    