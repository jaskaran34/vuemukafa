<script setup>
import { useAuthStore } from '@/store/authStore';
import { ref, onMounted } from 'vue';
import login_code from '@/composables/auth.js';


const { logoutUser, returnUser } = login_code();
const authStore = useAuthStore();

const profile_pic = ref('');
const login_type = ref('');

onMounted(async () => {
  let user = await returnUser();
 // console.log(authStore.user_type);
  if(authStore.user_type){
  profile_pic.value = user.avatar;

  if (authStore.user_type === 'P') {
    login_type.value = "Partner";
  }
  if (authStore.user_type === 'S') {
    login_type.value = "Staff";
  }

}
else{
  logoutUser();
  
}
});

const logout = () => {
  logoutUser();
};
</script>

<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <!-- Left Content -->
      <div class="d-flex align-items-center">
        <button
          class="navbar-toggler me-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <!-- Center Heading -->
      <h5 class="text-center m-0">{{ login_type }} Portal</h5>

      <!-- Right Content -->
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
              <router-link class="dropdown-item" :to="{ name: 'profile' }">
                Profile
              </router-link>
            </li>
            <li>
              <a class="dropdown-item" @click="logout">Logout</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #ecf0fb;
  height: 60px;
  border-bottom: 1px solid #d3d8e8;
}

.navbar .text-center {
  flex-grow: 1; /* Ensures heading stays centered */
  text-align: center;
  font-weight: bold;
  color: #3752ad;
}

.navbar-nav {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #3752ad;
  font-weight: bold;
}

.nav-link:hover {
  background-color: #3752ad;
  color: #ffffff;
}

.dropdown-menu {
  min-width: 150px;
}

.dropdown-item {
  padding: 10px 20px;
}

.dropdown-item:hover {
  background-color: #3752ad;
  color: white;
}
</style>
