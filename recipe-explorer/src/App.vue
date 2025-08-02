<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light px-4">
      <a class="navbar-brand" href="#">Recipe Explorer</a>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/login" class="nav-link">Login</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/favorites" class="nav-link">Favorites</RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Page content -->
    <div class="container mt-4">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.navbar-brand {
  font-weight: bold;
}
.nav-link {
  cursor: pointer;
}
</style>
