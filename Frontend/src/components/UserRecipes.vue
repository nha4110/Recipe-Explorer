<template>
  <div>
    <!-- Tab Buttons -->
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
      <div class="row">
        <div
          class="col-md-4 mb-3"
          v-for="recipe in favorites"
          :key="recipe.id"
        >
          <RecipeCard
            :recipe="formatRecipe(recipe)"
            :userId="user.id"
            :isLiked="true"
            @select="openModal"
          />
        </div>
      </div>
      <p v-if="favorites.length === 0">No favorite recipes found.</p>
    </div>

    <!-- Created Tab -->
    <div v-if="selectedTab === 'created'">
      <h5>My Created Recipes</h5>
      <div class="row">
        <div
          class="col-md-4 mb-3"
          v-for="recipe in created"
          :key="recipe.id"
        >
          <RecipeCard
            :recipe="formatRecipe(recipe)"
            :userId="user.id"
            :isLiked="favoriteIds.has(recipe.id)"
            @select="openModal"
          />
        </div>
      </div>
      <p v-if="created.length === 0">You haven't created any recipes yet.</p>
    </div>

    <!-- Recipe Modal -->
    <RecipeModal
      v-if="selectedRecipe"
      :recipe="formatRecipe(selectedRecipe)"
      :allowDelete="selectedTab === 'created'"
      @close="selectedRecipe = null"
      @deleted="handleDeletedRecipe"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import RecipeCard from './RecipeCard.vue'
import RecipeModal from './RecipeModal.vue'

const props = defineProps(['user'])

const favorites = ref([])
const created = ref([])
const selectedTab = ref('favorites')
const selectedRecipe = ref(null)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const openModal = (recipe) => {
  selectedRecipe.value = recipe
}

// Remove deleted recipe from created list and close modal if open recipe deleted
const handleDeletedRecipe = (deletedId) => {
  created.value = created.value.filter(r => r.id !== deletedId)
  if (selectedRecipe.value?.id === deletedId) {
    selectedRecipe.value = null
  }
}

// Set of favorite recipe IDs for quick lookup
const favoriteIds = computed(() => new Set(favorites.value.map(f => f.id)))

// Helper to prefix local image paths with /assets/
const formatRecipe = (recipe) => {
  if (
    recipe.image &&
    !recipe.image.startsWith('http') &&
    !recipe.image.startsWith('/assets/')
  ) {
    return {
      ...recipe,
      image: `/assets/${recipe.image}`
    }
  }
  return recipe
}

onMounted(async () => {
  try {
    const [favRes, createdRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/favorites/${props.user.id}`),
      fetch(`${API_BASE_URL}/api/recipes/user/${props.user.id}`)
    ])

    favorites.value = await favRes.json()
    created.value = await createdRes.json()
  } catch (err) {
    console.error('Error loading recipes:', err)
    favorites.value = []
    created.value = []
  }
})
</script>
