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

// Import sub-components
import UserInfo from '@/components/UserInfo.vue'
import UserRecipes from '@/components/UserRecipes.vue'
import CreateRecipe from '@/components/CreateRecipe.vue'

// Get backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user')))
const note = ref(user.value?.note || '')
const loading = ref(false)

// Tabs
const tab = ref('User Information')
const tabs = ['User Information', 'My Recipes', 'Create Recipe']
const components = {
  'User Information': UserInfo,
  'My Recipes': UserRecipes,
  'Create Recipe': CreateRecipe,
}

// Load user note from backend when mounted
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
    console.error('Failed to fetch user note:', err)
  }
})

// Sync note to localStorage on change
watch(note, (val) => {
  if (user.value) {
    user.value.note = val
    localStorage.setItem('user', JSON.stringify(user.value))
  }
})

// Logout and reload full page
function logout() {
  localStorage.removeItem('user')
  router.push('/').then(() => {
    window.location.reload()
  })
}


// Save note to backend
async function saveNote() {
  if (!user.value?.id) {
    alert('User not found.')
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
      const err = await res.json()
      throw new Error(err.message || 'Error saving note')
    }

    const updated = await res.json()
    user.value.note = updated.note
    localStorage.setItem('user', JSON.stringify(user.value))
    alert('Note updated successfully.')
  } catch (err) {
    console.error('Save note failed:', err)
    alert('Failed to save note: ' + err.message)
  } finally {
    loading.value = false
  }
}
</script>
