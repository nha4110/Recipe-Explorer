<template>
  <div class="card mb-3">
    <img :src="recipe.image" class="card-img-top" :alt="recipe.title">
    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">{{ recipe.description }}</p>
      <button class="btn btn-outline-danger" @click="toggleFavorite">
        {{ isFavorite ? '♥ Liked' : '♡ Like' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['recipe', 'isFavorite'])
const emit = defineEmits(['toggle-favorite'])

function toggleFavorite() {
  emit('toggle-favorite', recipe.id)
}
</script>
