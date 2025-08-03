<template>
  <div>
    <h3>Your Favorite Recipes</h3>
    <RecipeList
      :recipes="favoriteRecipes"
      :favorites="favorites"
      @toggle-favorite="toggleFavorite"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import RecipeList from './RecipeList.vue'
defineProps(['recipes', 'favorites'])
const emit = defineEmits(['toggle-favorite'])

const favoriteRecipes = computed(() =>
  props.recipes.filter(r => props.favorites.includes(r.id))
)

function toggleFavorite(id) {
  emit('toggle-favorite', id)
}
</script>
