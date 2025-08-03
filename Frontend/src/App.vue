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

const isProfilePage = computed(() => route.name === 'Profile')
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Header -->
    <header class="navbar navbar-light bg-light px-4 py-2 d-flex justify-content-between align-items-center">
    <h4 class="mb-0" style="cursor: pointer;" @click="router.push('/')">Recipe Explorer</h4>

      <div>
        <!-- Logged In Dropdown -->
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
          <div
            v-if="showDropdown"
            class="dropdown-menu-custom position-absolute mt-2"
          >
            <div class="dropdown-item-custom" @click="router.push('/profile'); showDropdown = false">
              Profile
            </div>
            <div class="dropdown-item-custom" @click="logout">
              Logout
            </div>
          </div>
        </div>

        <!-- Not Logged In -->
        <div v-else-if="!isLoggedIn" class="d-flex gap-2">
          <button class="btn btn-outline-primary" @click="router.push('/login')">Login</button>
          <button class="btn btn-primary" @click="router.push('/signup')">Sign Up</button>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="container flex-grow-1 my-4">
      <RouterView />
    </main>

    <!-- Footer -->
    <AppFooter class="mt-auto" />
  </div>
</template>

<style scoped>
.dropdown-menu-custom {
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 0.5rem 0;
  min-width: 140px;
}

.dropdown-item-custom {
  padding: 0.5rem 1rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.dropdown-item-custom:hover {
  background-color: #f8f9fa;
}
</style>
