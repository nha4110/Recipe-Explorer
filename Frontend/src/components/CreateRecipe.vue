<template>
  <form @submit.prevent="submitRecipe">
    <div class="mb-2">
      <label class="form-label">Title</label>
      <input class="form-control" v-model="title" required />
    </div>
    <div class="mb-2">
      <label class="form-label">Description</label>
      <textarea class="form-control" v-model="description"></textarea>
    </div>
    <div class="mb-2">
      <label class="form-label">Ingredients</label>
      <textarea class="form-control" v-model="ingredients"></textarea>
    </div>
    <div class="mb-2">
      <label class="form-label">Steps</label>
      <textarea class="form-control" v-model="steps"></textarea>
    </div>
    <button class="btn btn-success" type="submit">Submit Recipe</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['user'])
const title = ref('')
const description = ref('')
const ingredients = ref('')
const steps = ref('')

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

async function submitRecipe() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.value,
        description: description.value,
        ingredients: ingredients.value,
        steps: steps.value,
        created_by: props.user.id
      })
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to submit recipe')
    }

    alert('Recipe submitted successfully!')
    title.value = ''
    description.value = ''
    ingredients.value = ''
    steps.value = ''
  } catch (err) {
    console.error('Error submitting recipe:', err)
    alert('Failed to submit recipe: ' + err.message)
  }
}
</script>
