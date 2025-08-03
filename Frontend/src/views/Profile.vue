<template>
  <div class="container mt-4">
    <h3 class="text-center mb-3">User Profile</h3>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <div><strong>Username:</strong> {{ user?.username }}</div>
      <button class="btn btn-danger" @click="logout">Logout</button>
    </div>

    <!-- Personal Note Section -->
    <div class="mb-3">
      <label for="note" class="form-label">Personal Note</label>
      <textarea
        id="note"
        class="form-control"
        rows="3"
        v-model="note"
        :disabled="loading"
      />
      <button
        class="btn btn-primary mt-2"
        @click="saveNote"
        :disabled="loading"
      >
        {{ loading ? 'Saving...' : 'Update Note' }}
      </button>
    </div>

    <!-- Tab Navigation -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="item in tabs" :key="item">
        <button
          class="nav-link"
          :class="{ active: tab === item }"
          @click="tab = item"
        >
          {{ item }}
        </button>
      </li>
    </ul>

    <!-- Dynamic Component Rendering -->
    <component :is="components[tab]" :user="user" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

// Component imports
import UserInfo from '@/components/UserInfo.vue'
import UserRecipes from '@/components/UserRecipes.vue'
import CreateRecipe from '@/components/CreateRecipe.vue'

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user')))
const note = ref(user.value?.note || '')
const loading = ref(false)

const tab = ref('User Information')
const tabs = ['User Information', 'My Recipes', 'Create Recipe']
const components = {
  'User Information': UserInfo,
  'My Recipes': UserRecipes,
  'Create Recipe': CreateRecipe,
}

// Load latest note from backend on mount
onMounted(async () => {
  if (!user.value?.id) return
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/${user.value.id}`)
    const data = await res.json()
    if (data.note !== undefined) {
      note.value = data.note
      user.value.note = data.note
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  } catch (err) {
    console.error('Error loading user note:', err)
  }
})

// Sync note to localStorage whenever it changes
watch(note, (newVal) => {
  if (user.value) {
    user.value.note = newVal
    localStorage.setItem('user', JSON.stringify(user.value))
  }
})

// Logout function with page reload
function logout() {
  localStorage.removeItem('user')
  router.push('/login').then(() => {
    window.location.reload()
  })
}

// Save note to backend
async function saveNote() {
  if (!user.value?.id) {
    alert('No user loaded')
    return
  }

  loading.value = true
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/${user.value.id}/note`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note: note.value }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to save note')
    }

    const updated = await res.json()
    user.value.note = updated.note
    localStorage.setItem('user', JSON.stringify(user.value))
    alert('Note updated successfully.')
  } catch (err) {
    console.error('Error saving note:', err)
    alert('Failed to update note: ' + err.message)
  } finally {
    loading.value = false
  }
}
</script>
