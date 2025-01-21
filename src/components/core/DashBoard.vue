<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Chart } from "chart.js/auto";

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
        position: 'top', // Position of the legend
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
  renderChart();
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
            <div class="col-md-4">
                  <div class="card">
                        <div class="card-header">
                              <h5>Total Members</h5>
                        </div>
                        <div class="card-body">
                                    30
                              </div>
                  </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                        <div class="card-header">
                              <h5>Total Cards</h5>
                        </div>
                        <div class="card-body">
                                4    
                              </div>
                  </div>
            </div>

            <div class="col-md-4">
              <div class="card">
                        <div class="card-header">
                              <h5>Total Transactions</h5>
                        </div>
                        <div class="card-body">
                                35    
                              </div>
                  </div>
            </div>
  </div>
      <div class="row mt-2 p-2">
            <div class="col-md-4">
                  <div class="card">
                        <div class="card-header">
                              
                        </div>
                        <div class="card-body">
                              <canvas ref="chartRef"></canvas>       
                              </div>
                  </div>
            </div>
            <div class="col-md-4">
                  <div class="card">
                        <div class="card-header">
                              
                        </div>
                        <div class="card-body">
                              <canvas ref="chartRef1"></canvas>       
                              </div>
                  </div>
            </div>
            <div class="col-md-4">
                  <div class="card">
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
            <div class="card">
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
.card{
      height: 330px;
}
</style>
    