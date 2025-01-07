<template>
    <div class="sidebar">
    <div class="heading">
        <div class="p-3">
            <span class="big-text">Mukafa</span> <span class="small-text">Loyalty Program</span>
        </div>
    
  </div>
      <ul class="nav flex-column">
        <li class="nav-item mt-2">
          <router-link class="nav-link" to="/settings">Settings</router-link>
        </li>
        <li class="nav-item">
          <a
            class="nav-link dropdown-toggle"
            href="#reports"
            data-bs-toggle="collapse"
            aria-expanded="false"
            aria-controls="reports"
          >
            Reports
          </a>
          <div class="collapse" id="reports">
            <ul class="list-unstyled ps-3">
              <li>
                <router-link class="nav-link" to="/reports/credit">Credit</router-link>
              </li>
              <li>
                <router-link class="nav-link" to="/reports/debit">Debit</router-link>
              </li>
              <li>
                <router-link class="nav-link" to="/reports/refund">Refund</router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "SidebarComponent",
  };
  </script>
  
  <style scoped>
 
    
    .heading {
      color: #c93062;
      background-color: #fbebec;
      height: 60px;
    }
    .heading .big-text {
      font-size: 20px;
      font-weight: 900; /* Extra bold */
    }
    .heading .small-text {
      font-size: 14px;
      font-weight: 600; /* Semi bold */
    }
  /* Sidebar container styling */
  .sidebar {
    height: 100vh;
    width: 250px;
    background-color: #ecf0fb;
    border-right: 1px solid #d3d8e8;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  
  /* Sidebar header */
  .sidebar h4 {
    margin: 0;
    font-weight: bold;
    color: #3752ad;
    border-bottom: 1px solid #d3d8e8;
  }
  
  /* Sidebar navigation links */
  .nav-link {
    color: #3752ad;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 0;
    display: block;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
  }
  
  /* Hover state for links */
  .nav-link:hover {
    background-color: #3752ad;
    color: #ffffff !important;
    font-weight: bold;
  }
  
  /* Remove spacing between sidebar and links */
  .nav-item {
    margin: 0;
    padding: 0;
  }
  
  .nav-item .collapse .nav-link {
    padding-left: 40px; /* Indentation for sub-links */
  }
  </style>
  