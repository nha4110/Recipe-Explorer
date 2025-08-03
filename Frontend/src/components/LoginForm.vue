<template>
  <form @submit.prevent="login">
    <div class="mb-3">
      <label>Email</label>
      <input type="email" class="form-control" v-model="email" required>
    </div>
    <div class="mb-3">
      <label>Password</label>
      <input type="password" class="form-control" v-model="password" required>
    </div>
    <button class="btn btn-primary w-100" type="submit">Login</button>
    <div class="text-danger mt-2" v-if="error">{{ error }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

function login() {
  if (email.value === 'user@example.com' && password.value === '123') {
    localStorage.setItem('user', email.value)
    router.push('/')
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>
