<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import login_code from '@/composables/auth.js';
const { dashboard_info } = login_code();
import { useAuthStore } from '@/store/authStore';
import {  useRouter } from 'vue-router';

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
dashboardInfo.value.customers=res.customers;
dashboardInfo.value.staff_members=res.staff_members;
dashboardInfo.value.cards=res.cards;
dashboardInfo.value.purchases=res.purchases;
dashboardInfo.value.redemptions=res.redemptions;
dashboardInfo.value.cancellations=res.cancellations;

//console.log(dashboardInfo.value.customers);


} catch (error) {
console.error("Error fetching transactions:", error);
}
}

// Doughnut chart configuration
const chartConfig = {
  type: 'doughnut',
  data: {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Votes',
        data: [300, 50, 100], // Data for each label
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom', // Position of the legend
      },
      tooltip: {
        enabled: true, // Enable tooltips
      },
    },
  },
};



// Doughnut chart configuration
const chartConfig1 = {
  type: 'pie',
  data: {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Votes',
        data: [300, 50, 100], // Data for each label
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
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



const chartConfig2 = {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Votes',
        data: [300, 50, 100], // Data for each label
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
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


const chartConfig4 = {
  type: 'line',
  data: {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Votes',
        data: [300, 50, 100], // Data for each label
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
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


// Reference for the canvas
const chartRef = ref(null);
let chartInstance = null;


const chartRef1 = ref(null);
let chartInstance1 = null;



const chartRef2 = ref(null);
let chartInstance2 = null;



const chartRef4 = ref(null);
let chartInstance4 = null;

// Function to render the chart
const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy(); // Cleanup existing chart
  }
  chartInstance = new Chart(chartRef.value, chartConfig);

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
onMounted(() => {
  if (authStore.token) {
    
    renderChart();
  get_dashboard_info();
    
  } else {
    //console.log('22');
    router.push({name: 'userLogin'});
  }
 
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy(); // Cleanup memory
  }
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
            <div class="col-md-4">
                  <div class="card card_graph">
                        <div class="card-header">
                              
                        </div>
                        <div class="card-body">
                              <canvas ref="chartRef"></canvas>       
                              </div>
                  </div>
            </div>
            <div class="col-md-4">
                  <div class="card card_graph">
                        <div class="card-header">
                              
                        </div>
                        <div class="card-body">
                              <canvas ref="chartRef1"></canvas>       
                              </div>
                  </div>
            </div>
            <div class="col-md-4">
                  <div class="card card_graph">
                        <div class="card-header">
                              
                        </div>
                        <div class="card-body">
                              <canvas ref="chartRef2"></canvas>       
                              </div>
                  </div>
            </div>
        
      </div>
      <div class="row">
            <div class="col-md-4">  
            <div class="card card_graph">
                  <div class="card-header">

                  </div>
                  <div class="card-body">
                        <canvas ref="chartRef4"></canvas> 
                  </div>
            </div>
      </div>
      </div>
    </template>
    <style scoped>
.card_graph{
      height: 330px;
}
</style>
    