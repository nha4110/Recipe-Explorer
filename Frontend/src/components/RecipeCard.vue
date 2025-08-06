<template>
  <div
    class="card mb-3 cursor-pointer position-relative"
    @click="$emit('select', recipe)"
    style="max-height: 350px;"
  >
    <img
      :src="imageUrl"
      class="card-img-top"
      alt="recipe image"
      style="object-fit: cover; height: 200px;"
    />
    <button
      class="btn btn-sm position-absolute top-0 start-0 m-2 z-3 shadow-sm"
      :class="liked ? 'btn-danger text-white' : 'btn-outline-secondary'"
      @click.stop="handleLike"
      :aria-pressed="liked"
      aria-label="Like recipe"
    >
      {{ liked ? '♥' : '♡' }}
    </button>
    <div class="card-body d-flex flex-column" style="height: 130px;">
      <h5 class="card-title mb-2 title-wrap">{{ recipe.title }}</h5>
      <p class="card-text text-muted description-clamp">{{ shortDescription }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  recipe: Object,
  userId: Number,
  isLiked: {
    type: Boolean,
    default: false
  }
})

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const liked = ref(props.isLiked)

watch(() => props.isLiked, (newVal) => {
  liked.value = newVal
})

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
  if (!props.userId) {
    alert('User ID not provided. Please log in.')
    return
  }

  try {
    if (!liked.value) {
      const response = await axios.post(
        `${API_BASE_URL}/api/favorites`,
        {
          user_id: props.userId,
          recipe_id: props.recipe.id
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (response.status === 200 || response.status === 201) {
        liked.value = true
        window.location.reload()
      } else {
        throw new Error(`Unexpected status: ${response.status}`)
      }
    } else {
      const response = await axios.delete(
        `${API_BASE_URL}/api/favorites`,
        {
          data: {
            user_id: props.userId,
            recipe_id: props.recipe.id
          },
          headers: { 'Content-Type': 'application/json' }
        }
      )
      if (response.status === 200) {
        liked.value = false
      } else {
        throw new Error(`Unexpected status: ${response.status}`)
      }
    }
  } catch (err) {
    console.error('Error updating favorites:', err)
    alert('Failed to update favorites.')
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

/* Clamp description text to 3 lines with ellipsis */
.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 3.6em;
}

/* NEW: Clamp long titles to 2 lines */
.title-wrap {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.1rem;
  font-weight: 600;
  min-height: 2.8em;
}
</style>
