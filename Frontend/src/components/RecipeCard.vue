<!-- src/components/RecipeCard.vue -->

<template>
  <div class="card mb-3 cursor-pointer" @click="$emit('select', recipe)">
    <img
      :src="imageUrl"
      class="card-img-top"
      alt="recipe image"
      style="object-fit: cover; height: 200px;"
    />
    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text text-muted">{{ shortDescription }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['recipe'])

const imageUrl = computed(() =>
  props.recipe.image?.startsWith('http')
    ? props.recipe.image
    : `/assets/${props.recipe.image}`
)

const shortDescription = computed(() =>
  props.recipe.description?.length > 100
    ? props.recipe.description.slice(0, 100) + '...'
    : props.recipe.description
)
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
