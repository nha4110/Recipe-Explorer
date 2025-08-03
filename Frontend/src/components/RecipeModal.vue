<!-- src/components/RecipeModal.vue -->
<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content bg-white p-4 rounded shadow-lg">
      <img :src="imageUrl" class="img-fluid mb-3 rounded recipe-image" alt="Recipe Image" />
      <h3>{{ recipe.title }}</h3>

      <!-- Show creator name if available -->
      <p v-if="recipe.creator_name" class="text-muted fst-italic mb-3">
        Created by: {{ recipe.creator_name }}
      </p>

      <p class="text-muted">{{ recipe.description }}</p>

      <h5>Ingredients</h5>
      <ul>
        <li v-for="(item, i) in parsedIngredients" :key="i">{{ item }}</li>
      </ul>

      <h5>Steps</h5>
      <ol>
        <li v-for="(step, i) in parsedSteps" :key="i">{{ step }}</li>
      </ol>

      <div class="mt-4 d-flex justify-content-end flex-wrap gap-2">
        <button class="btn btn-outline-danger" @click="handleDelete">🗑 Delete</button>
        <button class="btn btn-secondary" @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import axios from 'axios'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['close', 'deleted'])

const imageUrl = computed(() => {
  const img = props.recipe.image
  if (!img) return '/assets/default.png'
  if (img.startsWith('http') || img.startsWith('data:image')) {
    return img
  }
  return `/assets/${img}`
})

const parsedIngredients = computed(() =>
  typeof props.recipe.ingredients === 'string'
    ? props.recipe.ingredients.split('\n').filter(Boolean)
    : props.recipe.ingredients || []
)

const parsedSteps = computed(() =>
  typeof props.recipe.steps === 'string'
    ? props.recipe.steps
        .replace(/^\d+\.\s*/gm, '')
        .split('\n')
        .filter(Boolean)
    : props.recipe.steps || []
)

const handleDelete = async () => {
  const confirmDelete = confirm('Are you sure you want to delete this recipe? This action cannot be undone.')
  if (!confirmDelete) return

  try {
    await axios.delete(`/api/recipes/${props.recipe.id}`)
    alert('Recipe deleted.')
    emit('deleted', props.recipe.id)
    emit('close')
  } catch (err) {
    console.error('Error deleting recipe:', err)
    alert('Failed to delete recipe.')
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.recipe-image {
  max-height: 300px;
  object-fit: cover;
  width: 100%;
}
</style>
