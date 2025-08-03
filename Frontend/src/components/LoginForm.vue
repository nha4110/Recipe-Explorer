<template>
  <form @submit.prevent="handleLogin" class="needs-validation">
    <div class="mb-3">
      <label for="username" class="form-label">Username</label>
      <input id="username" type="text" class="form-control" v-model="username" required />
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input id="password" type="password" class="form-control" v-model="password" required />
    </div>

    <button class="btn btn-primary w-100 mb-2" type="submit">Login</button>

    <div class="text-center">
      <span class="text-muted">Don't have an account?</span>
      <button @click="goToSignup" class="btn btn-link p-0 ms-1">Sign Up</button>
    </div>

    <div class="text-danger text-center mt-2" v-if="error">{{ error }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login as loginApi } from '../api/login.js'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function handleLogin() {
  error.value = ''
  try {
    const res = await loginApi({ username: username.value, password: password.value })

    // Save user to localStorage
    localStorage.setItem('user', JSON.stringify(res.user))

    // Redirect to home and reload the page
    router.push('/').then(() => {
      window.location.reload()
    })
  } catch (err) {
    error.value = err?.response?.data?.error || err.message || 'Login failed'
  }
}


function goToSignup() {
  router.push('/signup')
}
</script>
