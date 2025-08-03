<template>
  <div>
    <div class="d-flex mb-3">
      <button
        class="btn me-2"
        :class="selectedTab === 'favorites' ? 'btn-primary' : 'btn-outline-primary'"
        @click="selectedTab = 'favorites'"
      >
        My Favorite Recipes
      </button>
      <button
        class="btn"
        :class="selectedTab === 'created' ? 'btn-primary' : 'btn-outline-primary'"
        @click="selectedTab = 'created'"
      >
        My Created Recipes
      </button>
    </div>

    <!-- Favorites Tab -->
    <div v-if="selectedTab === 'favorites'">
      <h5>My Favorite Recipes</h5>
      <ul v-if="favorites.length > 0">
        <li v-for="recipe in favorites" :key="recipe.id">
          {{ recipe.title }}
        </li>
      </ul>
      <p v-else>No favorite recipes found.</p>
    </div>

    <!-- Created Tab -->
    <div v-if="selectedTab === 'created'">
      <h5>My Created Recipes</h5>
      <ul v-if="created.length > 0">
        <li v-for="recipe in created" :key="recipe.id">
          {{ recipe.title }}
        </li>
      </ul>
      <p v-else>You haven't created any recipes yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps(['user'])

const favorites = ref([])
const created = ref([])
const selectedTab = ref('favorites')

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

onMounted(async () => {
  try {
    const [favRes, createdRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/favorites/${props.user.id}`),
      fetch(`${API_BASE_URL}/api/recipes/user/${props.user.id}`)
    ])

    if (!favRes.ok || !createdRes.ok) {
      throw new Error('Failed to load recipe data.')
    }

    favorites.value = await favRes.json()
    created.value = await createdRes.json()
  } catch (err) {
    console.error('Error loading recipes:', err)
    favorites.value = []
    created.value = []
  }
})
</script>
