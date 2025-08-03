<!-- src/components/RecipeCard.vue -->
<template>
  <div
    class="card mb-3 cursor-pointer position-relative"
    @click="$emit('select', recipe)"
  >
    <img
      :src="imageUrl"
      class="card-img-top"
      alt="recipe image"
      style="object-fit: cover; height: 200px;"
    />
    <button
      class="btn btn-sm position-absolute top-0 start-0 m-2 z-3 shadow-sm"
      :class="liked ? 'btn-danger text-white' : 'btn-light'"
      @click.stop="handleLike"
      :disabled="liked"
      :aria-pressed="liked"
      aria-label="Like recipe"
    >
      ❤️
    </button>
    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text text-muted">{{ shortDescription }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  recipe: Object,
  userId: Number
})

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const liked = ref(false)

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

const handleLike = async () => {
  if (liked.value) return // Prevent duplicate likes

  if (!props.userId) {
    alert('User ID not provided. Please log in.')
    return
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/favorites`,
      {
        user_id: props.userId,
        recipe_id: props.recipe.id
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 200 || response.status === 201) {
      liked.value = true
    } else {
      throw new Error(`Unexpected status: ${response.status}`)
    }
  } catch (err) {
    console.error('Error adding to favorites:', err)
    alert('Failed to add to favorites.')
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
