<template>
  <div>
    <MyFavorites
      :recipes="recipes"
      :favorites="favorites"
      @toggle-favorite="toggleFavorite"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MyFavorites from '../components/MyFavorites.vue'

const recipes = ref([])
const favorites = ref(JSON.parse(localStorage.getItem('favorites')) || [])

onMounted(() => {
  fetch('/recipes.json')
    .then(res => res.json())
    .then(data => recipes.value = data)
})

function toggleFavorite(id) {
  const index = favorites.value.indexOf(id)
  if (index > -1) favorites.value.splice(index, 1)
  else favorites.value.push(id)
  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}
</script>
