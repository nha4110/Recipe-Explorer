<!-- src/views/Profile.vue -->
<template>
  <div class="container mt-4">
    <h3 class="text-center mb-3">User Profile</h3>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <div><strong>Username:</strong> {{ user?.username }}</div>
      <button class="btn btn-danger" @click="logout">Logout</button>
    </div>

    <div class="mb-3">
      <label for="note" class="form-label">Personal Note</label>
      <textarea id="note" class="form-control" rows="3" v-model="note"></textarea>
      <button class="btn btn-primary mt-2" @click="saveNote">Save Note</button>
    </div>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="item in tabs" :key="item">
        <button class="nav-link" :class="{ active: tab === item }" @click="tab = item">{{ item }}</button>
      </li>
    </ul>

    <component :is="components[tab]" :user="user" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import UserInfo from '@/components/UserInfo.vue'
import UserRecipes from '@/components/UserRecipes.vue'
import CreateRecipe from '@/components/CreateRecipe.vue'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user')))
const note = ref(user.value?.note || '')
const tab = ref('User Information')
const tabs = ['User Information', 'My Recipes', 'Create Recipe']
const components = {
  'User Information': UserInfo,
  'My Recipes': UserRecipes,
  'Create Recipe': CreateRecipe
}

function logout() {
  localStorage.removeItem('user')
  router.push('/login')
}

async function saveNote() {
  try {
    const res = await fetch(`http://localhost:8080/api/users/${user.value.id}/note`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: note.value })
    })

    if (!res.ok) {
      throw new Error('Failed to save note')
    }

    const updated = await res.json()
    user.value.note = updated.note
    localStorage.setItem('user', JSON.stringify(user.value))
  } catch (err) {
    console.error('Error saving note:', err)
    alert('Failed to save note. Please try again.')
  }
}
</script>
