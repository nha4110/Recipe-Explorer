<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-4 justify-content-between">
    <!-- Left: Logo text -->
    <a class="navbar-brand fw-bold" href="/">🍲 Recipe Explorer</a>

    <!-- Right: User icon dropdown -->
    <div class="dropdown">
      <i
        class="bi bi-person-circle fs-3 dropdown-toggle"
        data-bs-toggle="dropdown"
        role="button"
        aria-expanded="false"
        style="cursor: pointer"
      ></i>
      <ul class="dropdown-menu dropdown-menu-end">
        <li v-if="user">
          <a class="dropdown-item" href="#">Profile</a>
          <a class="dropdown-item" href="#" @click="$emit('logout')">Logout</a>
        </li>
        <li v-else>
          <a class="dropdown-item" href="/login">Login</a>
          <a class="dropdown-item" href="/signup">Signup</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
defineProps(['user'])
defineEmits(['logout'])
</script>
