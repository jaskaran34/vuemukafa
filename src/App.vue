<template>
  <div id="app">
    <main class="container-fluid mt-1">
    <!-- Only show layout if the user is authenticated -->
    <div v-if="isAuthenticated" class="d-flex">
      <!-- Sidebar -->
      <SidebarComponent />
  
      <!-- Main Content -->
      <div class="flex-grow-1">
        <!-- Navbar -->
        <NavbarComponent />
  
        <!-- Router View for dynamic content -->
        <router-view />
      </div>
    </div>

    <!-- Show if user is not authenticated -->
    <div v-else>
      <router-view />
    </div>
  </main>
  </div>
</template>

<script setup>
import SidebarComponent from "@/components/design/SidebarComponent.vue";
import NavbarComponent from "@/components/design/NavbarComponent.vue";
import { useAuthStore } from '@/store/authStore';
import { computed } from "vue";

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

</script>
 <style>
.template_structure{
  margin-left: 12px;
  margin-top: 8px;;
}
.form-control{
width: 500px !important;
}
.amt{
  text-align: right;
}
</style>