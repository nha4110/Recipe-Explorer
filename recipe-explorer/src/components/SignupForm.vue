<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

async function handleSignup() {
  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value
      })
    })

    if (!res.ok) throw new Error('Signup failed')

    // Save user locally (fake login)
    localStorage.setItem(
      'recipe_user',
      JSON.stringify({ username: username.value, email: email.value })
    )

    alert('Signup successful! Please check your email.')
    router.push('/')
  } catch (err) {
    console.error(err)
    alert('Signup failed: ' + err.message)
  }
}
</script>
