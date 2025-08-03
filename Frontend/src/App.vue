<!-- App.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import AppFooter from './components/AppFooter.vue'

const router = useRouter()
const user = ref(null)

const isLoggedIn = ref(false)

onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
    isLoggedIn.value = true
  }
})

function logout() {
  localStorage.removeItem('user')
  user.value = null
  isLoggedIn.value = false
  router.push('/login')
}
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Header -->
    <header class="navbar navbar-light bg-light px-4 py-2 d-flex justify-content-between align-items-center">
      <h4 class="mb-0">Recipe Explorer</h4>

      <div>
        <!-- Logged In Dropdown -->
        <div v-if="isLoggedIn" class="dropdown">
          <button
            class="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person-circle fs-5 me-1"></i>
            {{ user?.username || 'Account' }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" @click="router.push('/profile')">Profile</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item" @click="logout">Logout</a></li>
          </ul>
        </div>

        <!-- Not Logged In Buttons -->
        <div v-else class="d-flex gap-2">
          <button class="btn btn-outline-primary" @click="router.push('/login')">Login</button>
          <button class="btn btn-primary" @click="router.push('/signup')">Sign Up</button>
        </div>
      </div>
    </header>

    <!-- Main View -->
    <main class="container flex-grow-1 my-4">
      <RouterView />
    </main>

    <!-- Footer -->
    <AppFooter class="mt-auto" />
  </div>
</template>

<style scoped>
.navbar h4 {
  font-weight: bold;
}
</style>
