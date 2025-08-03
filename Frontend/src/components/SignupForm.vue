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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()

// Optional: Check if API route is working on mount
onMounted(async () => {
  try {
    const test = await fetch('/api/signup')
    if (!test.ok) {
      console.warn('API route is not accepting GET requests as expected')
    } else {
      console.warn('⚠️ Your /api/signup is responding to GET. It should not.')
    }
  } catch (err) {
    console.error('API route test failed:', err)
  }
})

async function handleSignup() {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  try {
    const res = await fetch('/api/signup', {
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
