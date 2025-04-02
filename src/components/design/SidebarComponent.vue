<script setup>
 /*
 import { useRoute } from "vue-router";
 const route = useRoute();

 const isActive = (path) => route.path === path;
 */ 
 </script>

<template>
    <div class="sidebar">
    <div class="heading">
        <div class="p-3">
            <span class="big-text">Mukafa</span> <span class="small-text">Loyalty Program</span>
        </div>
    
  </div>
      <ul class="nav flex-column">
        <li class="nav-item mt-4">
          <router-link class="nav-link" :to="{ name: 'Dashboard' }">Dashboard</router-link>
        </li>
        <li class="nav-item">
        <router-link class="nav-link" 
               :to="{ name: 'settings_addmember' }">Register Customer</router-link>
              </li>

              
              <li class="nav-item">
          <router-link class="nav-link"
            :to="{ name: 'addPurchase' }">Add Purchase</router-link>
        </li>

              <li class="nav-item">
          <router-link class="nav-link"
            :to="{ name: 'issue_points' }">Issue Points</router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link"
           :to="{ name: 'redumption' }">Redemption</router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link"
            :to="{ name: 'return' }">Cancellation / Return</router-link>
        </li><!--
        
        <li class="nav-item">
          <router-link class="nav-link"
            :to="{ name: 'cancel_completed' }">Cancel Completed Orders</router-link>
        </li>
        
-->

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
                <router-link class="nav-link" 
               :to="{ name: 'verify_mobile' }">Find User</router-link>
              </li>
             
              <li>
                <router-link class="nav-link" 
                 :to="{ name: 'report_transactions' }">Transactions</router-link>
              </li>
              <li>
                <router-link class="nav-link" 
               :to="{ name: 'report_refunds' }">Refunds</router-link>
              </li>
              <li>
                <router-link class="nav-link" 
                :to="{ name: 'report_cancel' }">Cancellation</router-link>
              </li>
              <li>
                <router-link class="nav-link" 
              :to="{ name: 'report_settle' }">Settlements</router-link>
              </li>
            </ul>
          </div>
        </li>
        

        <li class="nav-item">
          <a
            class="nav-link dropdown-toggle"
            href="#settings"
            data-bs-toggle="collapse"
            aria-expanded="false"
            aria-controls="settings"
          >
            Settings
          </a>
          <div class="collapse" id="settings">
            <ul class="list-unstyled ps-3">
              <li>
                <router-link class="nav-link" 
                 :to="{ name: 'settings_addstaff' }">Add Staff</router-link>
              </li>
              <li>
                <router-link class="nav-link" 
               :to="{ name: 'settings_bankaccounts' }">Bank Accounts</router-link>
              </li>
              
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  
  
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
    height: auto;
    min-height: 100vh;
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

  .router-link-active {
  background-color: #3752ad;
  color: white;
}
  </style>
  