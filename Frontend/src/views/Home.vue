<template>
  <div class="row m-4">
    <!-- Filter Sidebar -->
    <div class="col-md-3">
      <div class="mb-4 p-3 border rounded shadow-sm bg-light">
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Search by title..."
          v-model="search"
          aria-label="Search recipes"
        />
        <select
          class="form-select"
          v-model="category"
          aria-label="Select category"
        >
          <option value="">All Categories</option>
          <option value="Dessert">Dessert</option>
          <option value="Main">Main</option>
          <option value="Vegan">Vegan</option>
        </select>
      </div>
    </div>

    <!-- Recipe List -->
    <div class="col-md-9">
      <div class="row g-3">
        <div class="col-md-4" v-for="recipe in filteredRecipes" :key="recipe.id">
          <RecipeCard
            :recipe="formatRecipe(recipe)"
            :userId="user?.id"
            :isLiked="favoriteIds.has(recipe.id)"
            @select="openModal"
          />
        </div>
      </div>

      <p v-if="filteredRecipes.length === 0" class="text-center mt-4">
        No recipes found.
      </p>
    </div>

    <!-- Recipe Modal -->
    <RecipeModal
      v-if="selectedRecipe"
      :recipe="formatRecipe(selectedRecipe)"
      @close="selectedRecipe = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RecipeCard from '../components/RecipeCard.vue'
import RecipeModal from '../components/RecipeModal.vue'
import { fetchAllRecipes } from '../api/recipes'

const user = ref(JSON.parse(localStorage.getItem('user')) || null)

const recipes = ref([])
const favorites = ref([])
const search = ref('')
const category = ref('')
const selectedRecipe = ref(null)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Set of favorite recipe IDs for quick lookup
const favoriteIds = computed(() => new Set(favorites.value.map(f => f.id)))

// Load all recipes and favorites on mount
onMounted(async () => {
  try {
    recipes.value = await fetchAllRecipes()
    if (user.value?.id) {
      const favRes = await fetch(`${API_BASE_URL}/api/favorites/${user.value.id}`)
      favorites.value = await favRes.json()
    }
  } catch (err) {
    console.error('Failed to load recipes or favorites:', err)
    recipes.value = []
    favorites.value = []
  }
})

// Computed filtered recipes
const filteredRecipes = computed(() => {
  return recipes.value.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory = !category.value || r.category === category.value
    return matchesSearch && matchesCategory
  })
})

const openModal = (recipe) => {
  selectedRecipe.value = recipe
}

// Helper: fix image URLs if needed
const formatRecipe = (recipe) => {
  if (recipe.image && !recipe.image.startsWith('http') && !recipe.image.startsWith('/assets/')) {
    return { ...recipe, image: `/assets/${recipe.image}` }
  }
  return recipe
}
</script>

<style scoped>
/* Add a subtle hover effect on recipe cards */
.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
</style>
