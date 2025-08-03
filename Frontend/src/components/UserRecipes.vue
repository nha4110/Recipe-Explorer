<template>
  <div>
    <h5>My Favorite Recipes</h5>
    <ul>
      <li v-for="recipe in favorites" :key="recipe.id">
        {{ recipe.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps(['user'])
const favorites = ref([])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/favorites/${props.user.id}`)
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to load favorites')
    }
    favorites.value = await res.json()
  } catch (err) {
    console.error('Error loading favorites:', err)
    favorites.value = []
  }
})
</script>
