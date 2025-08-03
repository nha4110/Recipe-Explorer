<template>
  <form @submit.prevent="handleSignup">
    <div class="mb-3">
      <label for="username" class="form-label">Username</label>
      <input v-model="username" type="text" id="username" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input v-model="password" type="password" id="password" class="form-control" required />
    </div>

    <div class="mb-3">
      <label for="confirmPassword" class="form-label">Confirm Password</label>
      <input v-model="confirmPassword" type="password" id="confirmPassword" class="form-control" required />
    </div>

    <button type="submit" class="btn btn-primary">Sign Up</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Refs
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()

// Load API base URL from env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function handleSignup() {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Unknown error occurred')
    }

    alert('Signup successful!')
    router.push('/login')
  } catch (err) {
    console.error('Signup failed:', err)
    alert('Signup failed: ' + err.message)
  }
}
</script>
