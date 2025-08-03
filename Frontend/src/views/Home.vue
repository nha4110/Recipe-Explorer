<!-- Home.vue -->
<template>
  <div class="row m-4">
    <div class="col-md-3">
      <FilterSidebar v-model:search="search" v-model:category="category" />
    </div>
    <div class="col-md-9">
      <RecipeList
        :recipes="filteredRecipes"
        :favorites="favorites"
        @toggle-favorite="toggleFavorite"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RecipeList from '../components/RecipeList.vue'
import FilterSidebar from '../components/FilterSidebar.vue'

// Get user from localStorage (for favorite control or future use)
const user = ref(JSON.parse(localStorage.getItem('user')) || null)

const recipes = ref([])
const search = ref('')
const category = ref('')
const favorites = ref(JSON.parse(localStorage.getItem('favorites')) || [])

onMounted(() => {
  fetch('/recipes.json')
    .then(res => res.json())
    .then(data => recipes.value = data)
})

const filteredRecipes = computed(() => {
  return recipes.value.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.value.toLowerCase())
    const matchesCat = !category.value || r.category === category.value
    return matchesSearch && matchesCat
  })
})

function toggleFavorite(id) {
  const index = favorites.value.indexOf(id)
  if (index > -1) favorites.value.splice(index, 1)
  else favorites.value.push(id)
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}
</script>
