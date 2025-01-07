<script setup>
import { useAuthStore } from '@/store/authStore';
import { ref,onMounted } from 'vue';
import login_code from '@/composables/auth.js';
const { logoutUser } = login_code();
const authStore = useAuthStore();

const profile_pic = ref('');
onMounted(() => { 
    profile_pic.value= authStore.user.avatar
    

});
const logout = () => {
    logoutUser();
};

</script>
<template>
   
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end">
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  :src="profile_pic"
                  alt="Profile"
                  class="rounded-circle"
                  width="50"
                  height="50"
                />
              </a>
              <ul class="dropdown-menu" aria-labelledby="userDropdown">
                <li>
  <router-link class="dropdown-item" to="/profile">Profile</router-link>
</li>
<li>
  <a class="dropdown-item" @click="logout" >Logout</a>
</li>

              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  

  
  <style scoped>
  .navbar {
    background-color: #ecf0fb;
    height: 60px;
    border-bottom: 1px solid #d3d8e8;
  }
  
  .navbar-nav {
    display: flex;
    align-items: center; /* Vertically center items */
  }
  
  .nav-item {
    width: 100%; /* Makes the nav-item span full width */
  }
  
  .nav-link {
    color: #3752ad;
    font-weight: bold;
    display: block; /* Makes the nav-link take full width */
    width: 100%; /* Ensure full width of the parent */
    padding: 10px 15px; /* Optional: Adjust for better spacing */
  }
  
  .nav-link:hover {
    background-color: #3752ad;
    color: #ffffff;
    font-weight: bold;
  }
  
  .dropdown-menu {
    min-width: 150px;
  }
  
  .dropdown-item {
    padding: 10px 20px; /* Optional: Adds more space for the dropdown items */
  }
  
  .dropdown-item:hover {
    background-color: #3752ad;
    color: white;
  }
  </style>
  