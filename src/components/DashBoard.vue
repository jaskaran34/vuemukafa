<template>
    <div class="d-flex">
      <!-- Sidebar -->
      <SidebarComponent />
  
      <!-- Main Content -->
      <div class="flex-grow-1">
        <!-- Navbar -->
        <NavbarComponent />
  
        <!-- Content Area -->
        <div class="p-4">
          <router-view />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import NavbarComponent from "@/components/design/NavbarComponent.vue";
  import SidebarComponent from "@/components/design/SidebarComponent.vue";
  
  export default {
    name: "DashboardComponent",
    components: {
      NavbarComponent,
      SidebarComponent,
    },
  };
  </script>
  