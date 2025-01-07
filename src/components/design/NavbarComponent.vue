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
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                  class="rounded-circle"
                  width="30"
                  height="30"
                />
              </a>
              <ul class="dropdown-menu" aria-labelledby="userDropdown">
                <li>
                  <a class="dropdown-item" href="#" @click="goToProfile">Profile</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="logout">Logout</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: "NavbarComponent",
    setup() {
      const goToProfile = () => {
        console.log("Navigating to Profile");
      };
  
      const logout = () => {
        console.log("Logging out");
      };
  
      return {
        goToProfile,
        logout,
      };
    },
  };
  </script>
  
  <style>
  .navbar {
    background-color: #ecf0fb;
    height: 60px;
    border-bottom: 1px solid #d3d8e8;
  }
  
  .nav-link {
    color: #3752ad;
    font-weight: bold;
  }
  
  .nav-link:hover {
    background-color: #3752ad;
    color: #ffffff;
    font-weight: bold;
  }
  </style>
  