<template>
  <div>
    <h5>My Favorite Recipes</h5>
    <ul>
      <li v-for="recipe in favorites" :key="recipe.id">{{ recipe.title }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['user'])
const favorites = ref([])

onMounted(async () => {
  const res = await fetch(`http://localhost:8080/api/favorites/${props.user.id}`)
  favorites.value = await res.json()
})
</script>