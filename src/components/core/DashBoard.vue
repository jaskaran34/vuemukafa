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
    labels: ['KB', 'MB', 'GB','TB'],
    datasets: [
      {
        label: 'Tier',
        data: [26, 4, 3,0], // Data for each label
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



const chartConfig2 = {
  type: 'bar',
  data: {
    labels: ['Oct-24','Nov-24','Dec-24', 'Jan-25', 'Feb-25','Mar-25'],
    datasets: [
      {
        label: 'New Customers',
        data: [100,200,150,300, 50, 100], // Data for each label
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


const chartConfig4 = {
  type: 'line',
  data: {
    labels: ['11-03-2025','12-03-2025', '13-03-2025', '14-03-2025', '15-03-2025', '16-03-2025', '17-03-2025'], // X-axis labels
    datasets: [
      {
      
        label: 'Purchases',
        data: [10, 1, 17, 1, 5, 13,5], // Y-axis values
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.4, // Smooth curves
      },
      {
        label: 'Redemptions',
        data: [10, 0, 0, 2, 4, 4,1],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Cancellations',
        data: [4, 2, 4, 6, 1, 1,3],
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
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Transactions weekly', // Label for X-axis
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count', // Label for Y-axis
        },
        beginAtZero: true,
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
      </div>
    </template>
    <style scoped>

</style>
    