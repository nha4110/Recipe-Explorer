<template>
  <div class="row">
    <div class="col-md-4" v-for="recipe in recipes" :key="recipe.id">
      <RecipeCard
        :recipe="recipe"
        :isFavorite="favorites.includes(recipe.id)"
        @toggle-favorite="toggleFavorite"
      />
    </div>
  </div>
</template>

<script setup>
import RecipeCard from './RecipeCard.vue'
defineProps(['recipes', 'favorites'])
const emit = defineEmits(['toggle-favorite'])

function toggleFavorite(id) {
  emit('toggle-favorite', id)
}
</script>
