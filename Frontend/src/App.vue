<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import AppFooter from './components/AppFooter.vue'

const router = useRouter()
const route = useRoute()

const user = ref(null)
const isLoggedIn = ref(false)
const showDropdown = ref(false)

onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
      isLoggedIn.value = true
    } catch (err) {
      console.error('Invalid localStorage user:', err)
      localStorage.removeItem('user')
    }
  }
})

function logout() {
  localStorage.removeItem('user')
  user.value = null
  isLoggedIn.value = false
  showDropdown.value = false
  router.push('/login')
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

// Computed: Check if current page is profile
const isProfilePage = computed(() => route.name === 'Profile')
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Header -->
    <header class="navbar navbar-light bg-light px-4 py-2 d-flex justify-content-between align-items-center">
      <h4 class="mb-0">Recipe Explorer</h4>

      <div>
        <!-- Logged In Dropdown (hide on Profile page) -->
        <div v-if="isLoggedIn && !isProfilePage" class="position-relative">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="toggleDropdown"
          >
            <i class="bi bi-person-circle fs-5 me-1"></i>
            {{ user?.username || 'Account' }}
          </button>

          <!-- Custom Dropdown Menu -->
          <ul
            v-if="showDropdown"
            class="dropdown-menu dropdown-menu-end show position-absolute mt-2"
            style="right: 0;"
          >
            <li>
              <a class="dropdown-item" @click="router.push('/profile'); showDropdown = false">Profile</a>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item" @click="logout">Logout</a>
            </li>
          </ul>
        </div>

        <!-- Not Logged In Buttons -->
        <div v-else-if="!isLoggedIn" class="d-flex gap-2">
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
