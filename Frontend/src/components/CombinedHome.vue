<template>
  <div class="row m-4">
    <div class="col-md-3">
      <!-- FilterSidebar -->
      <div class="mb-4">
        <input
          type="text"
          class="form-control mb-2"
          placeholder="Search by title..."
          :value="search"
          @input="search = $event.target.value"
        />
        <select class="form-select" :value="category" @change="category = $event.target.value">
          <option value="">All Categories</option>
          <option value="Dessert">Dessert</option>
          <option value="Main">Main</option>
          <option value="Vegan">Vegan</option>
        </select>
      </div>
    </div>

    <div class="col-md-9">
      <!-- RecipeList -->
      <div class="row">
        <div class="col-md-4" v-for="recipe in filteredRecipes" :key="recipe.id">
          <!-- RecipeCard -->
          <div class="card mb-3">
            <img :src="recipe.image" class="card-img-top" :alt="recipe.title">
            <div class="card-body">
              <h5 class="card-title">{{ recipe.title }}</h5>
              <p class="card-text">{{ recipe.description }}</p>
              <button class="btn btn-outline-danger" @click="toggleFavorite(recipe.id)">
                {{ favorites.includes(recipe.id) ? '♥ Liked' : '♡ Like' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Local user for future use
const user = ref(JSON.parse(localStorage.getItem('user')) || null)

// States
const recipes = ref([])
const search = ref('')
const category = ref('')
const favorites = ref(JSON.parse(localStorage.getItem('favorites')) || [])

// Load recipe data
onMounted(() => {
  fetch('/recipes.json')
    .then(res => res.json())
    .then(data => recipes.value = data)
})

// Filtered recipes logic
const filteredRecipes = computed(() => {
  return recipes.value.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.value.toLowerCase())
    const matchesCat = !category.value || r.category === category.value
    return matchesSearch && matchesCat
  })
})

// Favorite toggle
function toggleFavorite(id) {
  const index = favorites.value.indexOf(id)
  if (index > -1) favorites.value.splice(index, 1)
  else favorites.value.push(id)
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}
</script>
